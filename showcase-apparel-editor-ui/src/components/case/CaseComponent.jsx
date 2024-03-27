'use client';

import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef } from 'react';

const CaseComponent = () => {
  const cesdkContainer = useRef(null);
  useEffect(() => {
    const config = {
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
    };
    let cesdk;
    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({
            sceneMode: 'Design',
            excludeAssetSourceIds: ['ly.img.template']
          });
          cesdk = instance;
          const engine = cesdk.engine;
          engine.editor.setSettingBool('page/title/show', false);
          // The loaded scene includes a backdrop graphic block that is a child of the scene and helps the user to see their design on the finished product.
          // Such a scene can only be prepared using our API.
          await instance.loadFromURL(
            `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/apparel-editor-ui/tshirt.scene`
          );

          const pages = engine.block.findByType('page');
          pages.forEach((page) => {
            // This will clip off any content that is beyond the page.
            engine.block.setClipped(page, true);
          });
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
