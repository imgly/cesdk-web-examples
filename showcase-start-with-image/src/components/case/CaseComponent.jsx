import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef, useState } from 'react';

const CaseComponent = () => {
  const cesdk_container = useRef(null);
  const [image, setImage] = useState();

  useEffect(() => {
    const config = {
      role: 'Adopter',
      theme: 'light',
      initialImageURL: image?.full,
      callbacks: {
        onBack: () => setImage()
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
      },
      // Begin standard template presets
      presets: {
        templates: {
          postcard_1: {
            label: 'Postcard Design',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.png`
          },
          postcard_2: {
            label: 'Postcard Tropical',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.png`
          },
          business_card_1: {
            label: 'Business card',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_business_card_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_business_card_1.png`
          },
          instagram_photo_1: {
            label: 'Instagram photo',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_photo_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_photo_1.png`
          },
          instagram_story_1: {
            label: 'Instagram story',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_story_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_story_1.png`
          },
          poster_1: {
            label: 'Poster',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_poster_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_poster_1.png`
          },
          presentation_4: {
            label: 'Presentation',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_presentation_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_presentation_1.png`
          },
          collage_1: {
            label: 'Collage',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_collage_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_collage_1.png`
          }
        }
      }
      // End standard template presets
    };
    let cesdk;
    if (cesdk_container.current) {
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
  }, [cesdk_container, image]);

  return (
    <div style={wrapperStyle}>
      {!image && (
        <h3 className="h4" style={imageSelectionPromptStyle}>
          Select or upload an image
        </h3>
      )}
      <div
        style={{
          ...imageSelectionWrapper,
          ...((image && imageSelectionWrapperSmallStyle) || {})
        }}
      >
        {IMAGE_URLS.map((someImage) => (
          <button
            onClick={() => setImage(someImage)}
            style={imageButtonStyle}
            key={someImage.full}
          >
            <img
              src={someImage.thumb}
              style={{
                ...imageStyle,
                ...((image === someImage && imageActiveState) || {})
              }}
              alt=""
            />
          </button>
        ))}
      </div>
      {image && (
        <div style={cesdkWrapperStyle}>
          <div ref={cesdk_container} style={cesdkStyle}></div>
        </div>
      )}
    </div>
  );
};

const caseAssetPath = (path, caseId = 'start-with-image') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;
// https://unsplash.com/photos/ePpaQC2c1xA
// https://unsplash.com/photos/6qqwAsB22_M
// https://unsplash.com/photos/y-GMWtWW_H8
const IMAGE_URLS = [
  {
    full: caseAssetPath('/images/mountain-1200.jpg'),
    thumb: caseAssetPath('/images/mountain-300.jpg')
  },
  {
    full: caseAssetPath('/images/sea-1200.jpg'),
    thumb: caseAssetPath('/images/sea-300.jpg')
  },
  {
    full: caseAssetPath('/images/surf-1200.jpg'),
    thumb: caseAssetPath('/images/surf-300.jpg')
  }
];

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
const imageStyle = {
  height: '100%',
  borderRadius: '6px',
  objectFit: 'cover',
  cursor: 'pointer',
  border: '2px solid transparent'
};
const imageButtonStyle = {
  height: '100%',
  margin: '1rem'
};
const imageActiveState = {
  outline: '2px solid blue',
  border: '2px solid #7B8187'
};
const imageSelectionPromptStyle = { color: 'white', textAlign: 'center' };

export default CaseComponent;
