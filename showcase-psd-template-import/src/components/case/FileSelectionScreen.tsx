import ExampleFileContainer from './ExampleFileContainer';
import UploadZone from './UploadZone';

const EXAMPLE_FILES = [
  'showcase-file-3',
  'showcase-file-1',
  'showcase-file-2'
].map((file) => ({
  name: file + '.psd',
  url: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/psd-template-import/${file}.psd`,
  previewUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/psd-template-import/${file}.png`,
  coverBaseUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/psd-template-import/${file}-thumb`,
  alt: `${file} thumbnail`
}));

interface FileSelectionScreenProps {
  onFileSelected: (file: any) => void;
}

function FileSelectionScreen({ onFileSelected }: FileSelectionScreenProps) {
  return (
    <>
      <UploadZone
        onUpload={(file: File) => {
          const objectURL = URL.createObjectURL(file);
          onFileSelected({
            name: file.name,
            url: objectURL,
            thumbnailUrl: ''
          });
        }}
        accept={['.psd', '.psb']}
        filetypeNotice="Supports .psd and .psb Formats"
      >
        Upload Photoshop File
      </UploadZone>
      <ExampleFileContainer
        onClick={(file) => {
          onFileSelected(file);
        }}
        files={EXAMPLE_FILES}
      />
    </>
  );
}

export default FileSelectionScreen;
