import CreativeEditorSDK from '@cesdk/cesdk-js';
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
import { DesignEditorConfig } from './lib/design-editor/plugin';
import { useEffect, useRef } from 'react';
import classes from './CreativeEditor.module.css';
import { addGoogleFontsAssetLibrary } from '@imgly/psd-importer';
import { addPremiumTemplatesAssetSource } from './lib/PremiumTemplateUtilities';

const CreativeEditor = ({ sceneArchiveUrl, closeEditor }) => {
  const cesdkContainer = useRef(null);
  const overlayContainer = useRef(null);

  useEffect(() => {
    const config = {
      license: process.env.NEXT_PUBLIC_LICENSE,
      ui: {
        typefaceLibraries: ['ly.img.google-fonts']
      }
    };
    let cesdk;
    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          instance.engine.editor.setRole('Creator');
          instance.ui.setView('advanced');
          // Add the design editor configuration plugin first
          await instance.addPlugin(new DesignEditorConfig());

          // Add default asset sources via plugins
          await instance.addPlugin(new ColorPaletteAssetSource());
          await instance.addPlugin(new TypefaceAssetSource());
          await instance.addPlugin(new TextAssetSource());
          await instance.addPlugin(new TextComponentAssetSource());
          await instance.addPlugin(new StickerAssetSource());
          await instance.addPlugin(new VectorShapeAssetSource());
          await instance.addPlugin(new FiltersAssetSource());
          await instance.addPlugin(new EffectsAssetSource());
          await instance.addPlugin(new BlurAssetSource());
          await instance.addPlugin(new CropPresetsAssetSource());
          await instance.addPlugin(new PagePresetsAssetSource());
          await instance.addPlugin(new UploadAssetSources());
          // Add demo asset sources
          await instance.addPlugin(
            new DemoAssetSources({
              include: ['ly.img.image.*']
            })
          );

          await addPremiumTemplatesAssetSource(instance);

          instance.engine.editor.setSetting('page/title/show', false);
          await instance.engine.scene.loadFromArchiveURL(sceneArchiveUrl);
          await addGoogleFontsAssetLibrary(instance.engine);
          // Zoom auto-fit to page
          instance.actions.run('zoom.toPage', {
            autoFit: true
          });
          cesdk = instance;

          // Add a back button at the beginning
          cesdk.ui.insertNavigationBarOrderComponent(
            'first',
            {
              id: 'ly.img.back.navigationBar',
              onClick: () => closeEditor()
            },
            'before'
          );

          // Add export buttons at the end
          cesdk.ui.insertNavigationBarOrderComponent('last', {
            id: 'ly.img.actions.navigationBar',
            children: [
              'ly.img.exportImage.navigationBar',
              'ly.img.exportPDF.navigationBar',
              'ly.img.exportArchive.navigationBar'
            ]
          });
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [cesdkContainer, closeEditor, sceneArchiveUrl]);

  return (
    <div
      className={classes.overlay}
      ref={overlayContainer}
      onClick={(event) => {
        if (
          overlayContainer.current &&
          overlayContainer.current === event.target
        ) {
          closeEditor();
        }
      }}
    >
      <div className={classes.modal}>
        <div ref={cesdkContainer} className={classes.cesdkContainer}></div>
      </div>
    </div>
  );
};

export default CreativeEditor;
