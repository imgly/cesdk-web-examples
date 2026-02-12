import ExampleFileContainer from './ExampleFileContainer';
import UploadZone from './UploadZone';

const EXAMPLE_FILES = ['example-1-skin', 'example-2-bike', 'example-3-social'].map((file) => ({
  name: file + '.pptx',
  url: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/pptx-template-import/${file}.pptx`,
  previewUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/pptx-template-import/${file}-preview.png`,
  coverBaseUrl: `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/pptx-template-import/${file}-thumb`,
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
        accept={['.pptx']}
        filetypeNotice="Supports .pptx Format"
      >
        Upload PowerPoint File
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
