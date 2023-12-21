import { useEditor } from '../../EditorContext';
import { useProperty } from '../../lib/UseSelectedProperty';
import SliderBar from '../SliderBar/SliderBar';

const ADJUSTMENT_DEFAULT_VALUE = 0;

const toPercent = (val) => val * 100;
const fromPercent = (val) => val / 100;

const ADJUSTMENT_TYPE = '//ly.img.ubq/effect/adjustments';
export const fetchAdjustmentEffect = (engine, block) => {
  const effects = engine.block.getEffects(block);

  let adjustmentEffect = effects.find(
    (effect) => engine.block.getString(effect, 'type') === ADJUSTMENT_TYPE
  );

  if (!adjustmentEffect) {
    adjustmentEffect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(block, adjustmentEffect);
  }
  return adjustmentEffect;
};

const AdjustSliderBar = ({ adjustmentId }) => {
  const { currentPageBlockId, engine } = useEditor();

  const [adjustment, setAdjustment] = useProperty(
    fetchAdjustmentEffect(engine, currentPageBlockId),
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
        engine.editor.addUndoStep();
      }}
      onChange={(value) => {
        setAdjustment(fromPercent(value));
      }}
    />
  );
};
export default AdjustSliderBar;
