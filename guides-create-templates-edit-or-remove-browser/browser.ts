import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Edit or Remove Templates Guide
 *
 * Demonstrates template management workflows:
 * - Adding templates to local asset sources with thumbnails
 * - Editing template content and updating in asset sources
 * - Removing templates from asset sources
 * - Saving updated templates with new content
 */

// Helper function to generate SVG thumbnail with text label
function generateThumbnail(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
    <rect width="200" height="150" fill="#f5f5f5"/>
    <text x="100" y="75" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14" fill="#333">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and create a scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();
    const engine = cesdk.engine;

    const page = engine.block.findByType('page')[0];
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Create a local asset source for managing templates
    engine.asset.addLocalSource('my-templates', undefined, async (asset) => {
      const uri = asset.meta?.uri;
      if (!uri) return undefined;
      const base64Content = uri.split(',')[1];
      if (!base64Content) return undefined;
      await engine.scene.loadFromString(base64Content);
      return engine.scene.get() ?? undefined;
    });

    // Add the template source to the dock as an asset library entry
    cesdk.ui.addAssetLibraryEntry({
      id: 'my-templates-entry',
      sourceIds: ['my-templates'],
      title: 'My Templates',
      icon: '@imgly/Template',
      gridColumns: 2,
      gridItemHeight: 'square'
    });

    // Add a spacer to push "My Templates" to the bottom of the dock
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'ly.img.spacer',
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'my-templates',
        icon: '@imgly/Template',
        label: 'My Templates',
        entries: ['my-templates-entry']
      }
    ]);

    // Create the template with text blocks
    const titleBlock = engine.block.create('text');
    engine.block.replaceText(titleBlock, 'Original Template');
    engine.block.setFloat(titleBlock, 'text/fontSize', 64);
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);

    const subtitleBlock = engine.block.create('text');
    engine.block.replaceText(
      subtitleBlock,
      'Browse "My Templates" at the bottom of the dock'
    );
    engine.block.setFloat(subtitleBlock, 'text/fontSize', 42);
    engine.block.setWidthMode(subtitleBlock, 'Auto');
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.appendChild(page, subtitleBlock);

    // Position text blocks centered on the page
    const titleWidth = engine.block.getFrameWidth(titleBlock);
    const titleHeight = engine.block.getFrameHeight(titleBlock);
    engine.block.setPositionX(titleBlock, (pageWidth - titleWidth) / 2);
    engine.block.setPositionY(titleBlock, pageHeight / 2 - titleHeight - 20);

    const subtitleWidth = engine.block.getFrameWidth(subtitleBlock);
    engine.block.setPositionX(subtitleBlock, (pageWidth - subtitleWidth) / 2);
    engine.block.setPositionY(subtitleBlock, pageHeight / 2 + 20);

    // Save template content and add to asset source
    const originalContent = await engine.scene.saveToString();
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-original',
      label: { en: 'Original Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${originalContent}`,
        thumbUri: generateThumbnail('Original Template')
      }
    });

    // eslint-disable-next-line no-console
    console.log('Original template added to asset source');

    // Edit the template content and save as a new version
    engine.block.replaceText(titleBlock, 'Updated Template');
    engine.block.replaceText(
      subtitleBlock,
      'This template was edited and saved'
    );

    const updatedContent = await engine.scene.saveToString();
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-updated',
      label: { en: 'Updated Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${updatedContent}`,
        thumbUri: generateThumbnail('Updated Template')
      }
    });

    // Re-center after modification
    const newTitleWidth = engine.block.getFrameWidth(titleBlock);
    const newTitleHeight = engine.block.getFrameHeight(titleBlock);
    engine.block.setPositionX(titleBlock, (pageWidth - newTitleWidth) / 2);
    engine.block.setPositionY(titleBlock, pageHeight / 2 - newTitleHeight - 20);

    const newSubtitleWidth = engine.block.getFrameWidth(subtitleBlock);
    engine.block.setPositionX(
      subtitleBlock,
      (pageWidth - newSubtitleWidth) / 2
    );

    // eslint-disable-next-line no-console
    console.log('Updated template added to asset source');

    // Add a temporary template to demonstrate removal
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-temporary',
      label: { en: 'Temporary Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${originalContent}`,
        thumbUri: generateThumbnail('Temporary Template')
      }
    });

    // Remove the temporary template from the asset source
    engine.asset.removeAssetFromSource('my-templates', 'template-temporary');

    // eslint-disable-next-line no-console
    console.log('Temporary template removed from asset source');

    // Update an existing template by removing and re-adding with same ID
    engine.block.replaceText(subtitleBlock, 'Updated again with new content');
    const reUpdatedContent = await engine.scene.saveToString();

    engine.asset.removeAssetFromSource('my-templates', 'template-updated');
    engine.asset.addAssetToSource('my-templates', {
      id: 'template-updated',
      label: { en: 'Updated Template' },
      meta: {
        uri: `data:application/octet-stream;base64,${reUpdatedContent}`,
        thumbUri: generateThumbnail('Updated Template')
      }
    });

    // Notify that the asset source contents have changed
    engine.asset.assetSourceContentsChanged('my-templates');

    // Re-center subtitle after final update
    const reUpdatedSubtitleWidth = engine.block.getFrameWidth(subtitleBlock);
    engine.block.setPositionX(
      subtitleBlock,
      (pageWidth - reUpdatedSubtitleWidth) / 2
    );

    // eslint-disable-next-line no-console
    console.log('Template updated in asset source');

    // Apply the original template to show the starting point
    await engine.scene.loadFromString(originalContent);
    // eslint-disable-next-line no-console
    console.log(
      'Original template applied - browse "My Templates" in the dock'
    );
  }
}

export default Example;
