'use client';

import CutoutLibraryPlugin, {
  getCutoutLibraryInsertEntry
} from '@imgly/plugin-cutout-library-web';
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
                // Cutouts make sense for PDF exports
                format: ['application/pdf']
              }
            }
          },
          libraries: {
            insert: {
              entries: (defaultEntries) => {
                return [
                  ...defaultEntries.filter(
                    (entry) => entry.id !== 'ly.img.template'
                  ),
                  getCutoutLibraryInsertEntry()
                ];
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

    instance.unstable_addPlugin(
      CutoutLibraryPlugin({
        ui: {
          locations: ['canvasMenu']
        }
      })
    );

    await instance.engine.scene.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/cutout-lines/example.scene`
    );
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
