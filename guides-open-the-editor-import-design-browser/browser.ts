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
import { calculateGridLayout } from './utils';
import packageJson from './package.json';

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
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
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

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;

    // ===== Method 1: Load Scene from URL =====
    // URL to a saved CE.SDK scene file
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sceneUrl =
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene';

    // Load the scene from remote URL
    // await engine.scene.loadFromURL(sceneUrl);

    // The scene is now loaded and ready for editing
    // All blocks and properties from the saved scene are restored

    // ===== Method 2: Load Scene from String =====
    // Scene content as a string (from localStorage, database, or saveToString())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const savedSceneString = '{ /* scene JSON content */ }';

    // Load the scene from string content
    // await engine.scene.loadFromString(savedSceneString);

    // The scene is restored from the string representation
    // This is useful for offline storage or database persistence

    // ===== Method 3: Load from Archive URL =====
    // Archive URL from cloud storage, CDN, or user upload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const archiveUrl = 'https://example.com/designs/project-bundle.zip';

    // Load the archive using loadFromArchiveURL
    // await engine.scene.loadFromArchiveURL(archiveUrl);

    // Archives include all assets, making them portable across environments
    // No external asset URLs need to be accessible

    // ===== Method 4: Create Scene from Image =====
    // Create an editable scene from an existing image
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const imageUrl = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create a scene sized to the image dimensions
    // await engine.scene.createFromImage(imageUrl);

    // The image becomes the base content, ready for editing
    // You can now add text, shapes, effects, etc.

    // ===== Method 5: Create Scene from Video =====
    // Create a video editing scene from an existing video
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const videoUrl =
      'https://img.ly/static/ubq_samples/videos/pexels-drone-footage-of-a-surfer-by-ben-chewar-5368886_360p.mp4';

    // Create a scene configured for video mode
    // await engine.scene.createFromVideo(videoUrl);

    // The scene is set up with timeline controls for video editing

    // ===== Method 6: Modify Loaded Scene =====
    // Show that loaded scenes can be modified immediately
    // Find elements in the loaded scene
    // const textBlocks = engine.block.findByType('text');
    // if (textBlocks.length > 0) {
    //   engine.block.setString(textBlocks[0], 'text/text', 'Scene Imported & Modified');
    //   // Scene loads can be undone: engine.editor.undo();
    // }

    // Create a visual demonstration showing different import sources

    const demoPage = engine.block.findByType('page')[0];

    // Set page dimensions for proper grid layout
    engine.block.setWidth(demoPage, 1920);
    engine.block.setHeight(demoPage, 1080);

    const layout = calculateGridLayout(1920, 1080, 4, {
      spacing: 30,
      margin: 60
    });

    // Create demonstration blocks showing different sources
    const demoImage1 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      {
        ...layout.getPosition(0),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    const demoImage2 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      {
        ...layout.getPosition(1),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    const demoImage3 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        ...layout.getPosition(2),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    const demoImage4 = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      {
        ...layout.getPosition(3),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    // Add labels to each demonstration
    const labels = ['From URL', 'From String', 'From Archive', 'From Media'];

    [demoImage1, demoImage2, demoImage3, demoImage4].forEach((block, index) => {
      engine.block.appendChild(demoPage, block);

      // Add text label below each image
      const label = engine.block.create('text');
      const pos = layout.getPosition(index);
      engine.block.setString(label, 'text/text', labels[index]);
      engine.block.setWidth(label, layout.blockWidth);
      engine.block.setPositionX(label, pos.x);
      engine.block.setPositionY(label, pos.y + layout.blockHeight + 10);
      engine.block.setFloat(label, 'text/fontSize', 24);
      engine.block.setColor(label, 'fill/solid/color', {
        r: 0.2,
        g: 0.2,
        b: 0.2,
        a: 1.0
      });
      engine.block.appendChild(demoPage, label);
    });

    // Zoom to show the full grid
    await engine.scene.zoomToBlock(demoPage, {
      padding: 40
    });
  }
}

export default Example;
