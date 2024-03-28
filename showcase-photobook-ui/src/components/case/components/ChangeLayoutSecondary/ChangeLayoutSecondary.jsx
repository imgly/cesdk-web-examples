import { useEffect, useState } from 'react';
import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import AdjustmentsBar from '../../ui/AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../../ui/AdjustmentsBarButton/AdjustmentsBarButton';

const LAYOUT_LIBRARY_ID = 'ly.img.layouts';

const ChangeLayoutSecondary = () => {
  const { engine } = useEngine();

  const [layouts, setLayouts] = useState([]);

  useEffect(() => {
    const fetchLayouts = async () => {
      const queryParameters = {
        page: 0,
        perPage: 999
      };
      const newLibraryImages = await engine.asset.findAssets(
        LAYOUT_LIBRARY_ID,
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
            key={layoutAsset.meta.thumbUri}
            onClick={async () => {
              await engine.asset.apply(LAYOUT_LIBRARY_ID, layoutAsset);
            }}
          >
            <img src={layoutAsset.meta.thumbUri} alt="Layout Preview" />
          </AdjustmentsBarButton>
        );
      })}
    </AdjustmentsBar>
  );
};
export default ChangeLayoutSecondary;
