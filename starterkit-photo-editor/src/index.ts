import CreativeEditorSDK from '@cesdk/cesdk-js';
import type { AssetDefinition, CreativeEngine } from '@cesdk/cesdk-js';

// Option 1: Use turnkey configuration from NPM (production-ready)
// import { PhotoEditorConfig } from '@cesdk/cesdk-js/configs/starterkits-photo-editor';
// Option 2: Import from local starter kit (for customization)
import { PhotoEditorConfig } from './imgly/plugin';

import { removeBackground } from '@imgly/background-removal';

// import {
//   BlurAssetSource,
//   EffectsAssetSource,
//   StickerAssetSource,
//   VectorPathAssetSource,
//   PagePresetsAssetSource,
//   CropPresetsAssetSource,
//   FiltersAssetSource
// } from '@cesdk/cesdk-js/plugins';

const config = {
  userId: 'starterkit-photo-editor-user',
  // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEditorSDK.version}/assets`,
  // Use local assets when developing with local packages
  ...(import.meta.env.CESDK_USE_LOCAL && {
    baseURL: '/assets/'
  })
};

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Expose cesdk for debugging
    (window as any).cesdk = cesdk;

    // Add the photo editor plugin
    await cesdk.addPlugin(new PhotoEditorConfig());

    // Setup the background removal
    setupAppsLibrary(cesdk);

    // Add asset source plugins
    // await cesdk.addPlugin(new BlurAssetSource());
    // await cesdk.addPlugin(new EffectsAssetSource());
    // await cesdk.addPlugin(new StickerAssetSource());
    // await cesdk.addPlugin(new VectorPathAssetSource());
    // await cesdk.addPlugin(new PagePresetsAssetSource());
    // await cesdk.addPlugin(new CropPresetsAssetSource());
    // await cesdk.addPlugin(new FiltersAssetSource());

    // Create or load a scene
    // await cesdk.createDesignScene();
    await cesdk.engine.scene.loadFromArchiveURL(
      'https://cdn.img.ly/assets/templates/starterkits/16-9-fashion-ad.zip'
    );
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });

/**
 * Sets up the Apps asset library with background removal
 */
function setupAppsLibrary(cesdk: CreativeEditorSDK): void {
  const engine = cesdk.engine;
  const sourceId = 'ly.img.apps';
  const baseUrl = '/assets';

  // Setup translations
  cesdk.i18n.setTranslations({
    en: {
      'libraries.ly.img.apps.label': 'Apps'
    }
  });

  // Check if source already exists
  const existingSources = engine.asset.findAllSources();
  const sourceExists = existingSources.includes(sourceId);

  if (!sourceExists) {
    // Add local source with apply function
    engine.asset.addLocalSource(sourceId, undefined, async (asset) => {
      if (asset.id === 'remove-bg') {
        await applyBackgroundRemoval(engine);
      }
      return undefined;
    });
  }

  // Define the remove background app asset
  const removeBackgroundAsset: AssetDefinition = {
    id: 'remove-bg',
    label: { en: 'Remove Background' },
    meta: {
      width: 80,
      height: 120,
      thumbUri: `${baseUrl}/remove-bg.png`
    }
  };

  // Add the asset to the source
  engine.asset.addAssetToSource(sourceId, removeBackgroundAsset);

  // Configure the asset library entry for apps
  cesdk.ui.addAssetLibraryEntry({
    id: 'ly.img.apps',
    sourceIds: ['ly.img.apps'],
    previewLength: 3,
    gridColumns: 3,
    gridItemHeight: 'auto',
    previewBackgroundType: 'contain',
    gridBackgroundType: 'cover',
    cardLabel: (assetResult) => assetResult.label,
    cardLabelPosition: () => 'below'
  });

  // Add apps button to dock at the end
  cesdk.ui.setDockOrder([
    ...cesdk.ui.getDockOrder(),
    {
      id: 'ly.img.assetLibrary.dock',
      key: 'ly.img.apps',
      icon: '@imgly/Apps',
      label: 'libraries.ly.img.apps.label',
      entries: ['ly.img.apps']
    }
  ]);
}

/**
 * Converts a URI to a Blob if it's a buffer:// URI, otherwise returns the URI
 * This matches the official plugin implementation
 */
async function convertUriToBlob(
  uri: string,
  engine: CreativeEngine
): Promise<string | Blob> {
  if (uri.startsWith('buffer://')) {
    const mimeType = await engine.editor.getMimeType(uri);
    const bufferLength = engine.editor.getBufferLength(uri);
    const bufferData = engine.editor.getBufferData(uri, 0, bufferLength);
    return new Blob([bufferData as BlobPart], { type: mimeType });
  }
  return uri;
}

/**
 * Applies background removal to the current page
 */
async function applyBackgroundRemoval(engine: CreativeEngine): Promise<void> {
  const page = engine.scene.getCurrentPage();
  if (!page) {
    console.error('No page found');
    return;
  }

  const fill = engine.block.getFill(page);
  if (!fill) {
    console.error('No fill found on page');
    return;
  }

  // Get image URI
  const sourceSet = engine.block.getSourceSet(fill, 'fill/image/sourceSet');
  const imageUri =
    sourceSet?.[0]?.uri ||
    engine.block.getString(fill, 'fill/image/imageFileURI');

  if (!imageUri) {
    console.error('No image URI found');
    return;
  }

  // Show loading state
  engine.block.setState(page, { type: 'Pending', progress: 0 });

  try {
    // Convert URI to blob if needed (matches official plugin implementation)
    const imageInput = await convertUriToBlob(imageUri, engine);

    // Remove background
    const removedBackgroundBlob = await removeBackground(imageInput);
    const newImageUri = URL.createObjectURL(removedBackgroundBlob);

    // Update image with new URI
    if (sourceSet && sourceSet.length > 0) {
      engine.block.setSourceSet(fill, 'fill/image/sourceSet', [
        { ...sourceSet[0], uri: newImageUri }
      ]);
    } else {
      engine.block.setString(fill, 'fill/image/imageFileURI', newImageUri);
    }

    // Set ready state and add undo step
    engine.block.setState(page, { type: 'Ready' });
    engine.editor.addUndoStep();
  } catch (error) {
    console.error('Failed to remove background:', error);
    engine.block.setState(page, { type: 'Ready' });
  }
}
