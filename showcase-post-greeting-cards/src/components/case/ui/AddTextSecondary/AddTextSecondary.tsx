import { Font, Typeface } from '@cesdk/engine';
import { autoPlaceBlockOnPage } from '../../lib/CreativeEngineUtils';
import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import FontSelect from '../FontSelect/FontSelect';

const AddTextSecondary = () => {
  const { engine } = useEngine();
  const { currentPageBlockId } = useSinglePageMode();

  const addText = (font: Font, typeface: Typeface) => {
    const block = engine.block.create('text');
    engine.block.setFont(block, font.uri, typeface);
    engine.block.setFloat(block, 'text/fontSize', 40);
    engine.block.setEnum(block, 'text/horizontalAlignment', 'Center');
    engine.block.setHeightMode(block, 'Auto');
    const pageWidth = engine.block.getWidth(currentPageBlockId!);
    engine.block.setWidth(block, pageWidth * 0.5);
    autoPlaceBlockOnPage(engine, currentPageBlockId, block);
  };

  return <FontSelect onSelect={(font, typeface) => addText(font, typeface)} />;
};
export default AddTextSecondary;
