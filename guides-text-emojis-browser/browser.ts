import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Emojis Guide
 *
 * Demonstrates emoji rendering configuration:
 * - Understanding the default emoji font (Noto Color Emoji)
 * - Getting and setting the emoji font URI
 * - Creating text blocks with emojis
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design'
    });
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];


    // CE.SDK uses Noto Color Emoji by default for consistent cross-platform rendering
    // Get the current emoji font URI
    const defaultEmojiFontUri = engine.editor.getSetting(
      'defaultEmojiFontFileUri'
    );
    console.log('Default emoji font URI:', defaultEmojiFontUri);

    // You can set a custom emoji font if needed
    // engine.editor.setSetting(
    //   'defaultEmojiFontFileUri',
    //   'https://your-cdn.com/fonts/CustomEmoji.ttf'
    // );

    // For this guide, we use the default Noto Color Emoji font
    // which is already configured in CE.SDK

    // Create a text block with emoji content
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);

    // Set text content with emojis
    engine.block.replaceText(textBlock, 'Hello World! 🎉🚀✨');

    // Configure text appearance
    engine.block.setTextFontSize(textBlock, 64);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');

    // Position the text block
    engine.block.setPositionX(textBlock, 50);
    engine.block.setPositionY(textBlock, 100);

    // Create additional text blocks demonstrating various emoji types

    // Single emoji characters
    const singleEmojis = engine.block.create('text');
    engine.block.appendChild(page, singleEmojis);
    engine.block.replaceText(singleEmojis, 'Single emojis: 😀 👍 ❤️ ⭐');
    engine.block.setTextFontSize(singleEmojis, 36);
    engine.block.setWidthMode(singleEmojis, 'Auto');
    engine.block.setHeightMode(singleEmojis, 'Auto');
    engine.block.setPositionX(singleEmojis, 50);
    engine.block.setPositionY(singleEmojis, 200);

    // Flag emojis (multi-character sequences)
    const flagEmojis = engine.block.create('text');
    engine.block.appendChild(page, flagEmojis);
    engine.block.replaceText(flagEmojis, 'Flags: 🇩🇪 🇺🇸 🇯🇵 🇬🇧');
    engine.block.setTextFontSize(flagEmojis, 36);
    engine.block.setWidthMode(flagEmojis, 'Auto');
    engine.block.setHeightMode(flagEmojis, 'Auto');
    engine.block.setPositionX(flagEmojis, 50);
    engine.block.setPositionY(flagEmojis, 270);

    // ZWJ (Zero Width Joiner) sequences
    const familyEmojis = engine.block.create('text');
    engine.block.appendChild(page, familyEmojis);
    engine.block.replaceText(familyEmojis, 'Families: 👨‍👩‍👧 👨‍👩‍👦‍👦 👩‍👦');
    engine.block.setTextFontSize(familyEmojis, 36);
    engine.block.setWidthMode(familyEmojis, 'Auto');
    engine.block.setHeightMode(familyEmojis, 'Auto');
    engine.block.setPositionX(familyEmojis, 50);
    engine.block.setPositionY(familyEmojis, 340);

    // Skin tone variants
    const skinToneEmojis = engine.block.create('text');
    engine.block.appendChild(page, skinToneEmojis);
    engine.block.replaceText(skinToneEmojis, 'Skin tones: 👋 👋🏻 👋🏽 👋🏿');
    engine.block.setTextFontSize(skinToneEmojis, 36);
    engine.block.setWidthMode(skinToneEmojis, 'Auto');
    engine.block.setHeightMode(skinToneEmojis, 'Auto');
    engine.block.setPositionX(skinToneEmojis, 50);
    engine.block.setPositionY(skinToneEmojis, 410);

    // Zoom to show all content
    engine.scene.zoomToBlock(page, { padding: 40 });

    // Select the main text block to show it in the inspector
    engine.block.setSelected(textBlock, true);
  }
}

export default Example;
