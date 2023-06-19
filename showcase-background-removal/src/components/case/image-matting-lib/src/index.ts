import * as ort from 'onnxruntime-web';
// import wonnxInit, * as wonnx from "@webonnx/wonnx-wasm";

import { simd, threads } from 'wasm-feature-detect';
import {
  initInferenceSession,
  runInferenceSession,
  Imports,
  Tensor
} from './predict';
import { memoize } from 'lodash';
import { z } from 'zod';
const metadata = require('../package.json');
export * as utils from './utils';

const CACHE_VERSION = metadata.version;

const ConfigSchema = z.object({
  wasmPath: z.string().optional(),
  modelPath: z
    .string()
    .default(
      'https://cdn.img.ly/assets/showcases/image-matting/9a670c90e2fca852c909ba18fc8f80bbc5eff377574681732c1974d72aa31c05'
    ),
  resolution: z.number().default(1024),
  alphaTreshold: z
    .number()
    .default(0.0)
    .describe(
      'The alpha Threshold is used to determine if a pixel is considered to be part of the foreground or the background.'
    ),
  debug: z.boolean().default(false),
  output: z.enum(['mask', 'foreground', 'background']).default('foreground'),
  proxyToWorker: z.boolean().default(false),
  useModelCache: z.boolean().default(true),
  useSessionCache: z.boolean().default(true),
  caches: z
    .object({
      models: z.string().default(`model-cache-v${CACHE_VERSION}`),
      sessions: z.string().default(`session-cache-v${CACHE_VERSION}`)
    })
    .default({})
});

type Config = z.infer<typeof ConfigSchema>;

function createOnnxRuntimeExecutor(config: any): Imports {
  return {
    createSession: async (model: any) => {
      const capabilities = {
        simd: await simd(),
        threads: await threads(),
        SharedArrayBuffer: typeof SharedArrayBuffer !== 'undefined',
        numThreads: navigator.hardwareConcurrency ?? 4,
        cache: window.Cache ? true : false
      };

      if (!capabilities.threads) {
        console.warn(
          'Threading/SharedArrayBuffer is not supported, falling back to 1 thread. A possible reason for that might be a missing secure context. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements on what the requirements are and how to configure them.'
        );
      }

      ort.env.wasm.numThreads = capabilities.numThreads;
      ort.env.wasm.simd = capabilities.simd;
      ort.env.wasm.proxy = config.proxyToWorker;
      ort.env.wasm.wasmPaths = config.wasmPath ?? ort.env.wasm.wasmPaths;

      const ort_config: ort.InferenceSession.SessionOptions = {
        executionProviders: ['wasm', 'cpu'],
        graphOptimizationLevel: 'all',
        executionMode: 'parallel',
        enableCpuMemArena: true
      };

      return await ort.InferenceSession.create(model, ort_config);
    },
    runSession: async (session: any, inputs: Record<string, Tensor>) => {
      const feeds: Record<string, any> = {};
      for (const key in inputs) {
        const input = inputs[key];
        feeds[key] = new ort.Tensor(
          'float32',
          new Float32Array(input.data),
          input.shape
        );
      }
      const outputData = await session.run(feeds, {});
      const outputs: Record<string, Tensor> = {};
      // here is some logic error
      for (let i = 0; i < session.outputNames.length; i++) {
        const key = session.outputNames[i];
        let output: ort.Tensor = outputData[key];
        let tensor: Tensor = {
          data: output.data as Float32Array,
          shape: output.dims as number[],
          dataType: 'float32'
        };
        outputs[key] = tensor;
      }
      return outputs;
    }
  };
}

async function cacheCleanup(config: Config) {
  const expectedCacheNamesSet = new Set(Object.values(config.caches));
  caches.keys().then(
    async (cacheNames) =>
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (!expectedCacheNamesSet.has(cacheName)) {
            if (config.debug)
              console.debug('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
  );
}

function validateConfig(config?: Config): Config {
  return ConfigSchema.parse(config ?? {});
}

async function activate(config: Config, imports: Imports): Promise<any> {
  config = validateConfig(config);
  cacheCleanup(config);
  const modelCache = await caches.open(config.caches.models);

  const modelRequest = new Request(config.modelPath);
  let modelResponse = config.useModelCache
    ? await modelCache.match(modelRequest)
    : undefined;
  if (!modelResponse) {
    modelResponse = await fetch(modelRequest);
    await modelCache.put(modelRequest, modelResponse.clone());
  }

  const fileData = await modelResponse.arrayBuffer();

  return await initInferenceSession(fileData, imports);
}

async function run(
  session: any,
  image: ImageData,
  config: Config,
  imports: Imports
): Promise<ImageData> {
  config = validateConfig(config);
  if (!session) {
    throw new Error('Session not initialized');
  }
  if (!(image instanceof ImageData)) {
    throw new Error('Image not an ImageData');
  }

  const params = {
    image: image,
    resolution: config.resolution,
    output: config.output,
    alphaTreshold: config.alphaTreshold
  };
  const newImage = await runInferenceSession(session, params, imports);

  return newImage;
}

async function removeBackground(
  image: ImageData,
  config?: Config,
  imports?: Imports
): Promise<ImageData> {
  config = validateConfig(config);
  imports = imports ?? createOnnxRuntimeExecutor(config);
  if (!(image instanceof ImageData)) {
    throw new Error('Image not an ImageData');
  }
  const session = config.useSessionCache
    ? await memoize(activate)(config, imports)
    : await activate(config, imports);
  return await run(session, image, config, imports);
}

export default removeBackground;
