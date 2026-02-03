import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Create Templates From Scratch Guide
 *
 * Demonstrates building a reusable promotional card template entirely in code:
 * - Creating a blank scene with print-ready dimensions (1200x1600)
 * - Adding text blocks with variable tokens and proper font styling
 * - Adding graphic blocks as image placeholders using addImage()
 * - Configuring placeholder behavior for swappable media
 * - Applying editing constraints (scopes) to protect layout integrity
 * - Saving the template in multiple formats
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
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    const engine = cesdk.engine;

    // Template layout constants for a promotional card
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 1000;
    const PADDING = 40;
    const CONTENT_WIDTH = CANVAS_WIDTH - PADDING * 2;

    // Create a blank scene with custom dimensions
    engine.scene.create('Free', {
      page: { size: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } }
    });

    // Set design unit to Pixel for precise coordinate mapping
    engine.scene.setDesignUnit('Pixel');

    // Get the page that was automatically created
    const page = engine.block.findByType('page')[0];

    // Set a gradient background for the template
    const backgroundFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(backgroundFill, 'fill/gradient/colors', [
      { color: { r: 0.4, g: 0.2, b: 0.6, a: 1.0 }, stop: 0 }, // Purple
      { color: { r: 0.2, g: 0.4, b: 0.8, a: 1.0 }, stop: 1 } // Blue
    ]);
    engine.block.setFill(page, backgroundFill);

    // Font URIs for consistent typography
    const FONT_BOLD =
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Bold.ttf';
    const FONT_REGULAR =
      'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/extensions/ly.img.cesdk.fonts/fonts/Roboto/Roboto-Regular.ttf';

    // Create headline text block with {{title}} variable
    const headline = engine.block.create('text');
    engine.block.replaceText(headline, '{{title}}');

    // Set font with proper typeface for consistent rendering
    engine.block.setFont(headline, FONT_BOLD, {
      name: 'Roboto',
      fonts: [{ uri: FONT_BOLD, subFamily: 'Bold', weight: 'bold' }]
    });
    engine.block.setFloat(headline, 'text/fontSize', 28);
    engine.block.setTextColor(headline, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });

    // Position and size the headline
    engine.block.setWidthMode(headline, 'Absolute');
    engine.block.setHeightMode(headline, 'Auto');
    engine.block.setWidth(headline, CONTENT_WIDTH);
    engine.block.setPositionX(headline, PADDING);
    engine.block.setPositionY(headline, 50);
    engine.block.setEnum(headline, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, headline);

    // Set default value for the title variable
    engine.variable.setString('title', 'Summer Sale');

    // Create subheadline text block with {{subtitle}} variable
    const subheadline = engine.block.create('text');
    engine.block.replaceText(subheadline, '{{subtitle}}');

    engine.block.setFont(subheadline, FONT_REGULAR, {
      name: 'Roboto',
      fonts: [{ uri: FONT_REGULAR, subFamily: 'Regular', weight: 'normal' }]
    });
    engine.block.setFloat(subheadline, 'text/fontSize', 14);
    engine.block.setTextColor(subheadline, { r: 0.9, g: 0.9, b: 0.95, a: 1.0 });

    engine.block.setWidthMode(subheadline, 'Absolute');
    engine.block.setHeightMode(subheadline, 'Auto');
    engine.block.setWidth(subheadline, CONTENT_WIDTH);
    engine.block.setPositionX(subheadline, PADDING);
    engine.block.setPositionY(subheadline, 175);
    engine.block.setEnum(subheadline, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, subheadline);

    engine.variable.setString('subtitle', 'Up to 50% off all items');

    // Create image placeholder in the center of the card
    const imageBlock = engine.block.create('graphic');
    const imageShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, imageShape);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    engine.block.setWidth(imageBlock, CONTENT_WIDTH);
    engine.block.setHeight(imageBlock, 420);
    engine.block.setPositionX(imageBlock, PADDING);
    engine.block.setPositionY(imageBlock, 295);
    engine.block.appendChild(page, imageBlock);

    // Enable placeholder behavior on the image fill
    const fill = engine.block.getFill(imageBlock);
    if (fill !== null && engine.block.supportsPlaceholderBehavior(fill)) {
      engine.block.setPlaceholderBehaviorEnabled(fill, true);
    }
    engine.block.setPlaceholderEnabled(imageBlock, true);

    // Enable visual controls for the placeholder
    engine.block.setPlaceholderControlsOverlayEnabled(imageBlock, true);
    engine.block.setPlaceholderControlsButtonEnabled(imageBlock, true);

    // Create CTA (call-to-action) text block with {{cta}} variable
    const cta = engine.block.create('text');
    engine.block.replaceText(cta, '{{cta}}');

    engine.block.setFont(cta, FONT_BOLD, {
      name: 'Roboto',
      fonts: [{ uri: FONT_BOLD, subFamily: 'Bold', weight: 'bold' }]
    });
    engine.block.setFloat(cta, 'text/fontSize', 8.4);
    engine.block.setTextColor(cta, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });

    engine.block.setWidthMode(cta, 'Absolute');
    engine.block.setHeightMode(cta, 'Auto');
    engine.block.setWidth(cta, CONTENT_WIDTH);
    engine.block.setPositionX(cta, PADDING);
    engine.block.setPositionY(cta, 765);
    engine.block.setEnum(cta, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, cta);

    engine.variable.setString('cta', 'Learn More');

    // Set global scope to 'Defer' for per-block control
    engine.editor.setGlobalScope('layer/move', 'Defer');
    engine.editor.setGlobalScope('layer/resize', 'Defer');

    // Lock all text block positions but allow text editing
    const textBlocks = [headline, subheadline, cta];
    textBlocks.forEach((block) => {
      engine.block.setScopeEnabled(block, 'layer/move', false);
      engine.block.setScopeEnabled(block, 'layer/resize', false);
    });

    // Lock image position but allow fill replacement
    engine.block.setScopeEnabled(imageBlock, 'layer/move', false);
    engine.block.setScopeEnabled(imageBlock, 'layer/resize', false);
    engine.block.setScopeEnabled(imageBlock, 'fill/change', true);

    // Register role toggle component for switching between Creator and Adopter
    cesdk.ui.registerComponent('role.toggle', ({ builder }) => {
      const role = engine.editor.getRole();
      builder.ButtonGroup('role-toggle', {
        children: () => {
          builder.Button('creator-btn', {
            label: 'Creator',
            isActive: role === 'Creator',
            onClick: () => engine.editor.setRole('Creator')
          });
          builder.Button('adopter-btn', {
            label: 'Adopter',
            isActive: role === 'Adopter',
            onClick: () => engine.editor.setRole('Adopter')
          });
        }
      });
    });

    // Register button component for saving template as string
    cesdk.ui.registerComponent('save.string', ({ builder }) => {
      builder.Button('save-string-btn', {
        label: 'Save String',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          const templateString = await engine.scene.saveToString();
          console.log(
            'Template saved as string:',
            templateString.substring(0, 100) + '...'
          );
          // Download the string as a file
          const blob = new Blob([templateString], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'template.scene';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    });

    // Register button component for saving template as archive
    cesdk.ui.registerComponent('save.archive', ({ builder }) => {
      builder.Button('save-archive-btn', {
        label: 'Save Archive',
        icon: '@imgly/Download',
        variant: 'regular',
        onClick: async () => {
          const templateArchive = await engine.scene.saveToArchive();
          console.log(
            'Template saved as archive:',
            templateArchive.size,
            'bytes'
          );
          // Download the archive as a file
          const url = URL.createObjectURL(templateArchive);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'template.zip';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    });

    // Add role toggle and save buttons to the navigation bar
    cesdk.ui.insertNavigationBarOrderComponent('last', 'role.toggle');
    cesdk.ui.insertNavigationBarOrderComponent('last', 'save.string');
    cesdk.ui.insertNavigationBarOrderComponent('last', 'save.archive');

    // Enable auto-fit zoom to continuously fit the page with padding
    engine.scene.enableZoomAutoFit(page, 'Both', 40, 40, 40, 40);
  }
}

export default Example;
