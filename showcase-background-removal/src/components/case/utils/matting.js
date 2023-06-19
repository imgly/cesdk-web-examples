import { createContext, useContext, useEffect, useRef, useState } from 'react';
import removeBackground, { utils } from './image-matting-lib-dist';
import { caseAssetPath } from './util';

const WASM_PATH = caseAssetPath('') + '/';

const ImageMattingContext = createContext({
  quality: 'high',
  setQuality: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  processMessage: '',
  setProcessMessage: () => {},
  hasProcessedImage: false,
  setHasProcessedImage: () => {},
  imageUrl: '',
  setImageUrl: () => {},
  resetState: () => {},
  inferenceTime: 0
});

const useImageMatting = () => {
  const {
    setImageUrl,
    quality,
    setQuality,
    imageUrl,
    hasProcessedImage,
    isProcessing,
    setIsProcessing,
    processMessage,
    setProcessMessage,
    setHasProcessedImage,
    resetState,
    inferenceTime
  } = useContext(ImageMattingContext);

  async function handleImageUpload(path) {
    setImageUrl(path);

    const response = await fetch(path);
    const blob = await response.blob();
    const imageBitmap = await createImageBitmap(blob);
    const inputImageData = utils.imageBitmapToImageData(imageBitmap);

    setIsProcessing(true);
    // NOTE: Since the image-matting-lib does not provide a way to determine
    // if its the one-time initialization phase or the processing image phase,
    // we just set the static string below for now.
    setProcessMessage('Processing Image');

    const imageData = await removeBackground(inputImageData, {
      debug: true,
      wasmPath: WASM_PATH,
      proxyToWorker: true
    });
    const url = utils.imageDataToDataUrl(imageData);

    setHasProcessedImage(true);
    setImageUrl(url);
    setIsProcessing(false);
  }

  return {
    handleImageUpload,
    quality,
    setQuality,
    imageUrl,
    hasProcessedImage,
    isProcessing,
    processMessage,
    resetState,
    inferenceTime
  };
};

const ImageMattingContextProvider = ({ children }) => {
  const startTimeReference = useRef(null);

  const [quality, setQuality] = useState('high');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState('');
  const [hasProcessedImage, setHasProcessedImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [inferenceTime, setInferenceTime] = useState(0);

  function resetState() {
    setQuality('high');
    setIsProcessing(false);
    setHasProcessedImage(false);
    setImageUrl('');
  }

  useEffect(() => {
    if (isProcessing && startTimeReference.current === null) {
      startTimeReference.current = Date.now();
    }

    if (!isProcessing && startTimeReference.current !== null) {
      const endTime = Date.now();
      const timeDiffInSeconds = (endTime - startTimeReference.current) / 1000;

      setInferenceTime(timeDiffInSeconds);
      startTimeReference.current = null;
    }
  }, [isProcessing]);

  return (
    <ImageMattingContext.Provider
      value={{
        quality,
        setQuality,
        isProcessing,
        setIsProcessing,
        processMessage,
        setProcessMessage,
        hasProcessedImage,
        setHasProcessedImage,
        imageUrl,
        setImageUrl,
        resetState,
        inferenceTime
      }}
    >
      {children}
    </ImageMattingContext.Provider>
  );
};

export { ImageMattingContext, useImageMatting, ImageMattingContextProvider };
