import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Dynamic Content Overview
 *
 * Demonstrates the dynamic content capabilities in CE.SDK templates:
 * - Text Variables: Insert {{tokens}} that resolve to dynamic values
 * - Placeholders: Create drop zones for swappable images/videos
 * - Editing Constraints: Lock properties while allowing controlled changes
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and set role to Adopter
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // Set editor role to Adopter for template usage
    engine.editor.setRole('Adopter');

    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Content area: 480px wide, centered (left margin = 160px)
    const contentX = 160;
    const contentWidth = 480;

    // TEXT VARIABLES: Define variables for personalization
    engine.variable.setString('firstName', 'Jane');
    engine.variable.setString('lastName', 'Doe');
    engine.variable.setString('companyName', 'IMG.LY');

    // Create heading with company variable
    const headingText = engine.block.create('text');
    engine.block.replaceText(
      headingText,
      'Welcome to {{companyName}}, {{firstName}} {{lastName}}.'
    );
    engine.block.setWidth(headingText, contentWidth);
    engine.block.setHeightMode(headingText, 'Auto');
    engine.block.setFloat(headingText, 'text/fontSize', 64);
    engine.block.setEnum(headingText, 'text/horizontalAlignment', 'Left');
    engine.block.appendChild(page, headingText);
    engine.block.setPositionX(headingText, contentX);
    engine.block.setPositionY(headingText, 200);

    // Create description with bullet points
    const descriptionText = engine.block.create('text');
    engine.block.replaceText(
      descriptionText,
      'This example demonstrates dynamic templates.\n\n' +
        '• Text Variables — Personalize content with {{tokens}}\n' +
        '• Placeholders — Swappable images and media\n' +
        '• Editing Constraints — Protected brand elements'
    );
    engine.block.setWidth(descriptionText, contentWidth);
    engine.block.setHeightMode(descriptionText, 'Auto');
    engine.block.setFloat(descriptionText, 'text/fontSize', 44);
    engine.block.setEnum(descriptionText, 'text/horizontalAlignment', 'Left');
    engine.block.appendChild(page, descriptionText);
    engine.block.setPositionX(descriptionText, contentX);
    engine.block.setPositionY(descriptionText, 300);

    // Discover all variables in the scene
    const allVariables = engine.variable.findAll();
    console.log('Variables in scene:', allVariables);

    // PLACEHOLDERS: Create hero image as a swappable drop zone
    const heroImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      { size: { width: contentWidth, height: 140 } }
    );
    engine.block.appendChild(page, heroImage);
    engine.block.setPositionX(heroImage, contentX);
    engine.block.setPositionY(heroImage, 40);

    // Enable placeholder behavior for the hero image
    if (engine.block.supportsPlaceholderBehavior(heroImage)) {
      engine.block.setPlaceholderBehaviorEnabled(heroImage, true);
      engine.block.setPlaceholderEnabled(heroImage, true);

      if (engine.block.supportsPlaceholderControls(heroImage)) {
        engine.block.setPlaceholderControlsOverlayEnabled(heroImage, true);
        engine.block.setPlaceholderControlsButtonEnabled(heroImage, true);
      }
    }

    // Find all placeholders in the scene
    const placeholders = engine.block.findAllPlaceholders();
    console.log('Placeholders in scene:', placeholders.length);

    // EDITING CONSTRAINTS: Add logo that cannot be moved or selected
    const logo = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/imgly_logo.jpg',
      { size: { width: 100, height: 25 } }
    );
    engine.block.appendChild(page, logo);
    engine.block.setPositionX(logo, 350);
    engine.block.setPositionY(logo, 540);

    // Lock the logo: prevent moving, resizing, and selection
    engine.block.setScopeEnabled(logo, 'layer/move', false);
    engine.block.setScopeEnabled(logo, 'layer/resize', false);
    engine.block.setScopeEnabled(logo, 'editor/select', false);

    // Verify constraints are applied
    const canSelect = engine.block.isScopeEnabled(logo, 'editor/select');
    const canMove = engine.block.isScopeEnabled(logo, 'layer/move');
    console.log('Logo - canSelect:', canSelect, 'canMove:', canMove);

    // Zoom to fit the page with autoFit enabled
    await cesdk.actions.run('zoom.toBlock', page, {
      padding: 40,
      animate: false,
      autoFit: true
    });

    console.log('Dynamic Content demo initialized.');

    cesdk.engine.block.setSelected(page, false);
  }
}

export default Example;
