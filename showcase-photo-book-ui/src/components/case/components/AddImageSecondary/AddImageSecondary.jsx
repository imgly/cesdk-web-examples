import {
  autoPlaceBlockOnPage,
  getImageSize
} from '../../lib/CreativeEngineUtils';
import { useEngine } from '../../lib/EngineContext';

import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import ImagesBar from '../ImageBar/ImageBar';

const AddImageSecondary = () => {
  const { engine } = useEngine();
  const { currentPageBlockId } = useSinglePageMode();

  const addImage = async (imageURI) => {
    const block = engine.block.create('image');
    engine.block.setString(block, 'image/imageFileURI', imageURI);
    engine.block.setBool(block, 'image/showsPlaceholderButton', false);
    engine.block.setBool(block, 'image/showsPlaceholderOverlay', false);

    const { width, height } = await getImageSize(imageURI);
    const imageAspectRatio = width / height;
    const baseHeight = 50;

    engine.block.setHeightMode(block, 'Absolute');
    engine.block.setHeight(block, baseHeight);
    engine.block.setWidthMode(block, 'Absolute');
    engine.block.setWidth(block, baseHeight * imageAspectRatio);

    autoPlaceBlockOnPage(engine, currentPageBlockId, block);
  };

  return <ImagesBar onSelect={(image) => addImage(image)} />;
};
export default AddImageSecondary;
