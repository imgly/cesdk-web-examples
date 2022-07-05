import CreativeEditorSDK from '@cesdk/cesdk-js';
import classNames from 'classnames';
import CreativeEngine from '@cesdk/engine';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEffect, useMemo, useRef, useState } from 'react';
import EditMockupCESDK from './Components/EditMockupCESDK/EditMockupCESDK';
import { ReactComponent as DownloadIcon } from './Download.svg';
import { ReactComponent as FullscreenEnterIcon } from './FullscreenEnter.svg';
import { ReactComponent as FullscreenLeaveIcon } from './FullscreenLeave.svg';
import { ReactComponent as EditIcon } from './Edit.svg';
import classes from './CaseComponent.module.css';

const PRODUCTS = {
  businesscard: {
    scenePath: 'business-card.scene',
    sceneTitle: 'Business Card Design',
    mockupScenePath: 'business-card-mockup.scene',
    previewDPI: 300
  },
  poster: {
    scenePath: 'poster.scene',
    sceneTitle: 'Poster Design',
    mockupScenePath: 'poster-mockup.scene',
    previewDPI: 72
  },
  socialmedia: {
    scenePath: 'social-media.scene',
    sceneTitle: 'Social Media Post',
    mockupScenePath: 'social-media-mockup.scene',
    previewDPI: 300
  },
  postcard: {
    scenePath: 'postcard.scene',
    sceneTitle: 'Postcard Design',
    mockupScenePath: 'postcard-mockup.scene',
    previewDPI: 300
  },
  apparel: {
    scenePath: 'apparel.scene',
    sceneTitle: 'T-Shirt Design',
    mockupScenePath: 'apparel-mockup.scene',
    previewDPI: 72
  }
};
const MOCKUP_ENGINE_TIMEOUT = 1500;
const WHITE_1_PX_IMAGE_PATH = `${window.location.protocol + "//" + window.location.host}/cases/mockup-editor/1x1-ffffffff.png`;

export const replaceImages = (cesdk, imageName, newUrl) => {
  const images = cesdk.block.findByName(imageName);

  images.forEach((image) => {
    cesdk.block.setString(image, 'image/imageFileURI', newUrl);
    cesdk.block.resetCrop(image);
  });
};

