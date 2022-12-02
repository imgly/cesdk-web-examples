import { useState } from 'react';
import AdjustmentButton from '../AdjustmentButton/AdjustmentButton';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import ADJUSTMENTS from './Adjustments.json';
import AdjustSliderBar from './AdjustSliderBar';

const AdjustSecondary = () => {
  const [activeAdjustmentKey, setActiveAdjustmentKey] = useState('brightness');

  return (
    <>
      {activeAdjustmentKey && (
        <AdjustSliderBar
          key={activeAdjustmentKey}
          adjustmentId={activeAdjustmentKey}
        />
      )}
      <AdjustmentsBar gap="md" scroll="scroll">
        {Object.entries(ADJUSTMENTS).map(([key, value]) => (
          <AdjustmentButton
            key={key}
            isActive={activeAdjustmentKey === key}
            onClick={() => {
              setActiveAdjustmentKey(key);
            }}
            label={value.label}
          />
        ))}
      </AdjustmentsBar>
    </>
  );
};
export default AdjustSecondary;
