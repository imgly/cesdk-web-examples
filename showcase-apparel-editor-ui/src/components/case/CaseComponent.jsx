'use client';

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
                format: ['application/pdf']
              }
            }
          },
          dock: {
            groups: [
              {
                id: 'ly.img.defaultGroup',
                showOverview: true
              }
            ]
          },

          libraries: {
            insert: {
              entries: (defaultEntries) =>
                defaultEntries.filter((e) => e.id !== 'ly.img.template')
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
    const engine = instance.engine;
    engine.editor.setSettingBool('page/title/show', false);
    // The loaded scene includes a backdrop graphic block that is a child of the scene and helps the user to see their design on the finished product.
    // Such a scene can only be prepared using our API.
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/apparel-editor-ui/tshirt.scene`
    );

    const checkScopesInAPIsSetting =
      engine.editor.getSettingBool('checkScopesInAPIs');
    engine.editor.setSettingBool('checkScopesInAPIs', false);
    const pages = engine.block.findByType('page');
    pages.forEach((page) => {
      // temporary allow clipping
      const oldScope = engine.block.isScopeEnabled(page, 'layer/clipping');
      engine.block.setScopeEnabled(page, 'layer/clipping', true);
      // This will clip off any content that is beyond the page.
      engine.block.setClipped(page, true);
      engine.block.setScopeEnabled(page, 'layer/clipping', oldScope);
    });
    // restore checkScopesInAPIs setting
    engine.editor.setSettingBool('checkScopesInAPIs', checkScopesInAPIsSetting);
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
