'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import CreativeEngine from '@cesdk/engine';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import classes from './CaseComponent.module.css';
import EditMockupCESDK from './Components/EditMockupCESDK/EditMockupCESDK';
import DownloadIcon from './Download.svg';
import EditIcon from './Edit.svg';
import FullscreenEnterIcon from './FullscreenEnter.svg';
import FullscreenLeaveIcon from './FullscreenLeave.svg';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';
import { useCreativeEngine } from './lib/CreativeEngine';

const PRODUCTS = {
  businesscard: {
    label: 'Business Card',
    scenePath: 'business-card.scene',
    sceneTitle: 'Business Card Design',
    mockupScenePath: 'business-card-mockup.scene'
  },
  poster: {
    label: 'Poster',
    scenePath: 'poster.scene',
    sceneTitle: 'Poster Design',
    mockupScenePath: 'poster-mockup.scene'
  },
  socialmedia: {
    label: 'Social Media',
    scenePath: 'social-media.scene',
    sceneTitle: 'Social Media Post',
    mockupScenePath: 'social-media-mockup.scene'
  },
  postcard: {
    label: 'Post Card',
    scenePath: 'postcard.scene',
    sceneTitle: 'Postcard Design',
    mockupScenePath: 'postcard-mockup.scene'
  },
  apparel: {
    label: 'Apparel',
    scenePath: 'apparel.scene',
    sceneTitle: 'T-Shirt Design',
    mockupScenePath: 'apparel-mockup.scene'
  }
};
const WHITE_1_PX_IMAGE_PATH = `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/mockup-editor/1x1-ffffffff.png`;

export const replaceImages = (engine, imageName, newUrl) => {
  const images = engine.block.findByName(imageName);

  images.forEach((image) => {
    const fill = engine.block.getFill(image);
    engine.block.setString(fill, 'fill/image/imageFileURI', newUrl);
  });
};

