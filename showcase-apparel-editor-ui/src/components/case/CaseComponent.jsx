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
