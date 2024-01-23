import { useEffect, useMemo, useState } from 'react';
import { useEditor } from '../../EditorContext';
import { caseAssetPath } from '../../util';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import FilterButton from '../FilterButton/FilterButton';
import FILTER_MANIFEST from './FilterManifest.json';
import FilterSliderBar from './FilterSliderBar';

const LUT_FILTER_TYPE = '//ly.img.ubq/effect/lut_filter';
export const DEFAULT_FILTER_VALUE = 100;
export const ALL_FILTERS = FILTER_MANIFEST.assets[0].assets;

const lutFilterUriToId = (filterUri) =>
  ALL_FILTERS.find(({ lutImage }) => filterUri.includes(lutImage))?.id;

const FilterSecondary = () => {
  const { currentPageBlockId, engine } = useEditor();

  const [activeFilterId, setActiveFilterId] = useState(() => {
    const effects = engine.block.getEffects(currentPageBlockId);
    let lutFilterEffect = effects.find(
      (effect) => engine.block.getString(effect, 'type') === LUT_FILTER_TYPE
    );
    if (!lutFilterEffect) return 'none';
    let lutUri = engine.block.getString(
      lutFilterEffect,
      'effect/lut_filter/lutFileURI'
    );
    const lutId = lutFilterUriToId(lutUri);
    return lutId;
  });

  const activeFilter = useMemo(
    () => ALL_FILTERS.find(({ id }) => id === activeFilterId),
    [activeFilterId]
  );
  useEffect(() => {
    const element = document.getElementById(activeFilterId);
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {activeFilter && (
        <FilterSliderBar lutFilterConfig={activeFilter} key={activeFilter.id} />
      )}
      <AdjustmentsBar gap="md" scroll="scroll">
        <FilterButton
          key={'none'}
          id="none"
          label="None"
          thumbUrl={caseAssetPath('/images/none-filter-thumb.png')}
          onClick={() => {
            const effects = engine.block.getEffects(currentPageBlockId);
            let adjustmentEffect = effects.find(
              (effect) =>
                engine.block.getString(effect, 'type') === LUT_FILTER_TYPE
            );
            engine.block.destroy(adjustmentEffect);
            setActiveFilterId('none');
          }}
          isActive={activeFilterId === 'none'}
        />
        {ALL_FILTERS.map((filter) => (
          <FilterButton
            id={filter.id}
            key={filter.id}
            thumbUrl={engine.editor.defaultURIResolver(
              `extensions/ly.img.cesdk.filters.lut/${filter.thumbPath}`
            )}
            onClick={() => {
              setActiveFilterId(filter.id);
            }}
            isActive={activeFilterId === filter.id}
            label={filter.name}
          />
        ))}
      </AdjustmentsBar>
    </>
  );
};
export default FilterSecondary;
