'use client';

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import CreativeEditor from '@cesdk/cesdk-js/react';
import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TypefaceAssetSource,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

interface CreativeEditorWrapperProps {
  config?: Parameters<typeof CreativeEditor>[0]['config'];
  onReady?: (instance: CreativeEditorSDK) => void;
}

export default function CreativeEditorWrapper({
  config,
  onReady
}: CreativeEditorWrapperProps) {
  return (
    <CreativeEditor
      config={config || {}}
      init={async (cesdk) => {
        try {
          await cesdk.addPlugin(new BlurAssetSource());
          await cesdk.addPlugin(new CaptionPresetsAssetSource());
          await cesdk.addPlugin(new ColorPaletteAssetSource());
          await cesdk.addPlugin(new CropPresetsAssetSource());
          await cesdk.addPlugin(new EffectsAssetSource());
          await cesdk.addPlugin(new FiltersAssetSource());
          await cesdk.addPlugin(new PagePresetsAssetSource());
          await cesdk.addPlugin(new StickerAssetSource());
          await cesdk.addPlugin(new TextAssetSource());
          await cesdk.addPlugin(new TypefaceAssetSource());
          await cesdk.addPlugin(new VectorShapeAssetSource());
        } catch (error) {
          console.error('[CE.SDK] Failed to load default asset sources', {
            error,
            stack: error instanceof Error ? error.stack : undefined
          });

          // Show user-facing error message
          throw new Error(
            'Failed to load asset sources. Some features like stock images and templates may be unavailable. ' +
              'Please check your internet connection and try refreshing the page.'
          );
        }
        onReady?.(cesdk);
      }}
      onError={(error) => {
        console.error('[CE.SDK] Failed to initialize CreativeEditor SDK:', {
          error,
          stack: error instanceof Error ? error.stack : undefined,
          message: error instanceof Error ? error.message : 'Unknown error'
        });

        // The error will be shown by CE.SDK's built-in error handling
        // Additional custom error handling can be added here if needed
      }}
      width="100%"
      height="100%"
    />
  );
}
