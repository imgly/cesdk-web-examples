import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  ImageColorsAssetSource,
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

const IMAGE_URL = 'https://img.ly/static/ubq_samples/sample_1.jpg';
const SCENE_URL =
  'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
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

    const engine = cesdk.engine;

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });
    const page = engine.block.findByType('page')[0];

    // An image fill instead of addImage(), because addImage() waits for the download.
    // An export with nothing to wait for ends inside its call, before the abort.
    const imageBlock = engine.block.create('graphic');
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));
    const imageFill = engine.block.createFill('image');
    engine.block.setString(imageFill, 'fill/image/imageFileURI', IMAGE_URL);
    engine.block.setFill(imageBlock, imageFill);
    engine.block.setWidth(imageBlock, 800);
    engine.block.setHeight(imageBlock, 600);
    engine.block.appendChild(page, imageBlock);

    const controller = new AbortController();
    const exporting = engine.block.export(page, {
      mimeType: 'image/png',
      abortSignal: controller.signal
    });
    controller.abort();

    try {
      await exporting;
      console.log('The export ended before the abort');
    } catch (error) {
      // Logs "AbortSignal received"
      console.log('The export stopped:', (error as Error).message);
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    console.log(`The next export made a PNG file of ${blob.size} bytes`);

    const deadline = AbortSignal.timeout(10_000);
    try {
      await engine.scene.load(SCENE_URL, { abortSignal: deadline });
      console.log('The scene loaded in time');
    } catch (error) {
      if (!deadline.aborted) {
        throw error;
      }
      console.log('The scene did not load within 10 seconds');
    }

    await cesdk.actions.run('zoom.toPage', { autoFit: true });
  }
}

export default Example;
