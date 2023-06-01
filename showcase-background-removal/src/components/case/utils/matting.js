import { createContext, useContext, useEffect, useRef, useState } from 'react';

// IMPORTANT: Our hosted image matting server code and the code shown
// in this repository are not production ready and for demo purposes only!
const IMAGE_MATTING_SERVER_SERVER_ORIGIN =
  process.env.REACT_APP_IMAGE_MATTING_SERVER_URL;

// NOTE: The origin wildcard is being used in this case for demo purposes only.
// In a real world application, this should be set to a proper origin for
// security reasons, e.g. preventing cross site scripting attacks.
// See https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage for more
// information on this.
function postIframeParentContextMessage(element, type, payload) {
  element.contentWindow.postMessage(
    {
      type,
      payload
    },
    '*'
  );
}

const ImageMattingContext = createContext({
  quality: 'high',
  setQuality: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  processMessage: '',
  setProcessMessage: () => {},
  processedImage: null,
  setProcessedImage: () => {},
  imageUrl: '',
  setImageUrl: () => {},
  resetState: () => {},
  iframeElement: null,
  inferenceTime: 0
});

const useImageMatting = () => {
  const {
    iframeElement,
    setImageUrl,
    quality,
    setQuality,
    imageUrl,
    processedImage,
    isProcessing,
    processMessage,
    resetState,
    inferenceTime
  } = useContext(ImageMattingContext);

  async function handleImageUpload(path) {
    setImageUrl(path);

    const response = await fetch(path);
    const blob = await response.blob();

    postIframeParentContextMessage(iframeElement, 'imgly-set_image', blob);
  }

  return {
    handleImageUpload,
    quality,
    setQuality,
    imageUrl,
    processedImage,
    isProcessing,
    processMessage,
    resetState,
    inferenceTime
  };
};

const ImageMattingContextProvider = ({ children }) => {
  const iframeRef = useRef(null);
  const startTimeReference = useRef(null);

  const [quality, setQuality] = useState('high');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState('');
  const [processedImage, setProcessedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [inferenceTime, setInferenceTime] = useState(0);

  function resetState() {
    setQuality('high');
    setIsProcessing(false);
    setProcessedImage(null);
    setImageUrl('');
  }

  function handleIframeMessage(event) {
    // NOTE: We are accepting messages from any origin in this case for demo purposes only.
    // In a real world application, this should be set up to check for the proper
    // origin trying to send a message to the iframe.
    // This can look something like this:
    // if (event.origin !== IMAGE_MATTING_SERVER_APP_ORIGIN) {
    //   return;
    // }

    const { payload, type } = event.data;
    switch (type) {
      case 'imgly-process_status':
        setIsProcessing(payload);
        break;
      case 'imgly-process_message':
        setProcessMessage(payload);
        break;
      case 'imgly-processed_image':
        setProcessedImage(payload);
        break;
      default:
        console.log('Unknown message type');
        break;
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);

    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  useEffect(() => {
    postIframeParentContextMessage(
      iframeRef.current,
      'imgly-set_quality',
      quality
    );
  }, [quality]);

  useEffect(() => {
    if (!processedImage) {
      setImageUrl('');
    } else {
      const path = URL.createObjectURL(processedImage);
      setImageUrl(path);
    }
  }, [processedImage]);

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
        processedImage,
        setProcessedImage,
        imageUrl,
        setImageUrl,
        resetState,
        iframeElement: iframeRef.current,
        inferenceTime
      }}
    >
      <iframe
        ref={iframeRef}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: '0'
        }}
        src={IMAGE_MATTING_SERVER_SERVER_ORIGIN}
      />
      {children}
    </ImageMattingContext.Provider>
  );
};

export { ImageMattingContext, useImageMatting, ImageMattingContextProvider };
