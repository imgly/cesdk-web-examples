'use client';

import { ExportVideoPanelPlugin } from './ExportVideoPanelPlugin';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const ExportOptionsCESDK = () => {
  const config = useConfig(
    () => ({
      role: 'Creator',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onUpload: 'local'
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Video' });
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    instance.addPlugin(ExportVideoPanelPlugin());

    instance.ui.setNavigationBarOrder([
      'ly.img.back.navigationBar',
      'ly.img.undoRedo.navigationBar',

      'ly.img.spacer',

      'ly.img.zoom.navigationBar',
      'ly.img.export-options.navigationBar'
    ]);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/video-export-options/example-video-motion.scene`
    );
  }, []);

  return (
    <div className="cesdkWrapperStyle" style={{ minHeight: '820px' }}>
      <CreativeEditor
        className="cesdkStyle"
        config={config}
        configure={configure}
      />
    </div>
  );
};

export default ExportOptionsCESDK;
