import { useEditor } from '../../EditorContext';
import { replaceImage } from '../../lib/CreativeEngineUtils';
import ImageSelect from '../ImageSelect/ImageSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import UploadImageButton from '../UploadImageButton/UploadImageButton';

const ChangeImageFileSecondary = ({ onClose }) => {
  const { creativeEngine, selectedBlocks } = useEditor();

  return (
    <>
      <SlideUpPanelHeader headline="Replace">
        <UploadImageButton
          multiple={false}
          onUpload={(imageURL) =>
            replaceImage(creativeEngine, selectedBlocks[0].id, imageURL)
          }
        />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ImageSelect
          onSelect={(imageURL) => {
            replaceImage(creativeEngine, selectedBlocks[0].id, imageURL);
            onClose();
          }}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeImageFileSecondary;
