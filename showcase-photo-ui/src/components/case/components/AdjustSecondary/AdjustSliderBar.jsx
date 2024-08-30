import { useEditor } from '../../EditorContext';
import { fetchAdjustmentEffect } from '../../lib/CreativeEngineUtils';
import { useProperty } from '../../lib/UseSelectedProperty';
import SliderBar from '../SliderBar/SliderBar';

const ADJUSTMENT_DEFAULT_VALUE = 0;

const toPercent = (val) => val * 100;
const fromPercent = (val) => val / 100;

const AdjustSliderBar = ({ adjustmentId }) => {
  const { currentPageBlockId, creativeEngine } = useEditor();

  const [adjustment, setAdjustment] = useProperty(
    fetchAdjustmentEffect(creativeEngine, currentPageBlockId),
    'adjustments/' + adjustmentId
  );

  return (
    <SliderBar
      key={adjustmentId}
      min={-100}
      max={100}
      dead
      onReset={() => setAdjustment(fromPercent(ADJUSTMENT_DEFAULT_VALUE))}
      resetEnabled={adjustment !== 0}
      current={toPercent(adjustment)}
      onStop={() => {
        creativeEngine.editor.addUndoStep();
      }}
      onChange={(value) => {
        setAdjustment(fromPercent(value));
      }}
    />
  );
};
export default AdjustSliderBar;
