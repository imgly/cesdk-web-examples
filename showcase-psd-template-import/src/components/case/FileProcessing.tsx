import { useFileProcessing } from './FileProcessingContext';
import FileSelectionScreen from './FileSelectionScreen';
import LoadingScreen from './LoadingScreen';
import ResultScreen from './ResultScreen';

function FileProcessing() {
  const { currentFile, result, isProcessing, processMessage, processFile } =
    useFileProcessing();

  return (
    <>
      {!currentFile && (
        <FileSelectionScreen
          onFileSelected={(file) => {
            processFile(file);
          }}
        />
      )}
      {isProcessing && <LoadingScreen text={processMessage} />}
      {!!result && <ResultScreen />}
    </>
  );
}

export default FileProcessing;
