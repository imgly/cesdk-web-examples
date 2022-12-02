import { useEditor } from '../../EditorContext';
import Modal from '../Modal/Modal';
import SmallButton from '../SmallButton/SmallButton';
import classes from './UnsavedChangesModal.module.css';

export default function UnsavedChangesModal({ imageUrl, onClose }) {
  const { changeImage } = useEditor();
  return (
    <Modal open title="Unsaved Changes" maxWidth={'380px'}>
      <div className={classes.text}>
        <p>
          There are unsaved changes for the current image. Would you like to
          apply them to the new image or <br /> discard them?
        </p>
      </div>
      <hr />
      <div className={classes.actionRow}>
        <SmallButton variant={'secondary-plain'} onClick={onClose}>
          Cancel
        </SmallButton>
        <div className={classes.primaryActions}>
          <SmallButton
            variant={'secondary-plain'}
            onClick={async () => {
              await changeImage(imageUrl, false);
              onClose();
            }}
          >
            Discard Changes
          </SmallButton>
          <SmallButton
            variant={'primary'}
            onClick={async () => {
              await changeImage(imageUrl, true);
              onClose();
            }}
          >
            Apply Changes
          </SmallButton>
        </div>
      </div>
    </Modal>
  );
}
