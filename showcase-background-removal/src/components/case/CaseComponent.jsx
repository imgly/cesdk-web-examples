'use client';

import BackgroundRemovalPlugin from '@imgly/plugin-background-removal-web';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
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
      BackgroundRemovalPlugin({
        ui: {
          locations: ['canvasMenu']
        }
      })
    );
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/background-removal/scene.scene`
    );
    const engine = instance.engine;
    // hide the title of the page:
    engine.editor.setSetting('page/title/show', false);

    // Select the first image on canvas to highlight background removal option:
    const image = engine.block.findByName('FirstImage')[0];
    const selected = engine.block.findAllSelected();
    selected.forEach((block) => {
      engine.block.setSelected(block, false);
    });
    engine.block.setSelected(image, true);
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
