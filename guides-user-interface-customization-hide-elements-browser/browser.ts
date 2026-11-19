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

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // ===== Hide Elements Examples =====
    // Configure UI visibility before loading assets and creating scene
    // Show only navigation bar and inspector bar, hide everything else

    // Hide canvas bar and canvas menu with cesdk.features
    cesdk.features.configure({
      'ly.img.canvas.bar': { enabled: false },
      'ly.img.canvas.menu': { enabled: false }
    });

    // Hide the entire dock with cesdk.features
    cesdk.features.configure({ 'ly.img.dock': { enabled: false } });

    // Hide UI elements using ordering APIs (alternative method)
    // Setting empty array removes all components
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, []);
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.bar', at: 'top' }, []);
    cesdk.ui.setComponentOrder({ in: 'ly.img.canvas.menu' }, []);

    // Close all panels using wildcard pattern
    cesdk.ui.closePanel('//ly.img.panel/*');

    // Check if panels are open
    const inspectorPanelId = '//ly.img.panel/inspector';
    const isInspectorOpen = cesdk.ui.isPanelOpen(inspectorPanelId);
    console.log('Inspector panel open:', isInspectorOpen);

    // Find all panels
    const allPanels = cesdk.ui.findAllPanels();
    console.log('All panels:', allPanels);

    // List every feature with its options and settings
    const features = cesdk.features.list();
    console.log(
      'Features:',
      features.map((feature) => feature.id)
    );

    // Name the features to switch off together
    // cesdk.features.configure({
    //   'ly.img.dock': { enabled: false },
    //   'ly.img.navigation.bar': { enabled: false }
    // });

    // Check if features are switched on
    const isDockEnabled = cesdk.features.get('ly.img.dock').enabled;
    const isNavBarEnabled = cesdk.features.get('ly.img.navigation.bar').enabled;
    console.log('Dock enabled:', isDockEnabled);
    console.log('Navigation bar enabled:', isNavBarEnabled);

    // Hide notification toasts
    cesdk.features.configure({ 'ly.img.notifications': { enabled: false } });
    // Or hide specific notification types:
    // cesdk.features.configure({
    //   'ly.img.notifications': { undo: false, redo: false }
    // });

    // ===== Load Assets and Create Scene =====
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

    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Add a single image to the canvas
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';
    const imageBlock = await engine.block.addImage(imageUri);
    engine.block.appendChild(page, imageBlock);

    // Center and fit the image on the page
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const imageWidth = engine.block.getWidth(imageBlock);
    const imageHeight = engine.block.getHeight(imageBlock);

    // Calculate scale to fit image within page
    const scaleX = pageWidth / imageWidth;
    const scaleY = pageHeight / imageHeight;
    const scale = Math.min(scaleX, scaleY) * 0.8; // 80% of page size

    // Apply scale and center
    engine.block.setWidth(imageBlock, imageWidth * scale);
    engine.block.setHeight(imageBlock, imageHeight * scale);

    const scaledWidth = engine.block.getWidth(imageBlock);
    const scaledHeight = engine.block.getHeight(imageBlock);
    engine.block.setPositionX(imageBlock, (pageWidth - scaledWidth) / 2);
    engine.block.setPositionY(imageBlock, (pageHeight - scaledHeight) / 2);

    // Select the image to show the inspector
    engine.block.setSelected(imageBlock, true);

    console.log('Hide elements example loaded successfully!');
  }
}

export default Example;
