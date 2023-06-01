import { InferenceSession, Tensor } from "onnxruntime-web";
import * as Jimp from "jimp";
import { measureRuntimeAsync } from "./utils";

export type InferenceParams = {
  image: Jimp;
  resolution: number;
};

export const RESOLUTIONS = [1024, 512, 256];

export async function initInferenceSession(
  model: any,
  providers: string[] = []
) {
  const session = await InferenceSession.create(model, {
    executionProviders: providers,
    graphOptimizationLevel: "all",
    executionMode: "parallel",
    enableCpuMemArena: true,
  });
  return session;
}
export async function runInferenceSession(
  session: InferenceSession,
  params: InferenceParams
): Promise<[any, number]> {
  const resolution = params.resolution;

  const width = resolution; // we can change speed vs quality
  const height = width;
  const imageData = params.image;

  const dims = [1, 3, width, height];
  let image = imageData.clone().resize(width, height, "bilinear");
  const imageTensor = imageDataToTensor(image, dims);

  const [predictions, inferenceTime] = await measureRuntimeAsync(() =>
    runDISModel(imageTensor, session)
  );

  const stride = width * height;
  let alphaData = await Jimp.default.create(width, height); // this is the mask image

  // write the alpha channel

  for (let i = 0; i < 4 * stride; i += 4) {
    alphaData.bitmap.data[i + 3] = predictions.data[i / 4] * 255; // alphaMask[i / 4] // there is only t
  }

  // write the imag
  const imageStride = imageData.getWidth() * imageData.getHeight();

  const needsUpscaling =
    alphaData.getWidth() != imageData.getWidth() ||
    alphaData.getHeight() != imageData.getHeight();

  if (needsUpscaling) {
    alphaData = alphaData.resize(
      imageData.getWidth(),
      imageData.getHeight(),
      "bilinear"
    );
  }

  //copy over data
  for (let i = 0; i < 4 * imageStride; i += 4) {
    alphaData.bitmap.data[i + 0] = imageData.bitmap.data[i + 0];
    alphaData.bitmap.data[i + 1] = imageData.bitmap.data[i + 1];
    alphaData.bitmap.data[i + 2] = imageData.bitmap.data[i + 2];
  }

  return [alphaData, inferenceTime];
}

async function runDISModel(preprocessedData: any, session: any): Promise<any> {
  // create feeds with the input name from model export and the preprocessed data.
  // console.log("preprocessed_data", preprocessedData)
  const inputName: string = session.inputNames[0];
  interface IAnyDict {
    [index: string]: any;
  }
  const feeds: IAnyDict = {};
  feeds[inputName] = preprocessedData;
  // console.log(feeds)
  // Run the session inference.
  const outputData = await session.run(feeds, {});
  // Get output results with the output name from the model export.
  return outputData[session.outputNames[0]];
}

function imageDataToTensor(
  image: Jimp,
  dims: number[],
  packed: boolean = false
): Tensor {
  var imageBufferData = image.bitmap.data;

  const stride = image.bitmap.width * image.bitmap.height;
  const float32Data = new Float32Array(3 * stride);

  if (packed) {
    // rgb_0, rgb_1
    dims = [dims[0], dims[2], dims[3], dims[1]];
    for (let i = 0, j = 0; i < imageBufferData.length; i += 4, j += 3) {
      float32Data[j + 0] = imageBufferData[i + 0] / 255.0 - 0.5;
      float32Data[j + 1] = imageBufferData[i + 1] / 255.0 - 0.5;
      float32Data[j + 2] = imageBufferData[i + 2] / 255.0 - 0.5;
    }
  }
  {
    // r_0, r_1, .... g_0,g_1, .... b_0
    for (let i = 0, j = 0; i < imageBufferData.length; i += 4, j += 1) {
      float32Data[j] = imageBufferData[i] / 255.0 - 0.5;
      float32Data[j + stride] = imageBufferData[i + 1] / 255.0 - 0.5;
      float32Data[j + stride + stride] = imageBufferData[i + 2] / 255.0 - 0.5;
    }
  }

  // 5. create the tensor object from onnxruntime-web.
  const inputTensor = new Tensor("float32", float32Data, dims);
  return inputTensor;
}
