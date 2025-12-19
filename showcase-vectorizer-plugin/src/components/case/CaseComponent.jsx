'use client';

'use client';

import VectorizationPlugin from '@imgly/plugin-vectorizer-web';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      featureFlags: {
        archiveSceneEnabled: true
      },
      role: 'Creator',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      ui: {
        elements: {
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          }
        }
      },
      callbacks: {
        onExport: 'download',
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
    await instance.addPlugin(
      VectorizationPlugin({
        // This will automatically prepend a button to the canvas menu
        ui: { locations: 'canvasMenu' }
      })
    );
    await instance.engine.scene.loadFromArchiveURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/vectorizer-plugin/scene.archive`
    );
    const engine = instance.engine;
    // hide the title of the page:
    engine.editor.setSetting('page/title/show', false);

    // Select the first image on canvas to highlight background removal option:
    const image = engine.block.findByName('SelectedImage')[0];
    if (image) engine.block.select(image, true);
  });

  return (
    <div className="cesdkWrapperStyle">
      <CreativeEditor
        className="cesdkStyle"
        config={config}
        configure={configure}
      />
    </div>
  );
};

export default CaseComponent;
