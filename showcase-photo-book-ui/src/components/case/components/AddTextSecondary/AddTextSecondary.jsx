import { autoPlaceBlockOnPage } from '../../lib/CreativeEngineUtils';
import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import FontSelect from '../FontSelect/FontSelect';

const AddTextSecondary = () => {
  const { engine } = useEngine();
  const { currentPageBlockId } = useSinglePageMode();

  const addText = (fontFileUri) => {
    const block = engine.block.create('text');
    engine.block.setString(block, 'text/fontFileUri', fontFileUri);
    engine.block.setFloat(block, 'text/fontSize', 40);
    engine.block.setEnum(block, 'text/horizontalAlignment', 'Center');
    engine.block.setHeightMode(block, 'Auto');
    const pageWidth = engine.block.getWidth(currentPageBlockId);
    engine.block.setWidth(block, pageWidth * 0.5);
    autoPlaceBlockOnPage(engine, currentPageBlockId, block);
  };

  return <FontSelect onSelect={(font) => addText(font)} />;
};
export default AddTextSecondary;
