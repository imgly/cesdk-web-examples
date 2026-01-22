import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default asset sources for editing
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // Create a Scene
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });

    const pages = engine.block.findByType('page');
    const page = pages[0];

    // ========================================
    // Setup: Gradient Background with Title
    // ========================================
    // Create gradient background
    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.15, g: 0.1, b: 0.35, a: 1.0 }, stop: 0 },
      { color: { r: 0.4, g: 0.2, b: 0.5, a: 1.0 }, stop: 0.5 },
      { color: { r: 0.6, g: 0.3, b: 0.4, a: 1.0 }, stop: 1 }
    ]);
    engine.block.setFill(page, gradientFill);

    // Add centered title text
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    const titleText = engine.block.create('text');
    engine.block.replaceText(titleText, 'Configure your Editor');
    engine.block.setFloat(titleText, 'text/fontSize', 12);
    engine.block.setTextColor(titleText, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
    engine.block.setWidthMode(titleText, 'Auto');
    engine.block.setHeightMode(titleText, 'Auto');
    engine.block.appendChild(page, titleText);

    // Add IMG.LY subtext
    const subtitleText = engine.block.create('text');
    engine.block.replaceText(subtitleText, 'Powered by IMG.LY');
    engine.block.setFloat(subtitleText, 'text/fontSize', 6);
    engine.block.setTextColor(subtitleText, { r: 0.9, g: 0.9, b: 0.9, a: 0.8 });
    engine.block.setWidthMode(subtitleText, 'Auto');
    engine.block.setHeightMode(subtitleText, 'Auto');
    engine.block.appendChild(page, subtitleText);

    // Center both texts
    const titleWidth = engine.block.getFrameWidth(titleText);
    const titleHeight = engine.block.getFrameHeight(titleText);
    const subtitleWidth = engine.block.getFrameWidth(subtitleText);
    const subtitleHeight = engine.block.getFrameHeight(subtitleText);

    const spacing = 12;
    const totalHeight = titleHeight + spacing + subtitleHeight;
    const startY = (pageHeight - totalHeight) / 2;

    engine.block.setPositionX(titleText, (pageWidth - titleWidth) / 2);
    engine.block.setPositionY(titleText, startY);
    engine.block.setPositionX(subtitleText, (pageWidth - subtitleWidth) / 2);
    engine.block.setPositionY(subtitleText, startY + titleHeight + spacing);

    // ========================================
    // Runtime Configuration: Theme
    // ========================================
    cesdk.ui.setTheme('light');
    const currentTheme = cesdk.ui.getTheme();
    console.log('Current theme:', currentTheme);

    // ========================================
    // Runtime Configuration: Scale
    // ========================================
    cesdk.ui.setScale('modern');
    const currentScale = cesdk.ui.getScale();
    console.log('Current scale:', currentScale);

    // ========================================
    // Runtime Configuration: Actions
    // ========================================
    cesdk.actions.register('customSave', async () => {
      const sceneBlob = await engine.scene.saveToArchive();
      await cesdk.utils.downloadFile(sceneBlob, 'application/zip');
    });

    // ========================================
    // Built-in Actions
    // ========================================
    // Add built-in export and import actions to the navigation bar
    cesdk.ui.insertNavigationBarOrderComponent('last', {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar',
        'ly.img.exportScene.navigationBar',
        'ly.img.exportArchive.navigationBar',
        'ly.img.importScene.navigationBar',
        'ly.img.importArchive.navigationBar'
      ]
    });

    // ========================================
    // Engine Settings
    // ========================================
    engine.editor.setSetting('doubleClickToCropEnabled', true);
    engine.editor.setSetting('highlightColor', { r: 0, g: 0.5, b: 1, a: 1 });
    const cropEnabled = engine.editor.getSetting('doubleClickToCropEnabled');
    console.log('Double-click crop enabled:', cropEnabled);

    // ========================================
    // Internationalization: Locale
    // ========================================
    cesdk.i18n.setLocale('en');
    const currentLocale = cesdk.i18n.getLocale();
    console.log('Current locale:', currentLocale);

    // ========================================
    // Internationalization: Translations
    // ========================================
    cesdk.i18n.setTranslations({
      en: {
        'common.back': 'Go Back',
        'common.apply': 'Apply Changes'
      }
    });

    // Enable Auto-Fit Zoom
    engine.scene.zoomToBlock(page);
    engine.scene.enableZoomAutoFit(page, 'Horizontal', 40, 40);
  }
}

export default Example;
