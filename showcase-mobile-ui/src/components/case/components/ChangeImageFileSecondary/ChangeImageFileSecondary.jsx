import { useEditor } from '../../EditorContext';
import ImageSelect from '../ImageSelect/ImageSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import UploadImageButton from '../UploadImageButton/UploadImageButton';

const ChangeImageFileSecondary = ({ onClose }) => {
  const {
    customEngine: { changeImageFile }
  } = useEditor();

  return (
    <>
      <SlideUpPanelHeader headline="Replace">
        <UploadImageButton />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ImageSelect
          onSelect={(imageURL) => {
            changeImageFile(imageURL);
            onClose();
          }}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeImageFileSecondary;
