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

const GREEN_OLIVE_THEME_CSS = `
.ubq-public[data-ubq-theme='light'][data-ubq-scale='normal'] {
  --ubq-canvas: hsl(95, 25%, 88%) !important;
  --ubq-elevation-1: hsl(92, 22%, 83%) !important;
  --ubq-elevation-2: hsl(88, 20%, 78%) !important;
  --ubq-elevation-3: hsl(85, 18%, 73%) !important;
  --ubq-interactive-default: hsl(88, 20%, 82%) !important;
  --ubq-interactive-hover: hsl(88, 24%, 75%) !important;
  --ubq-interactive-pressed: hsl(88, 28%, 68%) !important;
  --ubq-interactive-accent-default: hsl(135, 45%, 48%) !important;
  --ubq-interactive-accent-hover: hsl(135, 50%, 43%) !important;
  --ubq-interactive-accent-pressed: hsl(135, 55%, 38%) !important;
}
`;

/**
 * CE.SDK Plugin: Theming Guide
 *
 * This example demonstrates:
 * - Setting theme (light, dark, system)
 * - Setting scale (normal, large, modern)
 * - Dynamic scale with callback
 * - Custom theme via CSS custom properties
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Set the theme to light, dark, or system
    // 'system' automatically follows the user's OS theme preference
    cesdk.ui.setTheme('light');

    // Set a fixed scale: 'normal', 'large', or 'modern' (default)
    // - normal: Standard UI scaling for desktop
    // - large: Increased sizes for accessibility and touch devices
    // - modern: Modern theme with refined visual design
    cesdk.ui.setScale('normal');

    // Apply custom green/olive theme after CE.SDK initialization
    const style = document.createElement('style');
    style.textContent = GREEN_OLIVE_THEME_CSS;
    document.head.appendChild(style);

    // Force theme refresh to pick up custom colors
    cesdk.ui.setTheme('dark');
    await new Promise((resolve) => setTimeout(resolve, 100));
    cesdk.ui.setTheme('light');

    // Or use a dynamic scale based on viewport and device
    cesdk.ui.setScale(({ containerWidth, isTouch }) => {
      // Use large scale for small screens or touch devices
      if ((containerWidth && containerWidth < 600) || isTouch) {
        return 'large';
      }
      // Use normal scale for larger screens
      return 'normal';
    });

    // Get the current active theme
    const currentTheme = cesdk.ui.getTheme(); // Returns 'light' or 'dark'
    // eslint-disable-next-line no-console
    console.log('Current theme:', currentTheme);

    // Get the current scale setting
    const currentScale = cesdk.ui.getScale(); // Returns scale or callback function
    // eslint-disable-next-line no-console
    console.log('Current scale:', currentScale);

    // Create a design scene    await cesdk.addPlugin(new DesignEditorConfig());

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
      page: { width: 800, height: 600, unit: 'Pixel' }
    });
    const engine = cesdk.engine;

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Add a visual element to demonstrate the theme
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Add an image to show theme effects
    const imageBlock = await engine.block.addImage(imageUri, {
      x: 100,
      y: 100,
      size: { width: 600, height: 400 }
    });

    engine.block.appendChild(page, imageBlock);

    // Note: The custom theme defined in custom-theme.css will automatically apply
    // when the theme/scale combination matches the CSS selectors
    // Example: .ubq-public[data-ubq-theme='dark'][data-ubq-scale='normal']
  }
}

export default Example;
