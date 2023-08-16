import CreativeEditorSDK from '@cesdk/cesdk-js';
import CreativeEngine from '@cesdk/engine';
import classNames from 'classnames';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import SegmentedControl from 'components/ui/SegmentedControl/SegmentedControl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classes from './CaseComponent.module.css';
import { ReactComponent as FullscreenEnterIcon } from './FullscreenEnter.svg';
import { ReactComponent as FullscreenLeaveIcon } from './FullscreenLeave.svg';
import { Mockup3DCanvas } from './Mockup3DCanvas';

const PRODUCTS = {
  businesscard: {
    label: 'Business Card',
    assetsFolderName: 'business-card',
    sceneTitle: 'Business Card Design',
    baseColorTextureIndex: 0,
    cameraOrbit: '160deg 90deg'
  },
  cap: {
    label: 'Baseball Cap',
    assetsFolderName: 'cap',
    sceneTitle: 'Baseball Cap Design',
    baseColorTextureIndex: 0,
    cameraOrbit: '160deg 90deg'
  },
  apparel: {
    label: 'Apparel',
    assetsFolderName: 't-shirt',
    sceneTitle: 'T-Shirt Design',
    baseColorTextureIndex: 1,
    cameraOrbit: '0deg 90deg'
  }
};
const WHITE_1_PX_IMAGE_PATH = `${window.location.protocol + "//" + window.location.host}/cases/3d-mockup-editor/1x1-ffffffff.png`;

const CaseComponent = () => {
  const cesdkContainerRef = useRef(null);
  const cesdkEngineRef = useRef(null);
  const mockupEngineRef = useRef(null);
  const [currentMockupScene, setCurrentMockupScene] = useState();
  const [currentMockupUrl, setCurrentMockupUrl] = useState('');
  const [mockupLoading, setMockupLoading] = useState(true);
  const [mockupRendering, setMockupRendering] = useState(false);
  const [mockupFullscreen, setMockupFullscreen] = useState(false);
  const [cesdkEngineLoaded, setCesdkEngineLoaded] = useState(false);
  const [mockupEngineLoaded, setMockupEngineLoaded] = useState(false);
  const [isDirty, setIsDirty] = useState(true);

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const productParam = params.get('c_product') || 'apparel';
  const [product, setProduct] = useState(productParam);

  // Storing the current product in a ref to abort the renderMockup function
  // if the product changes while rendering.
  const currentProduct = useRef(product);
  useEffect(() => {
    currentProduct.current = product;
  }, [product]);

  // Syncs the selected product with the URL for demonstration purposes
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    params.set('c_product', product);
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  }, [product]);
  const productConfig = useMemo(() => PRODUCTS[product], [product]);

  useEffect(() => {
    const config = {
      license: process.env.REACT_APP_LICENSE
    };

    CreativeEngine.init(config).then(async (instance) => {
      instance.addDefaultAssetSources();
      instance.addDemoAssetSources();
      mockupEngineRef.current = instance;
      setMockupEngineLoaded(true);
    });
    return () => {
      if (mockupEngineRef.current) {
        try {
          mockupEngineRef.current.dispose();
        } catch (error) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const renderMockup = useCallback(async () => {
    if (mockupRendering) {
      return;
    }
    setMockupRendering(true);
    setMockupLoading(true);
    // let react render
    await new Promise((resolve) => setTimeout(resolve, 0));
    const cesdkEngine = cesdkEngineRef.current.engine;
    const mockupCesdk = mockupEngineRef.current;

    let pageBlobs = [];
    // Render pages in sequence
    for (const blockId of cesdkEngine.block.findByType('page')) {
      const pageBlob = await cesdkEngine.block.export(blockId, 'image/png', {
        // Reduce size for faster previews
        targetWidth: 1048,
        targetHeight: 1048
      });
      pageBlobs = [...pageBlobs, pageBlob];
    }

    // Render Texture Maps
    if (currentMockupScene) {
      await mockupCesdk.scene.loadFromString(currentMockupScene);
    } else {
      await mockupCesdk.scene.loadFromURL(
        `${window.location.protocol + "//" + window.location.host}/cases/3d-mockup-editor/${productConfig.assetsFolderName}/textures/Material_baseColor.scene`
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
    const mockupBlob = await mockupCesdk.block.export(scene, 'image/jpeg');
    setMockupLoading(false);
    setMockupRendering(false);
    // Abort if product changed while rendering
    if (currentProduct.current !== product) {
      return;
    }
    setIsDirty(false);
    setCurrentMockupScene(mockupScene);
    setCurrentMockupUrl(URL.createObjectURL(mockupBlob));
  }, [currentMockupScene, cesdkEngineRef, mockupEngineRef, productConfig]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cesdkEngineLoaded && isDirty && mockupEngineLoaded) {
        renderMockup();
      }
    }, 1500);

    return () => clearInterval(intervalId);
  }, [isDirty, cesdkEngineLoaded, mockupEngineLoaded, renderMockup]);

  useEffect(() => {
    let mounted = true;
    let config = {
      license: process.env.REACT_APP_LICENSE,
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
    };


    let cesdk;
    let unsubscribe;
    if (cesdkContainerRef.current) {
      CreativeEditorSDK.create(cesdkContainerRef.current, config).then(
        (instance) => {
          if (!mounted) return;
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({
            sceneMode: 'Design',
            excludeAssetSourceIds: ['ly.img.template']
          });
          instance.engine.editor.setSettingBool('page/title/show', false);
          cesdk = instance;
          cesdkEngineRef.current = instance;
          unsubscribe = instance.engine.editor.onHistoryUpdated(() => {
            setIsDirty(true);
          });
          instance.loadFromURL(
            `${window.location.protocol + "//" + window.location.host}/cases/3d-mockup-editor/${productConfig.assetsFolderName}/design.scene`
          );
          setCesdkEngineLoaded(true);
        }
      );
    }
    return () => {
      mounted = false;
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
    <div className={classes.outerWrapper}>
      <div className={classes.productsWrapper}>
        <SegmentedControl
          options={Object.entries(PRODUCTS).map(([value, { label }]) => ({
            label,
            value
          }))}
          value={product}
          name="product"
          onChange={(value) => {
            setProduct(value);
            setCurrentMockupUrl('');
          }}
          size="md"
        />
      </div>

      <div className={classes.wrapper}>
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
              </div>
            )}

            {currentMockupUrl && (
              <Mockup3DCanvas
                isInteractive={mockupFullscreen}
                imageUrl={currentMockupUrl}
                modelUrl={`${window.location.protocol + "//" + window.location.host}/cases/3d-mockup-editor/${productConfig.assetsFolderName}/scene.gltf`}
                baseColorTextureIndex={productConfig.baseColorTextureIndex}
                cameraOrbit={productConfig.cameraOrbit}
              />
            )}
          </div>
        </div>

        <div className={classes.cesdkWrapper}>
          <div ref={cesdkContainerRef} className={classes.cesdk}></div>
        </div>
      </div>
    </div>
  );
};

function replaceImages(cesdk, imageName, newUrl) {
  const images = cesdk.block.findByName(imageName);

  images.forEach((image) => {
    cesdk.block.setString(image, 'image/imageFileURI', newUrl);
    cesdk.block.resetCrop(image);
  });
}

export default CaseComponent;
