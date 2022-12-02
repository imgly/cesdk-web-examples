import { useCallback, useEffect } from 'react';
import { useEditor } from '../../EditorContext';
import { fetchLutFilterEffect } from '../../lib/CreativeEngineUtils';
import { useProperty } from '../../lib/UseSelectedProperty';
import SliderBar from '../SliderBar/SliderBar';

const LUT_FILTER_DEFAULT_VALUE = 100;

const toPercent = (val) => val * 100;
const fromPercent = (val) => val / 100;

const LUT_FILTER_URI = 'effect/lut_filter/lutFileURI';
const LUT_FILTER_INTENSITY = 'effect/lut_filter/intensity';
const HORIZONTAL_TILES = 'effect/lut_filter/horizontalTileCount';
const VERTICAL_TILES = 'effect/lut_filter/verticalTileCount';

const FilterSliderBar = ({ lutFilterConfig }) => {
  const { currentPageBlockId, creativeEngine } = useEditor();

  const lutFilter = fetchLutFilterEffect(creativeEngine, currentPageBlockId);
  const [lutFilterIntensity] = useProperty(
    fetchLutFilterEffect(creativeEngine, currentPageBlockId),
    LUT_FILTER_INTENSITY
  );

  const { lutImage, horizontalTileCount, verticalTileCount, name } =
    lutFilterConfig;

  const uri = creativeEngine.editor.defaultURIResolver(
    `extensions/ly.img.cesdk.filters.lut/${lutImage}`
  );

  const setFilterProperties = useCallback(
    (intensity) => {
      creativeEngine.block.setString(lutFilter, LUT_FILTER_URI, uri);
      creativeEngine.block.setInt(
        lutFilter,
        HORIZONTAL_TILES,
        horizontalTileCount
      );
      creativeEngine.block.setInt(lutFilter, VERTICAL_TILES, verticalTileCount);
      creativeEngine.block.setFloat(lutFilter, LUT_FILTER_INTENSITY, intensity);
      creativeEngine.editor.addUndoStep();
    },
    [creativeEngine, horizontalTileCount, lutFilter, uri, verticalTileCount]
  );

  useEffect(() => {
    setFilterProperties(fromPercent(LUT_FILTER_DEFAULT_VALUE));
  }, [setFilterProperties]);

  return (
    <SliderBar
      key={name}
      min={-100}
      max={100}
      dead
      onReset={() => setFilterProperties(fromPercent(LUT_FILTER_DEFAULT_VALUE))}
      resetEnabled={toPercent(lutFilterIntensity) !== LUT_FILTER_DEFAULT_VALUE}
      current={toPercent(lutFilterIntensity)}
      onStop={() => {
        creativeEngine.editor.addUndoStep();
      }}
      onChange={(value) => {
        setFilterProperties(fromPercent(value));
      }}
    />
  );
};
export default FilterSliderBar;
