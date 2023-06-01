// IMPORTANT: This code is not production ready and for demo purposes only!
import * as Jimp from 'jimp';
import { env as ortEnv, InferenceSession } from 'onnxruntime-web';
import { useEffect, useRef, useState } from 'react';
import { simd, threads } from 'wasm-feature-detect';
import {
  initInferenceSession,
  RESOLUTIONS,
  runInferenceSession
} from '../utils/predict_browser';
import { measureRuntimeAsync } from '../utils/utils';

const MODEL_URL =
  'https://cdn.img.ly/assets/showcases/image-matting/9a670c90e2fca852c909ba18fc8f80bbc5eff377574681732c1974d72aa31c05';
const WASM_PATH = '';

const downloadAndInitModelFromStorage = async () => {
  const response = await fetch(MODEL_URL);
  const fileData = await response.arrayBuffer();
  const ort_providers = ['wasm', 'cpu']; // use wasm backend

  return await initInferenceSession(fileData, ort_providers);
};

const ImageCanvas = () => {
  const imageInRef = useRef<HTMLImageElement>(null);
  const sessionRef = useRef<InferenceSession | undefined>(undefined);
  const sessionPromiseRef = useRef<Promise<InferenceSession> | undefined>(
    undefined
  );

  const [processQuality, setProcessQuality] = useState('high');
  const [hasProcessedImage, setHasProcessedImage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingString, setLoadingString] = useState('Processing Image');
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [imageInSrc, setImageInSrc] = useState('');

  if (imageInRef && imageInRef.current) {
    imageInRef.current!.src = imageInSrc;
    imageInRef.current!.crossOrigin = 'Anonymous';
  }

  const cachedDownloadAndInitModelFromStorage = async () => {
    sessionPromiseRef.current =
      sessionPromiseRef.current ?? downloadAndInitModelFromStorage();
    sessionRef.current =
      sessionRef.current ?? (await sessionPromiseRef.current);
    return sessionRef.current;
  };

  useEffect(() => {
    async function checkAndSetFeatures() {
      ortEnv.wasm.numThreads = navigator.hardwareConcurrency ?? 4;
      ortEnv.wasm.simd = await simd();
      ortEnv.wasm.proxy = false;
      console.info('Threads supported:', await threads());
      console.info('SIMD supported:', await simd());
      console.info('Number of threads:', ortEnv.wasm.numThreads);
      console.info('Proxy main to thread:', ortEnv.wasm.proxy);

      if (WASM_PATH !== '') {
        ortEnv.wasm.wasmPaths = WASM_PATH;
        console.info('WASM path location:', ortEnv.wasm.wasmPaths);
      }
    }

    checkAndSetFeatures();

    // start downloading when we hit the webpage
    cachedDownloadAndInitModelFromStorage();
  }, []);

  function handleIframeMessage(event: MessageEvent) {
    const { type, payload } = event.data;

    // NOTE: We are accepting messages from any origin in this case for demo purposes only.
    // In a real world application, this should be set up to check for the proper
    // origin trying to send a message to the iframe.
    // This can look something like this:
    // if (!event.origin.includes(IMAGE_MATTING_DEMO_APPLICATION_ORIGIN)) {
    //   return;
    // }

    switch (type) {
      case 'imgly-set_quality':
        setProcessQuality(payload);
        break;
      case 'imgly-set_image':
        const path = URL.createObjectURL(payload);

        handleImageUpload(path);
        break;
      default:
        // NOTE: This might be triggered by other messages being sent to the
        // iframe, so we don't want to log this as an error.
        console.log('Unknown message type');
        break;
    }
  }

  // NOTE: The origin wildcard is being used in this case for demo purposes only.
  // In a real world application, this should be set to a proper origin for
  // security reasons, e.g. preventing cross site scripting attacks.
  // See https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage for more
  // information on this.
  function postIframeParentContextMessage(type: string, payload: any) {
    window.parent.postMessage(
      {
        type,
        payload
      },
      '*'
    );
  }

  // NOTE: Handle image upload and other features being accessed from an
  // outside browser context if this application is being run in an iframe.
  // This is at the time of this writing being used as an initial implementation
  // to get the image matting showcase running with UI in said showcase
  // leveraging the image matting features.
  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);

    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  useEffect(() => {
    if (processQuality === 'low') {
      setResolution(RESOLUTIONS[1]);
    } else {
      setResolution(RESOLUTIONS[0]);
    }
  }, [processQuality]);

  useEffect(() => {
    if (!hasProcessedImage) {
      setImageInSrc('');
    }
  }, [hasProcessedImage]);

  useEffect(() => {
    postIframeParentContextMessage('imgly-process_status', isProcessing);
  }, [isProcessing]);

  useEffect(() => {
    postIframeParentContextMessage('imgly-process_message', loadingString);
  }, [loadingString]);

  function handleImageUpload(path: string) {
    setIsProcessing(true);
    setImageInSrc(path);

    setHasProcessedImage(false);

    submitInferenceBrowser(path);
  }

  const submitInferenceBrowser = async (imageInSrc: string) => {
    try {
      setLoadingString('One-Time Initialisation');

      const [session] = await measureRuntimeAsync(
        cachedDownloadAndInitModelFromStorage
      );

      setLoadingString('Processing Image');

      const response = await fetch(imageInSrc);
      const imageData = await response.arrayBuffer();
      const image = await Jimp.default.create(Buffer.from(imageData));

      const [alphaData] = await runInferenceSession(session, {
        image: image,
        resolution: resolution
      });

      const mime = 'image/png';
      const buffer = await alphaData.getBufferAsync(mime); // encode to a jpeg again
      const imageBlob = new Blob([buffer], { type: mime });

      postIframeParentContextMessage('imgly-processed_image', imageBlob);

      const url = URL.createObjectURL(imageBlob);

      setImageInSrc(url);
      // NOTE: Show download button again after new image is available
      setHasProcessedImage(true);
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Error: ' + error.message);
    }
  };

  return <></>;
};

export default ImageCanvas;
