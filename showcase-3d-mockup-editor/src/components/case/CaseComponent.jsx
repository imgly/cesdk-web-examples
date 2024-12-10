'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import CreativeEngine from '@cesdk/engine';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classes from './CaseComponent.module.css';
import FullscreenEnterIcon from './FullscreenEnter.svg';
import FullscreenLeaveIcon from './FullscreenLeave.svg';
import { Mockup3DCanvas } from './Mockup3DCanvas';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';
import { useCreativeEngine } from './lib/CreativeEngine';

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
const WHITE_1_PX_IMAGE_PATH = `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/3d-mockup-editor/1x1-ffffffff.png`;

const CaseComponent = () => {
  const [engine, setEngine] = useCreativeEngine();
  const [cesdk, setCesdk] = useCreativeEditor();

  const [currentMockupScene, setCurrentMockupScene] = useState();
  const [currentMockupUrl, setCurrentMockupUrl] = useState('');
  const [mockupLoading, setMockupLoading] = useState(true);
  const [mockupRendering, setMockupRendering] = useState(false);
  const [mockupFullscreen, setMockupFullscreen] = useState(false);
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
        setEngine(undefined);
      }
    };
  }, [setEngine]);

  const renderMockup = useCallback(async () => {
    if (mockupRendering) {
      return;
    }
    setMockupRendering(true);
    setMockupLoading(true);
    // let react render
    await new Promise((resolve) => setTimeout(resolve, 0));

    let pageBlobs = [];
    // Render pages in sequence
    for (const blockId of cesdk.engine.block.findByType('page')) {
      const pageBlob = await cesdk.engine.block.export(blockId, 'image/png', {
        // Reduce size for faster previews
        targetWidth: 1048,
        targetHeight: 1048
      });
      pageBlobs = [...pageBlobs, pageBlob];
    }

    // Render Texture Maps
    if (currentMockupScene) {
      await engine.scene.loadFromString(currentMockupScene);
    } else {
      await engine.scene.loadFromURL(
        `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/3d-mockup-editor/${productConfig.assetsFolderName}/textures/Material_baseColor.scene`
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
    const mockupBlob = await engine.block.export(scene, 'image/jpeg');
    setMockupLoading(false);
    setMockupRendering(false);
    // Abort if product changed while rendering
    if (currentProduct.current !== product) {
      return;
    }
    setIsDirty(false);
    setCurrentMockupScene(mockupScene);
    setCurrentMockupUrl(URL.createObjectURL(mockupBlob));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMockupScene, cesdk, engine, productConfig]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cesdk && isDirty && engine) {
        renderMockup();
      }
    }, 1500);

    return () => clearInterval(intervalId);
  }, [isDirty, cesdk, engine, renderMockup]);

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
      instance.ui.setDockOrder([
        ...instance.ui
          .getDockOrder()
          .filter(({ key }) => key !== 'ly.img.template')
      ]);
      instance.engine.editor.setSettingBool('page/title/show', false);
      instance.loadFromURL(
        `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/3d-mockup-editor/${productConfig.assetsFolderName}/design.scene`
      );
    },
    [productConfig]
  );

  useEffect(() => {
    if (!cesdk) return;
    const unsubscribe = cesdk.engine.editor.onHistoryUpdated(() => {
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
                modelUrl={`${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/3d-mockup-editor/${productConfig.assetsFolderName}/scene.gltf`}
                baseColorTextureIndex={productConfig.baseColorTextureIndex}
                cameraOrbit={productConfig.cameraOrbit}
              />
            )}
          </div>
        </div>

        <div className="cesdkWrapperStyle">
          <CreativeEditor
            className="cesdkStyle"
            config={config}
            configure={configure}
            onInstanceChange={setCesdk}
          />
        </div>
      </div>
    </div>
  );
};

const replaceImages = (engine, imageName, newUrl) => {
  const images = engine.block.findByName(imageName);

  images.forEach((image) => {
    const fill = engine.block.getFill(image);
    engine.block.setString(fill, 'fill/image/imageFileURI', newUrl);
    engine.block.resetCrop(image);
  });
};

export default CaseComponent;
