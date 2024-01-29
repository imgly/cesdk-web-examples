import removeBackground from '@imgly/background-removal';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

const ImageMattingContext = createContext({
  status: 'idle',
  processMessage: '',
  hasProcessedImage: false,
  processImage: (path) => {},
  imageUrl: '',
  originalImageUrl: '',
  resetState: () => {},
  inferenceTime: 0
});

const STATUS_MESSAGES = {
  idle: '',
  init: 'Initializing...',
  fetching: 'Downloading: Assets',
  processing: 'Processing: Removing image background',
  done: '',
  error: 'Error: Removing image background'
};
const PROCESSING_STATUS = ['init', 'fetching', 'processing'];

const ImageMattingContextProvider = ({ children }) => {
  const [status, setStatus] = useState('idle');
  const processMessage = useMemo(() => STATUS_MESSAGES[status], [status]);
  const [hasProcessedImage, setHasProcessedImage] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState();
  const [inferenceTime, setInferenceTime] = useState(0);

  function resetState() {
    setStatus('idle');
    setHasProcessedImage(false);
    setImageUrl('');
  }

  const processImage = useCallback(async (path) => {
    setOriginalImageUrl(path);

    const response = await fetch(path);
    const blob = await response.blob();
    const startTime = Date.now();

    setStatus('init');
    let imageBlob;
    try {
      imageBlob = await removeBackground(blob, {
        progress: (key, current, total) => {
          if (key.startsWith('fetch:')) {
            setStatus('fetching');
          } else if (key.startsWith('compute:inference')) {
            setStatus('processing');
          }
        }
      });
    } catch (error) {
      setStatus('error');
      console.error(error);
      return;
    }
    const timeDiffInSeconds = (Date.now() - startTime) / 1000;
    setInferenceTime(timeDiffInSeconds);
    setHasProcessedImage(true);
    setImageUrl(URL.createObjectURL(imageBlob));
    setStatus('idle');
  }, []);

  return (
    <ImageMattingContext.Provider
      value={{
        status,
        isProcessing: PROCESSING_STATUS.includes(status),
        processMessage,
        hasProcessedImage,
        imageUrl,
        originalImageUrl,
        processImage,
        resetState,
        inferenceTime
      }}
    >
      {children}
    </ImageMattingContext.Provider>
  );
};

export const useImageMatting = () => {
  const context = useContext(ImageMattingContext);
  if (context === undefined) {
    throw new Error(
      'useImageMatting must be used within a ImageMattingProvider'
    );
  }
  return context;
};

export { ImageMattingContext, ImageMattingContextProvider };
