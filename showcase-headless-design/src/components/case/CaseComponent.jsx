import CreativeEngine from '@cesdk/engine';
import classNames from 'classnames';
import { ColorPicker } from 'components/ui/ColorPicker/ColorPicker';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { useEffect, useMemo, useRef, useState } from 'react';
import { hexToRgba } from './convert';
import classes from './CaseComponent.module.css';
import { caseAssetPath, useDevicePixelRatio } from './util';

const CaseComponent = () => {
  /** @type {[import("@cesdk/engine").default, Function]} CreativeEngine */
  const [engine, setEngine] = useState();
  const [isEngineLoaded, setIsEngineLoaded] = useState(false);
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const containerRef = useRef(null);

  const [headline, setHeadline] = useState();
  const [image, setImage] = useState(null);
  const [font, setFont] = useState(null);
  const [colorHex, setColorHex] = useState('#C0C3C5');
  const colorRGBA = useMemo(() => {
    let { r, g, b } = hexToRgba(colorHex);
    // The engine works with color values from 0 to 1 instead of 0 to 255.
    return { r: r / 255, g: g / 255, b: b / 255 };
  }, [colorHex]);

  useEffect(() => {

    if (!containerRef.current || isEngineLoaded) {
      return;
    }
    /** @type {import("@cesdk/engine").Configuration} */
    const config = {
      page: {
        title: {
          show: false
        }
      }
    };

    let engineToBeDisposed;
    CreativeEngine.init(config).then(async (instance) => {
      instance.addDefaultAssetSources();
      instance.addDemoAssetSources();
      engineToBeDisposed = instance;
      setEngine(instance);
      setIsEngineLoaded(true);
    });

    return function shutdownCreativeEngine() {
      engineToBeDisposed?.dispose();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(
    function initializeScene() {
      if (!isEngineLoaded) {
        return;
      }
      const container = containerRef.current;
      const canvas = engine.element;
      async function initializeScene() {
        engine.editor.setSettingBool('ubq://doubleClickToCropEnabled', false);
        await engine.scene.loadFromURL(caseAssetPath('/example.scene'));
        container.append(canvas);
        await engine.scene.zoomToBlock(engine.scene.get(), 0, 0, 0, 0);
        setIsSceneLoaded(true);
      }
      initializeScene();
      return () => {
        canvas.remove();
      };
    },
    [engine, isEngineLoaded]
  );

  // We need to refocus the scene when the DPR changes, e.g when the window is moved between monitors.
  const [dpr] = useDevicePixelRatio();
  useEffect(
    function refocusAfterDPRChange() {
      if (isSceneLoaded && dpr) {
        engine.scene.zoomToBlock(engine.scene.get(), 0, 0, 0, 0);
      }
    },
    [dpr, engine, isSceneLoaded]
  );

  // We need to refocus the scene when the canvas size changes.
  useEffect(
    function refocusAfterCanvasSizeChange() {
      if (isSceneLoaded) {
        const resizeObserver = new ResizeObserver(async () => {
          await engine.scene.zoomToBlock(engine.scene.get(), 0, 0, 0, 0);
        });
        resizeObserver.observe(engine.element);
        return () => {
          resizeObserver.disconnect();
        };
      }
    },
    [engine, isSceneLoaded]
  );

  useEffect(
    function updateSceneColors() {
      if (isSceneLoaded && colorRGBA) {
        const page = engine.block.findByType('page')[0];
        const text = engine.block.findByType('//ly.img.ubq/text')[0];
        let { r, g, b } = colorRGBA;
        engine.block.setColorRGBA(page, 'fill/solid/color', r, g, b, 1.0);
        engine.block.setColorRGBA(text, 'fill/solid/color', r, g, b, 1.0);
      }
    },
    [colorRGBA, engine, isSceneLoaded]
  );

  useEffect(
    function updateFontFamily() {
      if (isSceneLoaded && font) {
        const textBlock = engine.block.findByType('//ly.img.ubq/text')[0];
        engine.block.setString(textBlock, 'text/fontFileUri', font.value);
      }
    },
    [font, engine, isSceneLoaded]
  );

  useEffect(
    function updateImageFile() {
      if (isSceneLoaded && image) {
        const imageBlock = engine.block.findByType('image')[0];
        engine.block.setString(imageBlock, 'image/imageFileURI', image.full);
        // We need to reset the crop after changing an image file to ensure that it is shown in full.
        engine.block.resetCrop(imageBlock);
      }
    },
    [image, engine, isSceneLoaded]
  );

  useEffect(
    function updateText() {
      if (isSceneLoaded && headline) {
        engine.variable.setString('quote', headline);
      }
    },
    [headline, engine, isSceneLoaded]
  );

  const randomizeParameters = () => {
    setFont(FONTS[Math.floor(Math.random() * FONTS.length)]);
    setImage(IMAGES[Math.floor(Math.random() * IMAGES.length)]);
    setHeadline(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setColorHex(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  return (
    <div className={classes.wrapper}>
      <div className="caseHeader">
        <h3>Automatic Design Generation</h3>
        <p>
          Use our API and underlying creative engine to autogenerate
          ready-to-use designs by selecting input parameters.
        </p>
      </div>
      <div className={classes.inputsWrapper}>
        <h4 className={classes.headline}>Select Content</h4>
        <div className={classes.imageSelectionWrapper}>
          {IMAGES.map((someImage, i) => (
            <button onClick={() => setImage(someImage)} key={someImage.thumb}>
              <img
                src={someImage.thumb}
                className={classNames(classes.image, {
                  [classes.imageActiveState]: someImage.thumb === image?.thumb
                })}
                alt={`Example ${i + 1}`}
              />
            </button>
          ))}
        </div>
        <input
          type="text"
          value={headline ?? ''}
          placeholder="Enter Text"
          onChange={(e) => setHeadline(e.target.value)}
        />
        <div className="flex space-x-2">
          <div className="select-wrapper flex-grow">
            <select
              name="font"
              id="font"
              className={classNames(
                'select',
                !font?.value && 'select--placeholder'
              )}
              value={font?.value || 'placeholder'}
              onChange={(e) =>
                setFont(FONTS.find((font) => font.value === e.target.value))
              }
            >
              <option value="placeholder" disabled>
                Select Font
              </option>
              {FONTS.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <ColorPicker
            positionX="left"
            positionY="bottom"
            theme="light"
            size="lg"
            onChange={(hex) => setColorHex(hex)}
            value={colorHex}
          />
        </div>
        <div>
          <button
            className="button button--light-white"
            onClick={() => randomizeParameters()}
          >
            Shuffle
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className={classes.headline}>Generated Design</h4>
        <div ref={containerRef} className={classes.canvas}>
          {!isSceneLoaded && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
};

const COLORS = ['#2B3B52', '#4700BB', '#72332E', '#BA9820', '#FF6363'];

const FONTS = [
  {
    value:
      '/extensions/ly.img.cesdk.fonts/fonts/Playfair_Display/PlayfairDisplay-SemiBold.ttf',
    label: 'Playfair display'
  },
  {
    label: 'Poppins',
    value: '/extensions/ly.img.cesdk.fonts/fonts/Poppins/Poppins-Bold.ttf'
  },
  {
    label: 'Rasa',
    value: '/extensions/ly.img.cesdk.fonts/fonts/Rasa/Rasa-Bold.ttf'
  },
  {
    label: 'Courier Prime',
    value:
      '/extensions/ly.img.cesdk.fonts/fonts/CourierPrime/CourierPrime-Bold.ttf'
  },
  {
    label: 'Caveat',
    value: '/extensions/ly.img.cesdk.fonts/fonts/Caveat/Caveat-Bold.ttf'
  }
];
// https://unsplash.com/photos/9COU9FyUIMU
// https://unsplash.com/photos/A2BMfcZH_Ig
// https://unsplash.com/photos/I7NNdMspF0M
// https://unsplash.com/photos/Ay_HG60pHHw
// https://unsplash.com/photos/FIKD9t5_5zQ
const IMAGES = [
  {
    full: caseAssetPath('/images/wall-1200.jpg'),
    thumb: caseAssetPath('/images/wall-300.jpg')
  },
  {
    full: caseAssetPath('/images/paint-1200.jpg'),
    thumb: caseAssetPath('/images/paint-300.jpg')
  },
  {
    full: caseAssetPath('/images/window-1200.jpg'),
    thumb: caseAssetPath('/images/window-300.jpg')
  },
  {
    full: caseAssetPath('/images/face-1200.jpg'),
    thumb: caseAssetPath('/images/face-300.jpg')
  },
  {
    full: caseAssetPath('/images/clouds-1200.jpg'),
    thumb: caseAssetPath('/images/clouds-300.jpg')
  }
];
const QUOTES = [
  'Good design is honest. — Dieter Rams',
  'Try not to become a man of success. Rather become a man of value. — Albert Einstein',
  'Imagination creates reality. — Richard Wagner',
  'Time you enjoy wasting, was not wasted. — John Lennon',
  'May the Force be with you. — Obi-Wan Kenobi'
];
export default CaseComponent;
