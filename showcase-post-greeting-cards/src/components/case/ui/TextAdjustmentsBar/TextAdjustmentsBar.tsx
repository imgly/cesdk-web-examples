import { useEffect } from 'react';
import { ReactComponent as TextIcon } from '../../icons/Text.svg';
import { ReactComponent as TextAlignMiddleIcon } from '../../icons/TextAlignCenter.svg';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import BlockBar from '../BlockBar/BlockBar';
import ChangeFontSecondary from '../ChangeFontSecondary/ChangeFontSecondary';
import ChangeTextAlignmentSecondary from '../ChangeTextAlignmentSecondary/ChangeTextAlignmentSecondary';
import ChangeTextColorSecondary from '../ChangeTextColorSecondary/ChangeTextColorSecondary';
import CurrentColorIcon from '../CurrentColorIcon/CurrentColorIcon';
import DeleteSelectedButton from '../DeleteSelectedButton/DeleteSelectedButton';

const ADJUSTMENTS = [
  {
    Component: <ChangeTextColorSecondary />,
    Icon: <CurrentColorIcon />,
    label: 'Color',
    id: 'color'
  },
  {
    Component: <ChangeFontSecondary />,
    Icon: <TextIcon />,
    label: 'Font',
    id: 'font'
  },
  {
    Component: <ChangeTextAlignmentSecondary />,
    Icon: <TextAlignMiddleIcon />,
    label: 'Align',
    id: 'align'
  }
];

const TextAdjustmentsBar = () => {
  return (
    <BlockBar items={ADJUSTMENTS}>
      <DeleteSelectedButton />
    </BlockBar>
  );
};
export default TextAdjustmentsBar;
