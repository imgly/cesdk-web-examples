'use client';

import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef, useState } from 'react';

const CaseComponent = () => {
  const cesdkContainer = useRef(null);
  /** @type {[import("@cesdk/cesdk-js").default, Function]} cesdk */
  const [video, setVideo] = useState();

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
                show: true
              }
            }
          }
        }
      },
      license: process.env.NEXT_PUBLIC_LICENSE
    };
    let cesdk;
    if (video && cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({ sceneMode: 'Video' });
          cesdk = instance;
          const engine = cesdk.engine;
          await engine.scene.createFromVideo(video.full);
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdkContainer, video]);

  return (
    <div className="gap-sm flex h-full w-full flex-row">
      <div style={selectResourceWrapper}>
        <h3 className="h4">Select Video</h3>
        <div
          style={{
            ...videoSelectionWrapper,
            ...(video || {})
          }}
        >
          {VIDEO_URLS.map((someVideo, index) => (
            <button
              onClick={() => setVideo(someVideo)}
              style={videoButtonStyle}
              key={someVideo.full}
              data-cy={`start-with-video-${index}`}
            >
              <img
                src={someVideo.thumbUri}
                style={{
                  ...videoStyle,
                  ...((video === someVideo && videoActiveState) || {})
                }}
                alt={someVideo.alt}
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

const caseAssetPath = (path, caseId = 'start-with-video') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

// Sample videos are taken from pexels.com:
// https://www.pexels.com/video/person-decorating-dessert-with-kiwi-7930811/
// https://www.pexels.com/video/close-up-video-of-an-opened-pomegranate-7033913/
// https://www.pexels.com/video/a-young-an-squeezing-an-orange-6975806/
const VIDEO_URLS = [
  {
    full: caseAssetPath('/pexels-koolshooters-6975806.mp4'),
    thumbUri: caseAssetPath('/pexels-koolshooters-6975806.png'),
    alt: 'A Young an Squeezing An Orange',
    author: {
      name: 'KoolShooters',
      url: 'https://www.pexels.com/video/a-young-an-squeezing-an-orange-6975806/'
    }
  },
  {
    full: caseAssetPath('/pexels-nicola-barts-7930811.mp4'),
    thumbUri: caseAssetPath('/pexels-nicola-barts-7930811.png'),
    alt: 'Person Decorating Dessert With Kiwi',
    author: {
      name: 'Nicola Barts',
      url: 'https://www.pexels.com/video/person-decorating-dessert-with-kiwi-7930811/'
    }
  },
  {
    full: caseAssetPath('/pexels-tima-miroshnichenko-7033913.mp4'),
    thumbUri: caseAssetPath('/pexels-tima-miroshnichenko-7033913.png'),
    alt: 'Close Up Video Of An Opened Pomegranate',
    author: {
      name: 'Tima Miroshnichenko',
      url: 'https://www.pexels.com/video/close-up-video-of-an-opened-pomegranate-7033913/'
    }
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

const selectResourceWrapper = {
  width: '150px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const videoSelectionWrapper = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};
const videoStyle = {
  width: '100%',
  borderRadius: '6px',
  objectFit: 'cover',
  cursor: 'pointer'
};
const videoButtonStyle = {
  height: '100%',
  boxShadow:
    '0px 4px 6px -2px rgba(22, 22, 23, 0.12), 0px 2px 2.5px -2px rgba(22, 22, 23, 0.12), 0px 1px 1.75px -2px rgba(22, 22, 23, 0.12)',
  filter: 'drop-shadow(0px 0px 2px rgba(22, 22, 23, 0.25))'
};
const videoActiveState = {
  outline: '2px solid #471aff'
};

export default CaseComponent;
