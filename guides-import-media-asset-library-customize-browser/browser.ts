import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // ===== Section 1: Localizing Entry Labels =====
    // Provide translations for custom entries before creating them
    // Labels appear at different navigation levels:
    // - Entry label: shown in dock and as panel header (sources overview)
    // - Source label: shown as section header and when navigating into a source
    // - Group label: shown when a source contains grouped assets
    cesdk.i18n.setTranslations({
      en: {
        // Entry-level labels (sources overview)
        'libraries.my-custom-assets.label': 'My Assets (Entry Level)',
        'libraries.my-replace-assets.label': 'Replace Options',
        // Source-level labels within entry (overrides default source labels)
        'libraries.my-custom-assets.ly.img.image.label': 'Images (Source Level)',
        'libraries.my-custom-assets.ly.img.sticker.label': 'Stickers (Source Level)',
        // Group-level labels within sticker source (all 8 sticker categories)
        // Format: libraries.<entry>.<source>.<group-id>.label
        'libraries.my-custom-assets.ly.img.sticker.//ly.img.cesdk.stickers.doodle/category/doodle.label':
          'Doodle (Group Level)',
        'libraries.my-custom-assets.ly.img.sticker.//ly.img.cesdk.stickers.emoji/category/emoji.label':
          'Emoji (Group Level)',
        'libraries.my-custom-assets.ly.img.sticker.//ly.img.cesdk.stickers.emoticons/category/emoticons.label':
          'Emoticons (Group Level)',
        'libraries.my-custom-assets.ly.img.sticker.//ly.img.cesdk.stickers.hand/category/hand.label':
          'Hands (Group Level)',
        'libraries.my-custom-assets.ly.img.sticker.//ly.img.cesdk.stickers.sketches/category/sketches.label':
          'Sketches (Group Level)',
        'libraries.my-custom-assets.ly.img.sticker.//ly.img.cesdk.stickers.3Dstickers/category/3Dstickers.label':
          '3D Grain (Group Level)',
        'libraries.my-custom-assets.ly.img.sticker.//ly.img.cesdk.stickers.craft/category/craft.label':
          'Craft (Group Level)',
        'libraries.my-custom-assets.ly.img.sticker.//ly.img.cesdk.stickers.marker/category/marker.label':
          'Markers (Group Level)'
      }
    });

    // ===== Section 2: Creating Custom Entries with Theme-Aware Icons =====
    // Create a custom asset library entry with theme-aware icons
    // Use existing demo sources (ly.img.image, ly.img.sticker) to populate the entry
    cesdk.ui.addAssetLibraryEntry({
      id: 'my-custom-assets',
      sourceIds: ['ly.img.image', 'ly.img.sticker'],
      // Preview settings control the overview showing all sources
      previewLength: 4,
      previewBackgroundType: 'contain',
      // Grid settings control the detailed view when navigating into a source
      // Using 2 columns creates a distinct layout from the preview row
      gridColumns: 2,
      gridItemHeight: 'square',
      gridBackgroundType: 'cover',
      // Theme-aware icon function receives theme and iconSize parameters
      icon: ({ theme, iconSize }) => {
        if (theme === 'dark') {
          return iconSize === 'large'
            ? 'https://img.ly/static/cesdk/guides/icon-large-dark.svg'
            : 'https://img.ly/static/cesdk/guides/icon-normal-dark.svg';
        }
        return iconSize === 'large'
          ? 'https://img.ly/static/cesdk/guides/icon-large-light.svg'
          : 'https://img.ly/static/cesdk/guides/icon-normal-light.svg';
      }
    });

    // ===== Section 3: Creating Entry for Replace Operations =====
    // Create a separate entry for replace operations
    cesdk.ui.addAssetLibraryEntry({
      id: 'my-replace-assets',
      sourceIds: ['ly.img.image'],
      previewLength: 3,
      gridColumns: 2,
      gridItemHeight: 'square',
      previewBackgroundType: 'contain',
      gridBackgroundType: 'contain'
    });

    // ===== Section 4: Modifying Default Entries =====
    // Update the default images entry with different grid columns
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      gridColumns: 4
    });

    // ===== Section 5: Extending Source IDs =====
    // Use a callback pattern with currentIds to extend sourceIds
    cesdk.ui.updateAssetLibraryEntry('ly.img.image', {
      sourceIds: ({ currentIds }) => [...currentIds, 'ly.img.upload']
    });

    // ===== Section 6: Configuring Replace Entries =====
    // Configure which entries appear for replace operations based on block type
    cesdk.ui.setReplaceAssetLibraryEntries(
      ({ selectedBlocks, defaultEntryIds }) => {
        // Only show replace options when exactly one block is selected
        if (selectedBlocks.length !== 1) {
          return [];
        }

        const { fillType } = selectedBlocks[0];

        // Show custom replace entry for image fills
        if (fillType === '//ly.img.ubq/fill/image') {
          return [...defaultEntryIds, 'my-replace-assets'];
        }

        // Return empty array to hide replace button for other fill types
        return [];
      }
    );

    // ===== Section 7: Adding Entries to the Dock =====
    // Add custom entry to the top of the dock with a separator
    cesdk.ui.setDockOrder([
      {
        id: 'ly.img.assetLibrary.dock',
        key: 'my-custom-assets',
        // Dock icons use a static URL string
        icon: 'https://img.ly/static/cesdk/guides/icon-normal-light.svg',
        label: 'libraries.my-custom-assets.label',
        entries: ['my-custom-assets']
      },
      { id: 'ly.img.separator' },
      ...cesdk.ui.getDockOrder()
    ]);

    // Create a design scene to display the editor
    await cesdk.createDesignScene();

    // Add explanatory text to the canvas
    const page = engine.scene.getCurrentPage();
    if (page) {
      // Get page dimensions to constrain text within boundaries
      const pageWidth = engine.block.getWidth(page);
      const margin = 20;
      const textWidth = pageWidth - margin * 2;

      // Title text
      const titleBlock = engine.block.create('text');
      engine.block.replaceText(titleBlock, 'Customize Asset Library');
      engine.block.setFloat(titleBlock, 'text/fontSize', 28);
      engine.block.setWidth(titleBlock, textWidth);
      engine.block.setHeightMode(titleBlock, 'Auto');
      engine.block.setPositionX(titleBlock, margin);
      engine.block.setPositionY(titleBlock, margin);
      engine.block.appendChild(page, titleBlock);

      // Instructions text
      const instructionsBlock = engine.block.create('text');
      engine.block.replaceText(
        instructionsBlock,
        '← Click "My Assets (Entry Level)" in the dock.\n\n' +
          'Labels show navigation hierarchy:\n' +
          'Entry → Source → Group Level'
      );
      engine.block.setFloat(instructionsBlock, 'text/fontSize', 13);
      engine.block.setWidth(instructionsBlock, textWidth);
      engine.block.setHeightMode(instructionsBlock, 'Auto');
      engine.block.setPositionX(instructionsBlock, margin);
      engine.block.setPositionY(instructionsBlock, 55);
      engine.block.appendChild(page, instructionsBlock);
    }

    // Open the asset library panel to show the custom entry
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: ['my-custom-assets'] }
    });
  }
}

export default Example;
