import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Lock the Template
 *
 * This example demonstrates the two-surface pattern for template workflows:
 * - Creator role: Full editing access for designers building templates
 * - Adopter role: Restricted access for users customizing templates
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // Get the page and set dimensions
    const page = engine.block.findByType('page')[0];
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 500);

    // Create a brand template with a logo and headline
    const logoBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/imgly_logo.jpg',
      { size: { width: 120, height: 30 } }
    );
    engine.block.appendChild(page, logoBlock);
    engine.block.setPositionX(logoBlock, 40);
    engine.block.setPositionY(logoBlock, 40);
    engine.block.setName(logoBlock, 'Logo');

    const headlineBlock = engine.block.create('text');
    engine.block.replaceText(headlineBlock, 'Edit this headline');
    engine.block.setWidth(headlineBlock, 720);
    engine.block.setHeightMode(headlineBlock, 'Auto');
    engine.block.setFloat(headlineBlock, 'text/fontSize', 48);
    engine.block.setEnum(headlineBlock, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, headlineBlock);
    engine.block.setPositionX(headlineBlock, 40);
    engine.block.setPositionY(headlineBlock, 200);
    engine.block.setName(headlineBlock, 'Headline');

    // Configure which elements Adopters can edit
    // Enable selection and text editing on the headline
    engine.block.setScopeEnabled(headlineBlock, 'editor/select', true);
    engine.block.setScopeEnabled(headlineBlock, 'text/edit', true);

    // Leave all scopes disabled on the logo (default state)
    // This prevents Adopters from selecting or modifying the logo

    // The Creator role ignores all scope restrictions
    engine.editor.setRole('Creator');

    // Add a role toggle to the navigation bar (engine calls are reactive)
    cesdk.ui.registerComponent(
      'ly.img.roleToggle.navigationBar',
      ({ builder }) => {
        const role = engine.editor.getRole();
        builder.ButtonGroup('role-toggle', {
          children: () => {
            builder.Button('creator', {
              label: 'Creator',
              isActive: role === 'Creator',
              onClick: () => engine.editor.setRole('Creator')
            });
            builder.Button('adopter', {
              label: 'Adopter',
              isActive: role === 'Adopter',
              onClick: () => {
                // Close the placeholder panel since Adopters can't configure scopes
                cesdk.ui.closePanel(
                  '//ly.img.panel/inspector/placeholderSettings'
                );
                engine.editor.setRole('Adopter');
              }
            });
          }
        });
      }
    );

    cesdk.ui.setNavigationBarOrder([
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.roleToggle.navigationBar',
      'ly.img.spacer'
    ]);

    await engine.scene.zoomToBlock(page, { padding: 40 });

    // Select the headline and open the placeholder panel so users see the scope settings
    engine.block.select(headlineBlock);
    setTimeout(() => {
      cesdk.ui.openPanel('//ly.img.panel/inspector/placeholderSettings');
    }, 300);
  }
}

export default Example;
