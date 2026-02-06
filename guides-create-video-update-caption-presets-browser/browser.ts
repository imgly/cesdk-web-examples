import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Update Caption Presets Guide
 *
 * Demonstrates creating custom caption presets in CE.SDK:
 * - Creating a styled text block as a preset base
 * - Applying neon glow styling with colors and drop shadow
 * - Serializing the block for use as a preset file
 * - Understanding the content.json structure for caption presets
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features for caption presets
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    // Load assets and create a video scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;

    // Create a text block to use as the preset base
    // Text blocks support all the styling properties needed for captions
    const textBlock = engine.block.create('text');

    // Set sample caption text
    engine.block.setString(textBlock, 'text/text', 'NEON GLOW');

    // Position and size the text block
    engine.block.setPositionX(textBlock, 50);
    engine.block.setPositionY(textBlock, 200);
    engine.block.setWidth(textBlock, 600);
    engine.block.setHeightMode(textBlock, 'Auto');

    // Style the text with a bright neon cyan color
    // This will be the fill/solid/color property in the preset
    engine.block.setColor(textBlock, 'fill/solid/color', {
      r: 0.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Set font properties for the caption style
    engine.block.setFloat(textBlock, 'text/fontSize', 48);

    // Use a bold font for better visibility
    // Load and set a typeface
    const typefaceResult = await engine.asset.findAssets('ly.img.typeface', {
      query: 'Roboto',
      page: 0,
      perPage: 10
    });

    if (typefaceResult.assets.length > 0) {
      const typefaceAsset = typefaceResult.assets[0];
      const typeface = typefaceAsset.payload?.typeface;
      if (typeface && typeface.fonts?.[0]?.uri) {
        engine.block.setFont(textBlock, typeface.fonts[0].uri, typeface);
      }
    }

    // Add a glowing drop shadow effect for the neon look
    // This creates the characteristic neon glow effect
    engine.block.setDropShadowEnabled(textBlock, true);

    // Set glow color (bright cyan to match text)
    engine.block.setColor(textBlock, 'dropShadow/color', {
      r: 0.0,
      g: 1.0,
      b: 1.0,
      a: 0.8
    });

    // Configure shadow properties for a soft glow
    engine.block.setFloat(textBlock, 'dropShadow/blurRadius/x', 20);
    engine.block.setFloat(textBlock, 'dropShadow/blurRadius/y', 20);
    engine.block.setFloat(textBlock, 'dropShadow/offset/x', 0);
    engine.block.setFloat(textBlock, 'dropShadow/offset/y', 0);

    // Optionally add a semi-transparent dark background
    // This helps the caption stand out against video content
    engine.block.setBackgroundColorEnabled(textBlock, true);
    engine.block.setColor(textBlock, 'backgroundColor/color', {
      r: 0.0,
      g: 0.0,
      b: 0.1,
      a: 0.7
    });

    // Add the styled text block to the page
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      engine.block.appendChild(pages[0], textBlock);
    }

    // Select the block and zoom to it so it's visible in the editor
    engine.block.select(textBlock);
    await engine.scene.zoomToBlock(textBlock, { padding: 40 });

    // Serialize the styled text block to create a preset file
    // This serialized string can be saved as a .blocks or .preset file
    // Include 'bundle' scheme to allow serialization of blocks with bundled fonts
    const serializedPreset = await engine.block.saveToString(
      [textBlock],
      ['buffer', 'http', 'https', 'bundle']
    );

    // eslint-disable-next-line no-console
    console.log('=== Serialized Preset ===');
    // eslint-disable-next-line no-console
    console.log('Save this as a .preset file (e.g., neon-glow.preset):');
    // eslint-disable-next-line no-console
    console.log(serializedPreset);

    // Example content.json entry for the custom preset
    // This shows the structure needed to add the preset to content.json
    const contentJsonEntry = {
      id: '//ly.img.captionPresets/neon-glow',
      label: {
        en: 'Neon Glow'
      },
      meta: {
        uri: '{{base_url}}/ly.img.captionPresets/presets/neon-glow.preset',
        thumbUri: '{{base_url}}/ly.img.captionPresets/thumbnails/neon-glow.png',
        mimeType: 'application/ubq-blocks-string'
      },
      payload: {
        properties: [
          {
            type: 'Color',
            property: 'fill/solid/color',
            value: { r: 0.0, g: 1.0, b: 1.0, a: 1.0 },
            defaultValue: { r: 0.0, g: 1.0, b: 1.0, a: 1.0 }
          },
          {
            type: 'Color',
            property: 'dropShadow/color',
            value: { r: 0.0, g: 1.0, b: 1.0, a: 0.8 },
            defaultValue: { r: 0.0, g: 1.0, b: 1.0, a: 0.8 }
          },
          {
            type: 'Color',
            property: 'backgroundColor/color',
            value: { r: 0.0, g: 0.0, b: 0.1, a: 0.7 },
            defaultValue: { r: 0.0, g: 0.0, b: 0.1, a: 0.7 }
          }
        ]
      }
    };

    // eslint-disable-next-line no-console
    console.log('\n=== content.json Entry ===');
    // eslint-disable-next-line no-console
    console.log('Add this entry to your content.json assets array:');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(contentJsonEntry, null, 2));

    // Example of a complete content.json file structure
    const completeContentJson = {
      version: '3.0.0',
      id: 'ly.img.captionPresets',
      assets: [contentJsonEntry]
    };

    // eslint-disable-next-line no-console
    console.log('\n=== Complete content.json Example ===');
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(completeContentJson, null, 2));

    // eslint-disable-next-line no-console
    console.log('\n=== Caption Preset Guide ===');
    // eslint-disable-next-line no-console
    console.log(
      'The styled text block above demonstrates a "Neon Glow" caption preset.'
    );
    // eslint-disable-next-line no-console
    console.log('To use this preset:');
    // eslint-disable-next-line no-console
    console.log('1. Save the serialized preset string as a .preset file');
    // eslint-disable-next-line no-console
    console.log('2. Create a thumbnail image showing the preset appearance');
    // eslint-disable-next-line no-console
    console.log('3. Add the content.json entry to your assets folder');
    // eslint-disable-next-line no-console
    console.log('4. Configure CE.SDK baseURL to point to your assets location');
  }
}

export default Example;
