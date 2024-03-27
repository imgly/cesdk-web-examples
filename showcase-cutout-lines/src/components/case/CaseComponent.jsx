'use client';

import CreativeEditorSDK from '@cesdk/cesdk-js';
import CutoutLibraryPlugin, {
  GetCutoutLibraryInsertEntry
} from '@imgly/plugin-cutout-library-web';
import { useEffect, useRef } from 'react';

const CaseComponent = () => {
  const cesdkContainer = useRef(null);
  useEffect(() => {
    const config = {
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
                  GetCutoutLibraryInsertEntry()
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
    };
    let cesdk;
    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          await instance.addDefaultAssetSources();
          await instance.addDemoAssetSources({ sceneMode: 'Design' });

          instance.unstable_addPlugin(CutoutLibraryPlugin());

          await instance.engine.scene.loadFromURL(
            `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/cutout-lines/example.scene`
          );
          cesdk = instance;
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdkContainer]);

  return (
    <div style={cesdkWrapperStyle}>
      <div ref={cesdkContainer} style={cesdkStyle}></div>
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
