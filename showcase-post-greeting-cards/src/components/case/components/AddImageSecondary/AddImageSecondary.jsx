import { useEditor } from '../../EditorContext';
import {
  getImageSize,
  autoPlaceBlockOnPage
} from '../../lib/CreativeEngineUtils';
import ImagesBar from '../ImageBar/ImageBar';

const AddImageSecondary = () => {
  const { creativeEngine, currentPageBlockId } = useEditor();

  const addImage = async (imageURI) => {
    const block = creativeEngine.block.create('image');
    creativeEngine.block.setString(block, 'image/imageFileURI', imageURI);
    creativeEngine.block.setBool(block, 'image/showsPlaceholderButton', false);
    creativeEngine.block.setBool(block, 'image/showsPlaceholderOverlay', false);

    const { width, height } = await getImageSize(imageURI);
    const imageAspectRatio = width / height;
    const baseHeight = 50;

    creativeEngine.block.setHeightMode(block, 'Absolute');
    creativeEngine.block.setHeight(block, baseHeight);
    creativeEngine.block.setWidthMode(block, 'Absolute');
    creativeEngine.block.setWidth(block, baseHeight * imageAspectRatio);

    autoPlaceBlockOnPage(creativeEngine, currentPageBlockId, block);
  };

  return <ImagesBar onSelect={(image) => addImage(image)} />;
};
export default AddImageSecondary;
