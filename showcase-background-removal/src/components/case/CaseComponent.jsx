'use client';

import BackgroundRemovalPlugin from '@imgly/plugin-background-removal-web';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Adopter',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      ui: {
        elements: {
          panels: {
            settings: true
          },
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

    await instance.unstable_addPlugin(
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
    engine.editor.setSettingBool('page/title/show', false);

    // Select the first image on canvas to highlight background removal option:
    const image = engine.block.findByName('FirstImage')[0];
    const selected = engine.block.findAllSelected();
    selected.forEach((block) => {
      engine.block.setSelected(block, false);
    });
    engine.block.setSelected(image, true);
  });

  return (
    <div style={cesdkWrapperStyle}>
      <CreativeEditor
        style={cesdkStyle}
        config={config}
        configure={configure}
      />
    </div>
  );
};

const cesdkStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
const cesdkWrapperStyle = {
  position: 'relative',
  minHeight: '640px',
  overflow: 'hidden',
  flexGrow: 1,
  display: 'flex',
  borderRadius: '0.75rem',
  boxShadow:
    '0px 0px 2px rgba(22, 22, 23, 0.25), 0px 4px 6px -2px rgba(22, 22, 23, 0.12), 0px 2px 2.5px -2px rgba(22, 22, 23, 0.12), 0px 1px 1.75px -2px rgba(22, 22, 23, 0.12)'
};
export default CaseComponent;
