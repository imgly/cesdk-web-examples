import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';
import DockMenu from '../DockMenu/DockMenu';

const StickerAdjustmentBar = () => {
  return (
    <DockMenu>
      <DeleteSelectedButton isActive />
    </DockMenu>
  );
};
export default StickerAdjustmentBar;
