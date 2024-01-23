import { useEditor } from '../../EditorContext';
import { addImage } from '../../lib/CreativeEngineUtils';
import ImageSelect from '../ImageSelect/ImageSelect';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import UploadImageButton from '../UploadImageButton/UploadImageButton';

const AddImageSecondary = ({ onClose }) => {
  const { engine } = useEditor();

  return (
    <SlideUpPanel
      isExpanded={true}
      onExpandedChanged={(value) => !value && onClose()}
    >
      <SlideUpPanelHeader headline="Add Image">
        <UploadImageButton
          onUpload={(asset) => {
            engine.asset.apply(asset.context.sourceId, asset);
          }}
        />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ImageSelect
          onSelect={(asset) => {
            engine.asset.apply(asset.context.sourceId, asset);
          }}
        />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddImageSecondary;
