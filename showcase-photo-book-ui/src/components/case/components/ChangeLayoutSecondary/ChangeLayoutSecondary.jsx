import { useEffect, useState } from 'react';
import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';

const ChangeLayoutSecondary = () => {
  const { engine } = useEngine();
  const { currentPageBlockId, setCurrentPageBlockId, setEnabled } =
    useSinglePageMode();

  const [layouts, setLayouts] = useState([]);

  useEffect(() => {
    const fetchLayouts = async () => {
      const queryParameters = {
        page: 1,
        perPage: 999
      };
      const newLibraryImages = await engine.asset.findAssets(
        'layouts',
        queryParameters
      );
      setLayouts(newLibraryImages.assets);
    };
    fetchLayouts();
  }, [engine]);

  return (
    <AdjustmentsBar>
      {layouts.map((layoutAsset) => {
        return (
          <AdjustmentsBarButton
            key={layoutAsset.thumbUri}
            onClick={async () => {
              setEnabled(false);
              const currentPageFillColor = engine.block.getColorRGBA(
                currentPageBlockId,
                'fill/solid/color'
              );
              const newPageId = await engine.asset.getApplyAsset('layouts')(
                layoutAsset
              );
              engine.block.setColorRGBA(
                newPageId,
                'fill/solid/color',
                ...currentPageFillColor
              );
              await setCurrentPageBlockId(newPageId);
              setEnabled(true);
            }}
          >
            <img src={layoutAsset.thumbUri} alt="Layout Preview" />
          </AdjustmentsBarButton>
        );
      })}
    </AdjustmentsBar>
  );
};
export default ChangeLayoutSecondary;
