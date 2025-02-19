import { useEngine } from '../../lib/EngineContext';
import ImagesBar from '../ImageBar/ImageBar';

const ChangeImageFileSecondary = () => {
  const { engine } = useEngine();
  const changeImageFile = (value) => {
    const allSelectedImageElements = engine.block
      .findAllSelected()
      .filter((elementId) => engine.block.getType(elementId).includes('image'));

    if (allSelectedImageElements.length > 0) {
      allSelectedImageElements.forEach((imageElementId) => {
        engine.block.setString(imageElementId, 'image/imageFileURI', value);
        engine.block.resetCrop(imageElementId);
        engine.block.setBool(
          imageElementId,
          'image/showsPlaceholderButton',
          false
        );
        engine.block.setBool(
          imageElementId,
          'image/showsPlaceholderOverlay',
          false
        );
      });
      engine.editor.addUndoStep();
    }
  };

  return <ImagesBar onSelect={(fontUri) => changeImageFile(fontUri)} />;
};
export default ChangeImageFileSecondary;
