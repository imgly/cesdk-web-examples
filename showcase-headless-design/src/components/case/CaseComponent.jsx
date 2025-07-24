'use client';

import { useState, useCallback } from 'react';
import classes from './CaseComponent.module.css';
import PodcastSearchSection from './components/PodcastSearchSection';
import CustomizationSection from './components/CustomizationSection';
import GeneratedAssetsSection from './components/GeneratedAssetsSection';

const CaseComponent = () => {
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [generatedAssets, setGeneratedAssets] = useState([]);

  const selectPodcast = (podcast) => {
    setCurrentPodcast(podcast);
  };

  const updateAsset = useCallback(
    async (assetId, newSceneString, url) => {
      setGeneratedAssets((assets) =>
        assets.map((asset) =>
          asset.id === assetId
            ? {
                ...asset,
                sceneString: newSceneString,
                src: url
              }
            : asset
        )
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [generatedAssets]
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.section}>
        <PodcastSearchSection
          currentPodcast={currentPodcast}
          onPodcastSelect={selectPodcast}
        />
      </div>
      <div className={classes.section}>
        <h4 className={'h3'}>Customize Design</h4>
        <div className={classes.customizationSectionWrapper}>
          <CustomizationSection
            podcastProp={currentPodcast}
            onAssetsUpdate={setGeneratedAssets}
          />
        </div>
      </div>
      <div className={classes.section}>
        <GeneratedAssetsSection
          assets={generatedAssets}
          onAssetUpdate={updateAsset}
        />
      </div>
    </div>
  );
};

export const SIZES = [
  { label: 'Instagram Story', width: 1080, height: 1920 },
  { label: 'Instagram Post', width: 1080, height: 1080 },
  { label: 'Facebook / X Post', width: 1300, height: 740 }
];

export default CaseComponent;
