import { useEditor } from '../../EditorContext';
import { addImage } from '../../lib/CreativeEngineUtils';
import ImageSelect from '../ImageSelect/ImageSelect';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import UploadImageButton from '../UploadImageButton/UploadImageButton';

const AddImageSecondary = ({ onClose }) => {
  const { creativeEngine, currentPageBlockId } = useEditor();

  return (
    <SlideUpPanel
      isExpanded={true}
      onExpandedChanged={(value) => !value && onClose()}
    >
      <SlideUpPanelHeader headline="Add Image">
        <UploadImageButton
          onUpload={(url) =>
            addImage(creativeEngine, currentPageBlockId, url, 1)
          }
        />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ImageSelect
          onSelect={(image) =>
            addImage(creativeEngine, currentPageBlockId, image)
          }
        />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddImageSecondary;
