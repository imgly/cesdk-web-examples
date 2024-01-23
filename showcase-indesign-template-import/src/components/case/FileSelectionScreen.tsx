import ExampleFileContainer from './ExampleFileContainer';
import UploadZone from './UploadZone';

const EXAMPLE_FILES = ['socialmedia', 'poster', 'postcard'].map((file) => ({
  name: file + '.idml',
  url: `${window.location.protocol + "//" + window.location.host}/cases/indesign-template-import/${file}.idml`,
  previewUrl: `${window.location.protocol + "//" + window.location.host}/cases/indesign-template-import/${file}-1.png`,
  coverBaseUrl: `${window.location.protocol + "//" + window.location.host}/cases/indesign-template-import/${file}-thumb`,
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
        accept={['.idml']}
        filetypeNotice="Supports .idml Format"
      >
        Upload InDesign File
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
