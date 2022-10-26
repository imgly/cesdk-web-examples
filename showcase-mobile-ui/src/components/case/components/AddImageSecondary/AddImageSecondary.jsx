import { useEditor } from '../../EditorContext';
import ImageSelect from '../ImageSelect/ImageSelect';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import UploadImageButton from '../UploadImageButton/UploadImageButton';

const AddImageSecondary = ({ onClose }) => {
  const {
    customEngine: { addImage }
  } = useEditor();

  return (
    <SlideUpPanel
      isExpanded={true}
      onExpandedChanged={(value) => !value && onClose()}
    >
      <SlideUpPanelHeader headline="Add Image">
        <UploadImageButton onUpload={(url) => addImage(url)} />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ImageSelect onSelect={(image) => addImage(image)} />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddImageSecondary;
