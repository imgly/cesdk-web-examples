import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
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
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';


class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // DesignEditorConfig uses settings not yet in the published package when this guide
    // was authored. Guarded so the text block renders in both local and published contexts.
    try {
      await cesdk.addPlugin(new DesignEditorConfig());
    } catch {
      // noop — proceeds with asset sources and the enumeration example below
    }
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    // Create a new design scene with an 800×600 canvas
    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Create a text block and populate it with three paragraphs
    const textBlock = engine.block.create('text');
    engine.block.appendChild(page, textBlock);
    engine.block.replaceText(textBlock, 'First item\nSecond item\nThird item');
    engine.block.setTextFontSize(textBlock, 36);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setPositionX(textBlock, 80);
    engine.block.setPositionY(textBlock, 80);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const block = engine.block as any;

    // Apply ordered list style to all paragraphs (paragraphIndex defaults to -1 = all)
    block.setTextListStyle(textBlock, 'Ordered');

    // Override the third paragraph (index 2) to unordered
    block.setTextListStyle(textBlock, 'Unordered', 2);

    // Set the second paragraph (index 1) to nesting level 1 (one indent deep)
    block.setTextListLevel(textBlock, 1, 1);

    // Read back the nesting level to confirm
    const level = block.getTextListLevel(textBlock, 1);
    console.log('Second paragraph nesting level:', level); // 1

    // Atomically set both list style and nesting level in one call
    // Sets paragraph 0 to ordered style at nesting level 0 (outermost)
    block.setTextListStyle(textBlock, 'Ordered', 0, 0);

    // Get all paragraph indices in the text block
    const allIndices: number[] = block.getTextParagraphIndices(textBlock);
    console.log('All paragraph indices:', allIndices); // [0, 1, 2]

    // Get indices overlapping a specific grapheme range
    const rangeIndices = block.getTextParagraphIndices(textBlock, 0, 10);
    console.log('Indices for range [0, 10):', rangeIndices); // [0]

    // Read back the list style and nesting level for each paragraph
    const styles = allIndices.map((i) => block.getTextListStyle(textBlock, i));
    const levels = allIndices.map((i) => block.getTextListLevel(textBlock, i));
    console.log('Paragraph styles:', styles); // ['Ordered', 'Ordered', 'Unordered']
    console.log('Paragraph levels:', levels); // [0, 1, 0]

    engine.scene.zoomToBlock(textBlock, { padding: 40 });
    engine.block.setSelected(textBlock, true);
  }
}


export default Example;
