'use client';

'use client';

import QRCodePlugin from '@imgly/plugin-qr-code-web';
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
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    instance.addPlugin(
      QRCodePlugin({
        // This will automatically prepend a button to the canvas menu
        ui: { locations: 'canvasMenu' }
      })
    );
    instance.ui.setDockOrder([
      ...instance.ui.getDockOrder(),
      // The spacer is optional and pushes the QR code generator to the bottom
      'ly.img.spacer',
      // This will add a button to the dock that opens the QR code generator panel
      'ly.img.generate-qr.dock'
    ]);
    await instance.engine.scene.loadFromArchiveURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/qr-code-plugin/scene.archive`
    );
    const engine = instance.engine;
    // Select "QR Code 1"
    const qrCode = engine.block.findByName('QR Code 1')[0];
    if (qrCode) {
      engine.block.select(qrCode);
    }
    // hide the title of the page:
    engine.editor.setSettingBool('page/title/show', false);
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