const CaseComponent = () => {
  const [engine, setEngine] = useCreativeEngine();
  const [cesdk, setCesdk] = useCreativeEditor();

  const [currentMockupScene, setCurrentMockupScene] = useState();
  const [mockupEditorVisible, setMockupEditorVisible] = useState(false);
  const [currentMockupUrl, setCurrentMockupUrl] = useState('');
  const [mockupLoading, setMockupLoading] = useState(true);
  const [mockupRendering, setMockupRendering] = useState(false);
  const [mockupFullscreen, setMockupFullscreen] = useState(false);

  const [isDirty, setIsDirty] = useState(true);

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const productParam = params.get('c_product') || 'postcard';
  const [product, setProduct] = useState(productParam);
  // Syncs the selected product with the URL for demonstration purposes
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    params.set('c_product', product);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  }, [product]);
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

    let pageBlobs = [];
    // Render pages in sequence
    for (const blockId of cesdk.engine.block.findByKind('page')) {
      const pageBlob = await cesdk.engine.block.export(blockId, 'image/png', {
        // Reduce size for faster previews
        targetWidth: 512,
        targetHeight: 512
      });
      pageBlobs = [...pageBlobs, pageBlob];
    }

    if (currentMockupScene) {
      await engine.scene.loadFromString(currentMockupScene);
    } else {
      await engine.scene.loadFromURL(
        `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/mockup-editor/${productConfig.mockupScenePath}`
      );
    }
    // Fill unused pages in the mockup with white.
    for (let index = pageBlobs.length; index <= 10; index++) {
      replaceImages(engine, `Image ${index + 1}`, WHITE_1_PX_IMAGE_PATH);
    }
    pageBlobs.forEach((blob, index) => {
      replaceImages(engine, `Image ${index + 1}`, URL.createObjectURL(blob));
    });
    const scene = engine.scene.get();
    const mockupScene = await engine.scene.saveToString();
    setCurrentMockupScene(mockupScene);
    const mockupBlob = await engine.block.export(scene, 'image/jpeg');
    setCurrentMockupUrl(URL.createObjectURL(mockupBlob));
    setIsDirty(false);
    setMockupLoading(false);
    setMockupRendering(false);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(
        'Checking for dirty state',
        cesdk && engine && isDirty,
        cesdk,
        engine,
        isDirty
      );
      if (cesdk && engine && isDirty) {
        renderMockup();
      }
    }, 1500);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cesdk, engine, isDirty]);

  // Use engine to render mockup
  useEffect(() => {
    const config = {
      license: process.env.NEXT_PUBLIC_LICENSE
    };


    let removed = false;
    let localEngine;
    CreativeEngine.init(config).then(async (engine) => {
      if (removed) {
        engine.dispose();
        return;
      }
      localEngine = engine;
      setEngine(engine);
    });
    return () => {
      removed = true;
      if (localEngine) {
        localEngine.dispose();
      }
      setEngine(undefined);
    };
  }, [setEngine]);

  // useEffect(() => {
  //   if (!engine) return;

  //   async function onEngineReady() {
  //     await engine.scene.loadFromURL(
  //       `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/mockup-editor/${productConfig.mockupScenePath}`
  //     );
  //   }
  //   onEngineReady();
  // }, [productConfig]);

  const config = useConfig(
    () => ({
      license: process.env.NEXT_PUBLIC_LICENSE,
      role: 'Adopter',
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          navigation: {
            title: productConfig.sceneTitle,
            action: {
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          },
          libraries: {
            insert: {
              entries: (defaultEntries) => {
                return defaultEntries.filter(
                  (entry) => entry.id !== 'ly.img.template'
                );
              }
            }
          },
          panels: {
            settings: true
          }
        }
      }
    }),
    [productConfig]
  );
  const configure = useConfigure(
    async (instance) => {
      await instance.addDefaultAssetSources();
      await instance.addDemoAssetSources({ sceneMode: 'Design' });
      await instance.loadFromURL(
        `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/mockup-editor/${productConfig.scenePath}`
      );
    },
    [productConfig]
  );

  useEffect(() => {
    if (!cesdk) return;
    const unsubscribe = cesdk.engine.editor.onHistoryUpdated(() => {
      console.log('History updated');
      setIsDirty(true);
    });
    return () => {
      unsubscribe();
    };
  }, [cesdk]);

  useEffect(() => {
    if (product) {
      setMockupLoading(true);
      // Reset Mockup Scene
      setCurrentMockupScene();
      setIsDirty(true);
    }
  }, [product]);

  return (
    <div className={classes.outerWrapper}>
      <div className={classes.productsWrapper}>
        <SegmentedControl
          options={Object.entries(PRODUCTS).map(([value, { label }]) => ({
            label,
            value
          }))}
          value={product}
          name="product"
          onChange={(value) => setProduct(value)}
          size="md"
        />
      </div>

      <div className={classes.wrapper}>
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
            sceneUrl={`${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/mockup-editor/${productConfig.mockupScenePath}`}
          />
        )}
        <div
          className={classes.smokeScreen}
          style={{
            visibility: mockupFullscreen ? 'visible' : 'hidden',
            opacity: mockupFullscreen ? '1' : '0'
          }}
        ></div>
        <div
          className={classNames({
            [classes.fullscreenMockupCenter]: mockupFullscreen
          })}
          onClick={(e) => {
            if (mockupFullscreen && e.target === e.currentTarget) {
              setMockupFullscreen(false);
            }
          }}
        >
          <div
            className={classNames({
              [classes.fullscreenMockupWrapper]: mockupFullscreen,
              [classes.mockupWrapper]: !mockupFullscreen
            })}
          >
            {mockupLoading && <LoadingSpinner />}
            {currentMockupUrl && (
              <div className={classes.topBar}>
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
                data-cy="mockup-preview"
                src={currentMockupUrl}
                alt={`Mockup of the ${product}`}
                className={classes.previewImage}
              />
            )}
          </div>
        </div>

        <div className={classes.cesdkWrapper}>
          <CreativeEditor
            className={classes.cesdk}
            config={config}
            configure={configure}
            onInstanceChange={setCesdk}
          />
        </div>
      </div>
    </div>
  );
};

export default CaseComponent;
