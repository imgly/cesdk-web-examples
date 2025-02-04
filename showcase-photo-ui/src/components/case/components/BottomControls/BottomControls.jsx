import { useEffect } from 'react';
import { useEditor } from '../../EditorContext';
import classes from './BottomControls.module.css';

import { useMemo, useState } from 'react';
import { ReactComponent as AdjustmentsIcon } from '../../icons/Adjustments.svg';
import { ReactComponent as CropIcon } from '../../icons/Crop.svg';
import { ReactComponent as FilterIcon } from '../../icons/Filter.svg';
import AdjustSecondary from '../AdjustSecondary/AdjustSecondary';
import CropModeSecondary from '../CropModeSecondary/CropModeSecondary';
import FilterSecondary from '../FilterSecondary/FilterSecondary';
import IconButton from '../IconButton/IconButton';

const SECONDARY_BARS = {
  Crop: {
    element: <CropModeSecondary />,
    canvasPaddingBottom: 182,
    Icon: CropIcon,
    label: 'Crop'
  },
  Adjust: {
    element: <AdjustSecondary />,
    canvasPaddingBottom: 177,
    Icon: AdjustmentsIcon,
    label: 'Adjust'
  },
  Filter: {
    element: <FilterSecondary />,
    canvasPaddingBottom: 206,
    Icon: FilterIcon,
    label: 'Filter'
  }
};

const BottomControls = () => {
  const { setZoomPaddingBottom, editMode, creativeEngine, currentPageBlockId } =
    useEditor();
  const [selectedMenuId, setSelectedMenuId] = useState();

  useEffect(() => {
    const handler = function (event) {
      if (creativeEngine.editor.getEditMode() === 'Transform') {
        setSelectedMenuId(null);
      }
    };
    creativeEngine.element.addEventListener('click', handler);
    return () => creativeEngine.element?.removeEventListener('click', handler);
  }, [creativeEngine]);

  const calculatedMenuId = useMemo(
    () => (editMode === 'Crop' ? 'Crop' : selectedMenuId),
    [editMode, selectedMenuId]
  );
  const secondaryBar = useMemo(
    () => SECONDARY_BARS[calculatedMenuId],
    [calculatedMenuId]
  );
  const SecondaryBarComponent = useMemo(
    () => secondaryBar?.element,
    [secondaryBar]
  );

  useEffect(() => {
    setZoomPaddingBottom(secondaryBar?.canvasPaddingBottom ?? 80);
  }, [setZoomPaddingBottom, secondaryBar]);

  return (
    <div className={classes.outerWrapper}>
      <div className={classes.wrapper}>
        {SecondaryBarComponent}
        <div className={classes.bar}>
          {Object.entries(SECONDARY_BARS).map(([key, { label, Icon }]) => (
            <IconButton
              key={key}
              isActive={calculatedMenuId === key}
              onClick={() => {
                if (calculatedMenuId === key) {
                  creativeEngine.editor.setEditMode('Transform');
                  setSelectedMenuId(null);
                } else {
                  if (key === 'Crop') {
                    setSelectedMenuId(null);
                    creativeEngine.block.setSelected(currentPageBlockId, true);
                    creativeEngine.editor.setEditMode('Crop');
                  } else {
                    setSelectedMenuId(key);
                    creativeEngine.editor.setEditMode('Transform');
                  }
                }
              }}
              icon={<Icon />}
            >
              {label}
            </IconButton>
          ))}
        </div>
      </div>
    </div>
  );
};
export default BottomControls;
