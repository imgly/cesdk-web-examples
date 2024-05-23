import CreativeEngine from '@cesdk/engine';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { ExampleFile } from './ExampleFileContainer';
import {
  IDMLParser,
  LogMessage,
  Logger,
  addGoogleFontsAssetLibrary
} from '@imgly/idml-importer';

interface ProcessResult {
  imageUrl: string;
  sceneUrl: string;
  sceneArchiveUrl: string;
  messages: LogMessage[];
}

interface FileProcessingContextValue {
  status: string;
  processMessage: string;
  isProcessing: boolean;
  processFile: (file: ExampleFile) => void;
  currentFile: ExampleFile | null;
  resetState: () => void;
  inferenceTime: number;
  result: ProcessResult | null;
}

const FileProcessingContext = createContext<FileProcessingContextValue>({
  status: 'idle',
  processMessage: '',
  isProcessing: false,
  processFile: () => {},
  currentFile: null,
  resetState: () => {},
  inferenceTime: 0,
  result: null
});

const STATUS_MESSAGES = {
  idle: '',
  init: 'Initializing...',
  fetching: 'Downloading: Assets',
  processing: 'Processing: Transforming IDML to Scene',
  done: '',
  error: 'Error: Failed to process IDML file'
} as const;
type StatusMessages = keyof typeof STATUS_MESSAGES;
const PROCESSING_STATUS = ['init', 'fetching', 'processing'];

interface FileProcessingContextProviderProps {
  children: React.ReactNode;
}

const FileProcessingContextProvider = ({
  children
}: FileProcessingContextProviderProps) => {
  const [status, setStatus] = useState<StatusMessages>('idle');
  const processMessage = useMemo(() => STATUS_MESSAGES[status], [status]);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [currentFile, setCurrentFile] = useState<ExampleFile | null>(null);
  const [inferenceTime, setInferenceTime] = useState(0);

  function resetState() {
    setStatus('idle');
    setCurrentFile(null);
    setResult(null);
  }

  const processFile = useCallback(async (file: ExampleFile) => {
    const path = file.url;
    setCurrentFile(file);

    const response = await fetch(path);
    const blob = await response.blob();
    const startTime = Date.now();

    setStatus('init');
    let imageBlob;
    let sceneString;
    let sceneArchive;
    let logger: Logger;
    try {
      const engine = await CreativeEngine.init({
        license: process.env.NEXT_PUBLIC_LICENSE
      });
      setStatus('processing');
      await addGoogleFontsAssetLibrary(engine);
      const parser = await IDMLParser.fromFile(
        engine as any,
        blob,
        (content: string) =>
          new DOMParser().parseFromString(content, 'text/xml')
      );

      const result = await parser.parse();
      logger = result.logger;
      imageBlob = await engine.block.export(
        engine.scene.getPages()[0],
        'image/png' as any,
        {
          targetHeight: 1000,
          targetWidth: 1000
        }
      );
      sceneString = await engine.scene.saveToString();
      sceneArchive = await engine.scene.saveToArchive();
    } catch (error) {
      console.error(error);
      resetState();
      return;
    }
    const timeDiffInSeconds = (Date.now() - startTime) / 1000;
    setInferenceTime(timeDiffInSeconds);
    setResult({
      messages: logger.getMessages(),
      imageUrl: URL.createObjectURL(imageBlob),
      sceneUrl: URL.createObjectURL(
        new Blob([sceneString], { type: 'text/plain;charset=UTF-8' })
      ),
      sceneArchiveUrl: URL.createObjectURL(sceneArchive)
    });
    setStatus('idle');
  }, []);

  return (
    <FileProcessingContext.Provider
      value={{
        status,
        isProcessing: PROCESSING_STATUS.includes(status),
        processMessage,
        result,
        currentFile,
        processFile,
        resetState,
        inferenceTime
      }}
    >
      {children}
    </FileProcessingContext.Provider>
  );
};

export const useFileProcessing = () => {
  const context = useContext(FileProcessingContext);
  if (context === undefined) {
    throw new Error(
      'useFileProcessing must be used within a FileProcessingProvider'
    );
  }
  return context;
};

export { FileProcessingContext, FileProcessingContextProvider };
