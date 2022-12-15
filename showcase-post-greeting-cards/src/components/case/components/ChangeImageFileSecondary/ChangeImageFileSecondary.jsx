import { useEditor } from '../../EditorContext';
import ImagesBar from '../ImageBar/ImageBar';

const ChangeImageFileSecondary = () => {
  const { creativeEngine } = useEditor();
  const changeImageFile = (value) => {
    const allSelectedImageElements = creativeEngine.block
      .findAllSelected()
      .filter((elementId) =>
        creativeEngine.block.getType(elementId).includes('image')
      );

    if (allSelectedImageElements.length > 0) {
      allSelectedImageElements.forEach((imageElementId) => {
        creativeEngine.block.setString(
          imageElementId,
          'image/imageFileURI',
          value
        );
        creativeEngine.block.resetCrop(imageElementId);
        creativeEngine.block.setBool(
          imageElementId,
          'image/showsPlaceholderButton',
          false
        );
        creativeEngine.block.setBool(
          imageElementId,
          'image/showsPlaceholderOverlay',
          false
        );
      });
      creativeEngine.editor.addUndoStep();
    }
  };

  return <ImagesBar onSelect={(fontUri) => changeImageFile(fontUri)} />;
};
export default ChangeImageFileSecondary;
