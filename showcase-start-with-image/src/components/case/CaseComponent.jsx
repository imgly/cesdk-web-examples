'use client';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import classNames from 'classnames';
import { useState } from 'react';
import classes from './CaseComponent.module.css';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { DesignEditorConfig } from './lib/design-editor/plugin';
import { addPremiumTemplatesAssetSource } from './lib/PremiumTemplateUtilities';

const CaseComponent = () => {
  const [image, setImage] = useState();

  const config = useConfig(
    () => ({
      role: 'Creator',
      theme: 'light',
      callbacks: {
        onExport: 'download',
        onUpload: 'local',
        onBack: () => {
          setImage(null);
        }
      },
      ui: {
        elements: {
          navigation: {
            action: {
              back: true,
              export: {
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          }
        }
      },
      license: process.env.NEXT_PUBLIC_LICENSE
    }),
    []
  );

  const configure = useConfigure(
    async (instance) => {
      // Add the design editor configuration plugin first
      await instance.addPlugin(new DesignEditorConfig());

      // Asset Source Plugins (replaces addDefaultAssetSources)
      await instance.addPlugin(new ColorPaletteAssetSource());
      await instance.addPlugin(new TypefaceAssetSource());
      await instance.addPlugin(new TextAssetSource());
      await instance.addPlugin(new TextComponentAssetSource());
      await instance.addPlugin(new VectorShapeAssetSource());
      await instance.addPlugin(new StickerAssetSource());
      await instance.addPlugin(new EffectsAssetSource());
      await instance.addPlugin(new FiltersAssetSource());
      await instance.addPlugin(new BlurAssetSource());
      await instance.addPlugin(new PagePresetsAssetSource());
      await instance.addPlugin(new CropPresetsAssetSource());
      await instance.addPlugin(
        new UploadAssetSources({
          include: ['ly.img.image.upload']
        })
      );

      // Demo assets (replaces addDemoAssetSources)
      await instance.addPlugin(
        new DemoAssetSources({
          include: ['ly.img.image.*']
        })
      );

      await addPremiumTemplatesAssetSource(instance);
      // Disable placeholder and preview features
      instance.feature.enable('ly.img.placeholder', false);
      instance.feature.enable('ly.img.preview', false);
      // Preselect the loaded Image
      await instance.createFromImage(image.full);
      const blocks = instance.engine.block.findByKind('image');
      if (blocks.length > 0) {
        instance.engine.block.setSelected(blocks[0], true);
      }
    },
    [image]
  );

  return (
    <div className="gap-sm flex h-full w-full flex-row justify-center">
      <div
        className={classNames(classes.selectImageWrapper, {
          [classes.selectImageWrapperActive]: !!image
        })}
      >
        <h3 className="h4">Select Image</h3>
        <div className={classes.imageSelectionWrapper}>
          {IMAGE_URLS.map((someImage, index) => (
            <button
              onClick={() => setImage(someImage)}
              className={classes.imageButtonStyle}
              key={someImage.full}
              data-cy={`start-with-image-${index}`}
            >
              <img
                src={someImage.thumb}
                className={classNames(classes.imageStyle, {
                  [classes.imageActiveState]: image === someImage
                })}
                alt={someImage.alt}
              />
            </button>
          ))}
        </div>
      </div>

      <div
        className={classNames('cesdkWrapperStyle', {
          [classes.cesdkWrapperActive]: !image
        })}
      >
        {image && (
          <CreativeEditor
            className="cesdkStyle"
            config={config}
            configure={configure}
          />
        )}
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

export default CaseComponent;
