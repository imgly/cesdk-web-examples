'use client';

import { ColorPicker } from '@/components/ui/ColorPicker/ColorPicker';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import classes from './CaseComponent.module.css';
import { hexToRgba } from './convert';
import CreativeEngine, {
  useConfig,
  useConfigure,
  useCreativeEngine
} from './lib/CreativeEngine';
import { caseAssetPath } from './util';

const CaseComponent = () => {
  const [engine, setEngine] = useCreativeEngine();
  const [headline, setHeadline] = useState();
  const [image, setImage] = useState(null);
  const [fontName, setFontName] = useState(null);
  const [colorHex, setColorHex] = useState('#C0C3C5');
  const colorRGBA = useMemo(() => {
    let { r, g, b } = hexToRgba(colorHex);
    // The engine works with color values from 0 to 1 instead of 0 to 255.
    return { r: r / 255, g: g / 255, b: b / 255 };
  }, [colorHex]);

  const config = useConfig(
    () => ({
      license: process.env.NEXT_PUBLIC_LICENSE
    }),
    []
  );

  const configure = useConfigure(async (engine) => {
    await engine.addDefaultAssetSources();
    await engine.addDemoAssetSources({ sceneMode: 'Design' });
    engine.editor.setSettingBool('page/title/show', false);
    engine.editor.setSettingBool('mouse/enableScroll', false);
    engine.editor.setSettingBool('mouse/enableZoom', false);
    engine.editor.setSettingBool('doubleClickToCropEnabled', false);
    await engine.scene.loadFromURL(caseAssetPath('/example.scene'));
    const [page] = engine.block.findByKind('page');
    // // Leave some extra space bottom for the gizmo
    engine.scene.enableZoomAutoFit(page, 'Both', 10, 10, 10, 50);
  }, []);

  useEffect(
    function updateSceneColors() {
      if (!engine || !colorRGBA) return;

      const page = engine.block.findByKind('page')[0];
      const text = engine.block.findByKind('text')[0];
      let { r, g, b } = colorRGBA;
      engine.block.setColor(page, 'fill/solid/color', { r, g, b, a: 1 });
      engine.block.setColor(text, 'fill/solid/color', { r, g, b, a: 1 });
    },
    [colorRGBA, engine]
  );

  useEffect(
    function updateFontFamily() {
      if (!engine || !fontName) return;

      async function updateFontFamily() {
        const textBlock = engine.block.findByKind('text')[0];
        const typefaceAssetResults = await engine.asset.findAssets(
          'ly.img.typeface',
          {
            query: fontName,
            page: 0,
            perPage: 1
          }
        );
        const typefaceAsset = typefaceAssetResults.assets[0];
        if (!typefaceAsset) {
          console.error(`Could not find font with name ${fontName}`);
          return;
        }
        const typeface = typefaceAsset.payload.typeface;
        const font = typeface.fonts.find(
          (font) => font.weight === 'normal' && font.style === 'normal'
        );
        engine.block.setFont(textBlock, font.uri, typeface);
      }

      updateFontFamily();
    },
    [fontName, engine]
  );

  useEffect(
    function updateImageFile() {
      if (engine && image) {
        const imageBlock = engine.block.findByKind('image')[0];
        const fill = engine.block.getFill(imageBlock);
        engine.block.setString(fill, 'fill/image/imageFileURI', image.full);
        // We need to reset the crop after changing an image file to ensure that it is shown in full.
        engine.block.resetCrop(imageBlock);
      }
    },
    [image, engine]
  );

  useEffect(
    function updateText() {
      if (!engine || !headline) return;
      engine.variable.setString('quote', headline);
    },
    [headline, engine]
  );

  const randomizeParameters = () => {
    setFontName(FONTS[Math.floor(Math.random() * FONTS.length)]);
    setImage(IMAGES[Math.floor(Math.random() * IMAGES.length)]);
    setHeadline(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    setColorHex(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.inputsWrapper}>
        <h4 className={'h4'}>Select Content</h4>
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
                !fontName && 'select--placeholder'
              )}
              value={fontName || 'placeholder'}
              onChange={(e) => setFontName(e.target.value)}
            >
              <option value="placeholder" disabled>
                Select Font
              </option>
              {FONTS.map((name) => (
                <option key={name} value={name}>
                  {name}
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
            className="button button--primary"
            onClick={() => randomizeParameters()}
          >
            Shuffle
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-grow space-y-2 w-full items-center">
        <h4 className="h4">Generated Design</h4>
        {!engine && <LoadingSpinner />}
        <CreativeEngine
          config={config}
          configure={configure}
          onInstanceChange={setEngine}
          className={classes.canvas}
        />
      </div>
    </div>
  );
};

const COLORS = ['#2B3B52', '#4700BB', '#72332E', '#BA9820', '#FF6363'];

const FONTS = [
  'Playfair display',
  'Poppins',
  'Rasa',
  'Courier Prime',
  'Caveat'
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
