import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
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
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { DesignEditorConfig } from '../lib/design-editor/plugin';
import { VideoEditorConfig } from '../lib/video-editor/plugin';

import { useEffect, useRef } from 'react';
import classes from './CESDKModal.module.css';
import { addPremiumTemplatesAssetSource } from '../lib/PremiumTemplateUtilities';

export const CESDKModal = ({ config, configure, type }) => {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  useEffect(() => {
    if (containerRef.current && !instanceRef.current) {
      CreativeEditorSDK.create(containerRef.current, config).then(
        async (cesdk) => {
          const isDesign = type === 'image';

          // Add the appropriate editor configuration plugin first
          if (isDesign) {
            await cesdk.addPlugin(new DesignEditorConfig());
          } else {
            await cesdk.addPlugin(new VideoEditorConfig());
          }

          // Asset Source Plugins (replaces addDefaultAssetSources)
          await cesdk.addPlugin(new ColorPaletteAssetSource());
          await cesdk.addPlugin(new TypefaceAssetSource());
          await cesdk.addPlugin(new TextAssetSource());
          await cesdk.addPlugin(new TextComponentAssetSource());
          await cesdk.addPlugin(new VectorShapeAssetSource());
          await cesdk.addPlugin(new StickerAssetSource());
          await cesdk.addPlugin(new EffectsAssetSource());
          await cesdk.addPlugin(new FiltersAssetSource());
          await cesdk.addPlugin(new BlurAssetSource());
          await cesdk.addPlugin(new PagePresetsAssetSource());
          await cesdk.addPlugin(new CaptionPresetsAssetSource());
          await cesdk.addPlugin(new CropPresetsAssetSource());
          await cesdk.addPlugin(
            new UploadAssetSources({
              include: isDesign
                ? ['ly.img.image.upload']
                : [
                    'ly.img.image.upload',
                    'ly.img.video.upload',
                    'ly.img.audio.upload'
                  ]
            })
          );

          // Demo assets (replaces addDemoAssetSources)
          await cesdk.addPlugin(
            new DemoAssetSources({
              include: isDesign
                ? ['ly.img.image.*']
                : [
                    'ly.img.templates.video.*',
                    'ly.img.image.*',
                    'ly.img.video.*',
                    'ly.img.audio.*'
                  ]
            })
          );

          if (isDesign) {
            addPremiumTemplatesAssetSource(cesdk);
          }
          if (configure) {
            await configure(cesdk);
          }
          instanceRef.current = cesdk;
          // change the position of the close button to the left
          const closeComponentId = 'ly.img.close.navigationBar';
          const navBarOrder = cesdk.ui.getNavigationBarOrder();
          let trimmedNavBarOrder = navBarOrder.filter(
            (item) => item.id !== closeComponentId
          );
          cesdk.ui.setNavigationBarOrder(
            [{ id: closeComponentId }].concat(trimmedNavBarOrder)
          );
        }
      );
      return () => {
        if (instanceRef.current) {
          instanceRef.current.dispose();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, containerRef]);

  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        <div ref={containerRef} className={classes.cesdkContainer}></div>
      </div>
    </div>
  );
};

export default CESDKModal;