const CaseComponent = ({ product = 'postcard' }) => {
  const cesdkContainerRef = useRef(null);
  const cesdkEngineRef = useRef(null);
  const mockupEngineRef = useRef(null);
  const [currentMockupScene, setCurrentMockupScene] = useState();
  const [mockupEditorVisible, setMockupEditorVisible] = useState(false);
  const [currentMockupUrl, setCurrentMockupUrl] = useState('');
  const [mockupLoading, setMockupLoading] = useState(true);
  const [mockupRendering, setMockupRendering] = useState(false);
  const [mockupFullscreen, setMockupFullscreen] = useState(false);
  const [cesdkEngineLoaded, setCesdkEngineLoaded] = useState(false);
  const [mockupEngineLoaded, setMockupEngineLoaded] = useState(false);
  const [isDirty, setIsDirty] = useState(true);

  const productConfig = useMemo(() => PRODUCTS[product], [product]);

  const downloadMockup = () => {
    var saveImg = document.createElement('a');
    saveImg.href = currentMockupUrl;
    saveImg.download = `${product}.jpeg`;
    saveImg.click();
  };

  const renderMockup = async () => {
    if (mockupRendering) {
      return;
    }
    setMockupRendering(true);
    setMockupLoading(true);
    // let react render
    await new Promise((resolve) => setTimeout(resolve, 0));
    const cesdkEngine = cesdkEngineRef.current.engine;
    const cesdkScene = cesdkEngine.block.findByType('scene')[0];
    const mockupCesdk = mockupEngineRef.current;
    const originalDPI = cesdkEngine.block.getFloat(cesdkScene, 'scene/dpi');

    let pageBlobs = [];
    // Reduce DPI for faster previews
    cesdkEngine.block.setFloat(
      cesdkScene,
      'scene/dpi',
      productConfig.previewDPI
    );
    // Render pages in sequence
    for (const blockId of cesdkEngine.block.findByType('page')) {
      const pageBlob = await cesdkEngine.block.export(blockId, 'image/png');
      pageBlobs = [...pageBlobs, pageBlob];
    }
    cesdkEngine.block.setFloat(cesdkScene, 'scene/dpi', originalDPI);

    if (currentMockupScene) {
      await mockupCesdk.scene.loadFromString(currentMockupScene);
    } else {
      await mockupCesdk.scene.loadFromURL(
        `${window.location.protocol + "//" + window.location.host}/cases/mockup-editor/${productConfig.mockupScenePath}`
      );
    }
    // Fill unused pages in the mockup with white.
    for (let index = pageBlobs.length; index <= 10; index++) {
      replaceImages(mockupCesdk, `Image ${index + 1}`, WHITE_1_PX_IMAGE_PATH);
    }
    pageBlobs.forEach((blob, index) => {
      replaceImages(
        mockupCesdk,
        `Image ${index + 1}`,
        URL.createObjectURL(blob)
      );
    });
    const scene = mockupCesdk.block.findByType('scene')[0];
    const mockupScene = await mockupCesdk.scene.saveToString();
    setCurrentMockupScene(mockupScene);
    const mockupBlob = await mockupCesdk.block.export(scene, 'image/jpeg');
    setCurrentMockupUrl(URL.createObjectURL(mockupBlob));
    setIsDirty(false);
    setMockupLoading(false);
    setMockupRendering(false);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cesdkEngineLoaded && mockupEngineLoaded && isDirty) {
        renderMockup();
      }
    }, 1500);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, cesdkEngineLoaded, mockupEngineLoaded]);

  // Use engine to render mockup
  useEffect(() => {

    const config = {
      license: process.env.REACT_APP_LICENSE
    };

    CreativeEngine.init(config).then(async (instance) => {
      await instance.scene.loadFromURL(
        `${window.location.protocol + "//" + window.location.host}/cases/mockup-editor/${productConfig.mockupScenePath}`
      );
      mockupEngineRef.current = instance;
      // Give engine time to load assets.
      setTimeout(() => setMockupEngineLoaded(true), MOCKUP_ENGINE_TIMEOUT);
    });
    return () => {
      if (mockupEngineRef.current) {
        mockupEngineRef.current.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);
  useEffect(() => {
    let config = {
      license: process.env.REACT_APP_LICENSE,
      role: 'Adopter',
      initialSceneURL: `${window.location.protocol + "//" + window.location.host}/cases/mockup-editor/${productConfig.scenePath}`,
      ui: {
        elements: {
          navigation: {
            title: productConfig.sceneTitle
          },
          panels: {
            settings: true
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
    let unsubscribe;
    if (cesdkContainerRef.current) {
      CreativeEditorSDK.init(cesdkContainerRef.current, config).then(
        (instance) => {
          cesdk = instance;
          cesdkEngineRef.current = instance;
          unsubscribe = instance.engine.event.subscribe([], (events) => {
            if (events.length > 0) {
              setIsDirty(true);
            }
          });
          setCesdkEngineLoaded(true);
        }
      );
    }
    return () => {
      if (cesdk) {
        if (unsubscribe) {
          unsubscribe();
        }
        cesdk.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cesdkContainerRef, product]);

  useEffect(() => {
    if (product) {
      setMockupLoading(true);
      // Reset Mockup Scene
      setCurrentMockupScene();
    }
  }, [product]);

  return (
    <div className="gap-md flex h-full w-full flex-col">
      {mockupEditorVisible && (
        <EditMockupCESDK
          onClose={() => setMockupEditorVisible(false)}
          onSave={async (sceneString) => {
            setCurrentMockupScene(sceneString);
            setMockupEditorVisible(false);
            setIsDirty(true);
            setMockupLoading(true);
          }}
          templateName={`${productConfig.sceneTitle} Mockup`}
          sceneString={currentMockupScene}
          sceneUrl={`${window.location.protocol + "//" + window.location.host}/cases/mockup-editor/${productConfig.mockupScenePath}`}
        />
      )}
      <div
        className={classes.smokeScreenStyle}
        style={{
          visibility: mockupFullscreen ? 'visible' : 'hidden',
          opacity: mockupFullscreen ? '1' : '0'
        }}
      ></div>
      <div
        className={classNames(
          'gap-sm flex flex-row justify-between',
          classes.headerStyle
        )}
      >
        <div className="caseHeader">
          <h3>Mockup Editor</h3>
          <p>
            Choose a product on the left bar and showcase your design in mockup
            scenes.
          </p>
        </div>
        <div
          className={classNames({
            [classes.fullscreenMockupCenterStyle]: mockupFullscreen
          })}
        >
          <div
            className={classNames({
              [classes.fullscreenMockupWrapperStyle]: mockupFullscreen,
              [classes.mockupWrapperStyle]: !mockupFullscreen
            })}
          >
            {mockupLoading && <LoadingSpinner />}
            {currentMockupUrl && (
              <div className={classes.topBarStyle}>
                <button
                  className={classes.button}
                  onClick={() => setMockupFullscreen((prev) => !prev)}
                >
                  {mockupFullscreen ? (
                    <>
                      <FullscreenLeaveIcon /> Exit Fullscreen
                    </>
                  ) : (
                    <FullscreenEnterIcon />
                  )}
                </button>
                <button
                  className={classNames(classes.button, {
                    [classes['button--solid']]: mockupFullscreen
                  })}
                  onClick={() => {
                    setMockupFullscreen(false);
                    setMockupEditorVisible(true);
                  }}
                >
                  <EditIcon /> Edit
                </button>

                <button
                  className={classNames(classes.button, {
                    [classes['button--primary']]: mockupFullscreen
                  })}
                  onClick={downloadMockup}
                >
                  {mockupFullscreen && 'Download Mockup'}
                  <DownloadIcon />
                </button>
              </div>
            )}
            {currentMockupUrl && (
              <img
                src={currentMockupUrl}
                alt={`Mockup of the ${product}`}
                className={classes.previewImageStyle}
              />
            )}
          </div>
        </div>
      </div>

      <div className={classes.wrapperStyle}>
        <div ref={cesdkContainerRef} className={classes.cesdkStyle}></div>
      </div>
    </div>
  );
};

export default CaseComponent;
