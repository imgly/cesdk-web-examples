'use client';

import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef, useState } from 'react';

const CaseComponent = () => {
  const cesdkContainer = useRef(null);
  /** @type {[import("@cesdk/cesdk-js").default, Function]} cesdk */
  const [image, setImage] = useState();

  useEffect(() => {
    const config = {
      role: 'Adopter',
      theme: 'light',
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
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
      license: process.env.NEXT_PUBLIC_LICENSE
    };
    let cesdk;
    if (image && cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({ sceneMode: 'Design' });
          cesdk = instance;
          // Preselect the loaded Image
          await cesdk.createFromImage(image.full);
          const blocks = cesdk.engine.block.findByKind('image');
          if (blocks.length > 0) {
            cesdk.engine.block.setSelected(blocks[0], true);
          }
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdkContainer, image]);

  return (
    <div className="gap-sm flex h-full w-full flex-row">
      <div style={selectImageWrapper}>
        <h3 className="h4">Select Image</h3>
        <div
          style={{
            ...imageSelectionWrapper,
            ...(image || {})
          }}
        >
          {IMAGE_URLS.map((someImage, index) => (
            <button
              onClick={() => setImage(someImage)}
              style={imageButtonStyle}
              key={someImage.full}
              data-cy={`start-with-image-${index}`}
            >
              <img
                src={someImage.thumb}
                style={{
                  ...imageStyle,
                  ...((image === someImage && imageActiveState) || {})
                }}
                alt={someImage.alt}
              />
            </button>
          ))}
        </div>
      </div>

      <div style={cesdkWrapperStyle}>
        <div ref={cesdkContainer} style={cesdkStyle}></div>
      </div>
    </div>
  );
};

const caseAssetPath = (path, caseId = 'start-with-image') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;
// https://unsplash.com/photos/ePpaQC2c1xA
// https://unsplash.com/photos/6qqwAsB22_M
// https://unsplash.com/photos/y-GMWtWW_H8
const IMAGE_URLS = [
  {
    full: caseAssetPath('/images/mountain-1200.jpg'),
    thumb: caseAssetPath('/images/mountain-300.jpg'),
    alt: 'mountain'
  },
  {
    full: caseAssetPath('/images/sea-1200.jpg'),
    thumb: caseAssetPath('/images/sea-300.jpg'),
    alt: 'sea'
  },
  {
    full: caseAssetPath('/images/surf-1200.jpg'),
    thumb: caseAssetPath('/images/surf-300.jpg'),
    alt: 'surf'
  }
];

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

const selectImageWrapper = {
  width: '150px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};
const imageSelectionWrapper = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};
const imageStyle = {
  width: '100%',
  borderRadius: '6px',
  objectFit: 'cover',
  cursor: 'pointer'
};
const imageButtonStyle = {
  height: '100%',
  boxShadow:
    '0px 4px 6px -2px rgba(22, 22, 23, 0.12), 0px 2px 2.5px -2px rgba(22, 22, 23, 0.12), 0px 1px 1.75px -2px rgba(22, 22, 23, 0.12)',
  filter: 'drop-shadow(0px 0px 2px rgba(22, 22, 23, 0.25))'
};
const imageActiveState = {
  outline: '2px solid #471aff'
};

export default CaseComponent;
