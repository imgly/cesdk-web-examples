'use client';

import { ExportDesignPanelPlugin } from './ExportDesignPanelPlugin';
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
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    instance.addPlugin(ExportDesignPanelPlugin());
    instance.ui.setNavigationBarOrder([
      'ly.img.back.navigationBar',
      'ly.img.undoRedo.navigationBar',

      'ly.img.spacer',

      'ly.img.zoom.navigationBar',
      'ly.img.export-options-design.navigationBar'
    ]);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/example-1.scene`
    );
  }, []);

  return (
    <div style={wrapperStyle}>
      <div className="cesdkWrapperStyle">
        <CreativeEditor
          className="cesdkStyle"
          config={config}
          configure={configure}
        />
      </div>
    </div>
  );
};

const wrapperStyle = {
  minHeight: '640px',
  display: 'flex',
  borderRadius: '0.75rem',
  flexGrow: '1',
  gap: '1rem'
};
export default ExportOptionsCESDK;
