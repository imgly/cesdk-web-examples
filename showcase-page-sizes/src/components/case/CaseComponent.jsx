'use client';

import FORMAT_ASSETS from './CustomFormats.json';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import loadAssetSourceFromContentJSON from './lib/loadAssetSourceFromContentJSON';

const caseAssetPath = (path, caseId = 'page-sizes') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      locale: 'en',
      role: 'Creator',
      theme: 'light',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          },
          panels: {
            settings: true
          },
          libraries: {
            replace: {
              floating: false,
              autoClose: false
            },
            insert: {
              autoClose: false,
              floating: false
            }
          }
        }
      },
      i18n: {
        en: {
          'libraries.ly.img.formats.label': 'Page Sizes',
          'libraries.ly.img.formats.social.label': 'Social',
          'libraries.ly.img.formats.print.label': 'Print'
        }
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
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'ly.img.formats',
        label: 'libraries.ly.img.formats.label',
        icon: () => caseAssetPath('/page-sizes-large.svg'),
        entries: ['ly.img.formats']
      },
      'ly.img.separator',
      ...instance.ui.getDockOrder()
    ]);

    instance.ui.addAssetLibraryEntry({
      id: 'ly.img.formats',
      sourceIds: ['ly.img.formats'],
      previewLength: 3,
      gridColumns: 3,
      gridItemHeight: 'auto',
      previewBackgroundType: 'contain',
      gridBackgroundType: 'cover',
      cardLabel: (assetResult) => assetResult.label,
      cardLabelPosition: () => 'below'
    });

    loadAssetSourceFromContentJSON(
      instance.engine,
      FORMAT_ASSETS,
      caseAssetPath(''),
      async (asset) => {
        const engine = instance.engine;
        const pages = engine.scene.getPages();
        engine.scene.setDesignUnit(asset.meta.designUnit);
        engine.block.resizeContentAware(
          pages,
          parseInt(asset.meta.formatWidth, 10),
          parseInt(asset.meta.formatHeight, 10)
        );
      }
    );
    await instance.loadFromURL(caseAssetPath('/page-sizes.scene'));
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
