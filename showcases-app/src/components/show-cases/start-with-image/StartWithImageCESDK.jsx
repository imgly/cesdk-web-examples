import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef, useState } from 'react';

const IMAGE_URLS = [
  'https://source.unsplash.com/ePpaQC2c1xA/w=1200',
  'https://source.unsplash.com/6qqwAsB22_M/w=1200',
  'https://source.unsplash.com/y-GMWtWW_H8/w=1200'
];

const StartWithImageCESDK = () => {
  const cesdk_container = useRef(null);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    const config = {
      role: 'Adopter',
      theme: 'light',
      initialImageURL: imageUrl,
      callbacks: {
        onBack: () => setImageUrl()
      },
      ui: {
        elements: {
          panels: {
            settings: true
          },
          navigation: {
            action: {
              back: true
            }
          }
        }
      }
    };

    let cesdk;
    if (navigator.userAgent !== 'ReactSnap' && cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        (instance) => {
          cesdk = instance;

          // Preselect the loaded Image
          const blocks = cesdk.engine.block.findByType('image');
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
  }, [cesdk_container, imageUrl]);

  return (
    <div style={wrapperStyle}>
      {!imageUrl && (
        <h3 className="h4" style={imageSelectionPromptStyle}>
          Select or upload an image
        </h3>
      )}
      <div
        style={{
          ...imageSelectionWrapper,
          ...((imageUrl && imageSelectionWrapperSmallStyle) || {})
        }}
      >
        {IMAGE_URLS.map((url) => (
          <button
            onClick={() => setImageUrl(url)}
            style={{ height: '100%' }}
            key={url}
          >
            <img
              src={url}
              style={{
                ...image,
                ...((imageUrl === url && imageActiveState) || {})
              }}
              alt=""
            />
          </button>
        ))}
      </div>
      {imageUrl && (
        <div style={cesdkWrapperStyle}>
          <div ref={cesdk_container} style={cesdkStyle}></div>
        </div>
      )}
    </div>
  );
};

const cesdkStyle = {
  height: '100%',
  width: '100%',
  flexGrow: 1,
  overflow: 'hidden',
  borderRadius: '0.75rem'
};

const cesdkWrapperStyle = {
  borderRadius: '0.75rem',
  flexGrow: '1',
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)'
};
const wrapperStyle = {
  flexGrow: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyItems: 'center',
  justifyContent: 'center'
};
const imageSelectionWrapperSmallStyle = {
  height: 50
};

const imageSelectionWrapper = {
  display: 'flex',
  height: 100,
  marginBottom: '3rem',
  justifyContent: 'center'
};
const image = {
  height: '100%',
  margin: '1rem',
  borderRadius: '6px',
  objectFit: 'cover',
  cursor: 'pointer',
  border: '2px solid transparent'
};
const imageActiveState = {
  outline: '2px solid blue',
  border: '2px solid #7B8187'
};
const imageSelectionPromptStyle = { color: 'white', textAlign: 'center' };

export default StartWithImageCESDK;
