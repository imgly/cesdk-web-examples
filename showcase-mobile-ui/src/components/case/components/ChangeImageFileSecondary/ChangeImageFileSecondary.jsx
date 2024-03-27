import { useEditor } from '../../EditorContext';
import ImageSelect from '../ImageSelect/ImageSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import UploadImageButton from '../UploadImageButton/UploadImageButton';

const ChangeImageFileSecondary = ({ onClose }) => {
  const { engine, selectedBlocks } = useEditor();

  return (
    <>
      <SlideUpPanelHeader headline="Replace">
        <UploadImageButton
          multiple={false}
          onUpload={(asset) =>
            engine.asset.applyToBlock(
              asset.context.sourceId,
              asset,
              selectedBlocks[0].id
            )
          }
        />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ImageSelect
          onSelect={(asset) => {
            engine.asset.applyToBlock(
              asset.context.sourceId,
              asset,
              selectedBlocks[0].id
            );
            engine.block.resetCrop(selectedBlocks[0].id);
            onClose();
          }}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeImageFileSecondary;
