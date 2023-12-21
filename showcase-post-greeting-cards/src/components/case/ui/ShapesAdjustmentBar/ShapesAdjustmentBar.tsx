import { BlockBar } from '../BlockBar/BlockBar';
import ChangeShapeColorSecondary from '../ChangeShapeColorSecondary/ChangeShapeColorSecondary';
import CurrentColorIcon from '../CurrentColorIcon/CurrentColorIcon';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';

const ADJUSTMENTS = [
  {
    Component: <ChangeShapeColorSecondary />,
    Icon: <CurrentColorIcon />,
    label: 'Color',
    id: 'replace'
  }
];

const ShapesAdjustmentBar = () => {
  return (
    <BlockBar items={ADJUSTMENTS}>
      <DeleteSelectedButton />
    </BlockBar>
  );
};
export default ShapesAdjustmentBar;
