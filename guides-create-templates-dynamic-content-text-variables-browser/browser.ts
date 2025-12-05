import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Text Variables Guide
 *
 * Demonstrates text variable management in CE.SDK with a single comprehensive example:
 * - Discovering variables with findAll()
 * - Creating and updating variables with setString()
 * - Reading variable values with getString()
 * - Binding variables to text blocks with {{variable}} tokens
 * - Detecting variable references with referencesAnyVariables()
 * - Removing variables with remove()
 * - Localizing variable labels
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
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Set page dimensions for consistent layout
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Localize variable labels that appear in the Variables panel UI
    cesdk.i18n.setTranslations({
      en: {
        'variables.firstName.label': 'First Name',
        'variables.lastName.label': 'Last Name',
        'variables.email.label': 'Email Address',
        'variables.company.label': 'Company Name',
        'variables.title.label': 'Job Title'
      }
    });

    // Pattern 1: Discover all existing variables in the scene
    // This is useful when loading templates to see what variables need values
    const existingVariables = engine.variable.findAll();
    // eslint-disable-next-line no-console
    console.log('Existing variables:', existingVariables); // []

    // Pattern 2: Create and update text variables
    // If a variable doesn't exist, setString() creates it
    // If it already exists, setString() updates its value
    engine.variable.setString('firstName', 'Alex');
    engine.variable.setString('lastName', 'Smith');
    engine.variable.setString('email', 'alex.smith@example.com');
    engine.variable.setString('company', 'IMG.LY');
    engine.variable.setString('title', 'Creative Developer');

    // Pattern 3: Read variable values at runtime
    const firstName = engine.variable.getString('firstName');
    // eslint-disable-next-line no-console
    console.log('First name variable:', firstName); // 'Alex'

    // Create a single comprehensive text block demonstrating all variable patterns
    const textBlock = engine.block.create('text');

    // Multi-line text combining:
    // - Single variable ({{firstName}})
    // - Multiple variables ({{firstName}} {{lastName}})
    // - Variables in context (Email: {{email}})
    const textContent = `Hello, {{firstName}}!

Full Name: {{firstName}} {{lastName}}
Email: {{email}}
Position: {{title}}
Company: {{company}}`;

    engine.block.replaceText(textBlock, textContent);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setFloat(textBlock, 'text/fontSize', 52);
    engine.block.appendChild(page, textBlock);

    // Center the text block on the page (after font size is set)
    // Get the actual frame dimensions of the block (including its bounds)
    const frameX = engine.block.getFrameX(textBlock);
    const frameY = engine.block.getFrameY(textBlock);
    const frameWidth = engine.block.getFrameWidth(textBlock);
    const frameHeight = engine.block.getFrameHeight(textBlock);

    // Calculate centered position accounting for frame offset
    engine.block.setPositionX(textBlock, (pageWidth - frameWidth) / 2 - frameX);
    engine.block.setPositionY(
      textBlock,
      (pageHeight - frameHeight) / 2 - frameY
    );

    // Check if the block contains variable references
    const hasVariables = engine.block.referencesAnyVariables(textBlock);
    // eslint-disable-next-line no-console
    console.log('Text block has variables:', hasVariables); // true

    // Create and then remove a temporary variable to demonstrate removal
    engine.variable.setString('tempVariable', 'Temporary Value');
    // eslint-disable-next-line no-console
    console.log('Variables before removal:', engine.variable.findAll());

    // Remove the temporary variable
    engine.variable.remove('tempVariable');
    // eslint-disable-next-line no-console
    console.log('Variables after removal:', engine.variable.findAll());

    // Select the text block to show the Variables panel
    engine.block.setSelected(textBlock, true);

    // Final check: List all variables in the scene
    const finalVariables = engine.variable.findAll();
    // eslint-disable-next-line no-console
    console.log('Final variables in scene:', finalVariables);
    // Expected: ['firstName', 'lastName', 'email', 'company', 'title']
  }
}

export default Example;
