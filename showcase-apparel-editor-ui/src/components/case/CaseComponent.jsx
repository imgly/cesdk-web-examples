'use client';

import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
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
                format: ['application/pdf']
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

    instance.ui.setDockOrder([
      ...instance.ui
        .getDockOrder()
        .filter(({ key }) => !['ly.img.template'].includes(key))
    ]);

    const engine = instance.engine;
    engine.editor.setSettingBool('page/title/show', false);
    // The loaded scene includes a backdrop graphic block that is a child of the scene and helps the user to see their design on the finished product.
    // Such a scene can only be prepared using our API.
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/apparel-editor-ui/tshirt.scene`
    );

    const pages = engine.block.findByType('page');
    pages.forEach((page) => {
      // temporary allow clipping
      const oldScope = engine.block.isScopeEnabled(page, 'layer/clipping');
      engine.block.setScopeEnabled(page, 'layer/clipping', true);
      // This will clip off any content that is beyond the page.
      engine.block.setClipped(page, true);
      engine.block.setScopeEnabled(page, 'layer/clipping', oldScope);
    });
  }, []);

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
