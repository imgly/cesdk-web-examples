import { useEditor } from '../../EditorContext';
import { autoPlaceBlockOnPage } from '../../lib/CreativeEngineUtils';
import FontSelect from '../FontSelect/FontSelect';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const AddTextSecondary = ({ onClose }) => {
  const { engine, currentPageBlockId } = useEditor();

  const addText = (font, typeface) => {
    const block = engine.block.create('text');
    engine.block.setFont(block, font.uri, typeface);
    engine.block.setFloat(block, 'text/fontSize', 40);
    engine.block.setEnum(block, 'text/horizontalAlignment', 'Center');
    engine.block.setHeightMode(block, 'Auto');
    const pageWidth = engine.block.getWidth(currentPageBlockId);
    engine.block.setWidth(block, pageWidth * 0.5);
    autoPlaceBlockOnPage(engine, currentPageBlockId, block);
  };

  return (
    <SlideUpPanel isExpanded onExpandedChanged={(value) => !value && onClose()}>
      <SlideUpPanelHeader headline="Add Text"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <FontSelect onSelect={(font, typeface) => addText(font, typeface)} />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddTextSecondary;
