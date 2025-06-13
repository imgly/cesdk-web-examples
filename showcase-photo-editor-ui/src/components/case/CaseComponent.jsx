'use client';

import { initPhotoEditorUIConfig } from './PhotoEditorUIConfig';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
      role: 'Adopter',
      theme: 'dark',
      license: process.env.NEXT_PUBLIC_LICENSE,

      ui: {
        elements: {
          blocks: {
            '//ly.img.ubq/page': {
              stroke: { show: false },
              manage: false
            }
          },
          panels: {
            inspector: {
              show: true,
              position: 'left'
            }
          },
          libraries: {
            replace: {
              floating: true,
              autoClose: true
            },
            insert: {
              autoClose: false,
              floating: false
            }
          },
          navigation: {
            title: 'Photo Editor',
            action: {
              export: {
                show: true,
                format: ['image/png']
              }
            }
          }
        },
        cropPresetsLibraries: (engine) => {
          const [selectedBlock] = engine.block.findAllSelected();
          const isPage =
            selectedBlock != null &&
            engine.block.getType(selectedBlock) === '//ly.img.ubq/page';

          if (isPage) return ['ly.img.crop.presets', 'ly.img.page.presets'];

          return ['ly.img.crop.presets'];
        }
      },
      i18n: {
        en: {
          'component.fileOperation.exportImage': 'Export Image'
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
    const cleanup = await initPhotoEditorUIConfig(
      instance,
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=dom-hill-nimElTcTNyY-unsplash.jpg&w=1920'
    );
    return cleanup;
  }, []);

  return (
    <div className="cesdkWrapperStyle">
      <CreativeEditor
        className="cesdkStyle"
        style={{
          // Hide the inspector bar
          '--ubq-InspectorBar-background': 'var(--ubq-canvas)'
        }}
        config={config}
        configure={configure}
      />
    </div>
  );
};
export default CaseComponent;
