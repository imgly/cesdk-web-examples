import { useEditor } from '../../EditorContext';
import { autoPlaceBlockOnPage } from '../../lib/CreativeEngineUtils';
import FontSelect from '../FontSelect/FontSelect';

const AddTextSecondary = () => {
  const { creativeEngine, currentPageBlockId } = useEditor();
  const addText = (fontFileUri) => {
    const block = creativeEngine.block.create('text');
    creativeEngine.block.setString(block, 'text/fontFileUri', fontFileUri);
    creativeEngine.block.setFloat(block, 'text/fontSize', 40);
    creativeEngine.block.setEnum(block, 'text/horizontalAlignment', 'Center');
    creativeEngine.block.setHeightMode(block, 'Auto');
    const pageWidth = creativeEngine.block.getWidth(currentPageBlockId);
    creativeEngine.block.setWidth(block, pageWidth * 0.5);
    autoPlaceBlockOnPage(creativeEngine, currentPageBlockId, block);
  };

  return <FontSelect onSelect={(font) => addText(font)} />;
};
export default AddTextSecondary;
