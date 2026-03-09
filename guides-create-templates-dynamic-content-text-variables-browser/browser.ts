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
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

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

    // Build a custom Variables Manager panel
    // CE.SDK doesn't include a built-in UI for creating/managing variables,
    // so you can build one using the Panel Builder API
    cesdk.ui.registerPanel(
      'ly.img.variablesManager',
      ({ builder, engine: panelEngine, state }) => {
        const { Section, TextInput, Button } = builder;

        // State for creating new variables
        const newVariableName = state('newVariableName', '');
        const newVariableValue = state('newVariableValue', '');

        // Section: Create New Variable
        Section('create-variable', {
          title: 'Create New Variable',
          children: () => {
            TextInput('new-name', {
              inputLabel: 'Variable Name',
              ...newVariableName
            });

            TextInput('new-value', {
              inputLabel: 'Default Value',
              ...newVariableValue
            });

            Button('create-btn', {
              label: 'Create Variable',
              color: 'accent',
              isDisabled: !newVariableName.value.trim(),
              onClick: () => {
                const name = newVariableName.value.trim();
                if (name) {
                  panelEngine.variable.setString(name, newVariableValue.value);
                  newVariableName.setValue('');
                  newVariableValue.setValue('');
                }
              }
            });
          }
        });

        // Section: Existing Variables
        const variables = panelEngine.variable.findAll();
        Section('existing-variables', {
          title: `Manage Variables (${variables.length})`,
          children: () => {
            if (variables.length === 0) {
              builder.Text('no-vars', { content: 'No variables defined yet.' });
              return;
            }

            variables.forEach(varName => {
              TextInput(`var-${varName}`, {
                inputLabel: varName,
                value: panelEngine.variable.getString(varName),
                setValue: value => {
                  panelEngine.variable.setString(varName, value);
                },
                suffix: {
                  icon: '@imgly/TrashBin',
                  tooltip: 'Delete variable',
                  onClick: () => {
                    panelEngine.variable.remove(varName);
                  }
                }
              });
            });
          }
        });
      }
    );

    // Set the panel title
    cesdk.i18n.setTranslations({
      en: {
        'panel.ly.img.variablesManager': 'Custom Variables Panel'
      }
    });

    // Add a dock button to open the panel
    cesdk.ui.registerComponent('variablesManager.dock', ({ builder: b }) => {
      const isPanelOpen = cesdk.ui.isPanelOpen('ly.img.variablesManager');
      b.Button('variables-dock-btn', {
        label: 'Variables',
        icon: '@imgly/Text',
        onClick: () => {
          if (isPanelOpen) {
            cesdk.ui.closePanel('ly.img.variablesManager');
          } else {
            cesdk.ui.openPanel('ly.img.variablesManager');
          }
        },
        isActive: isPanelOpen
      });
    });

    // Add button to dock
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'ly.img.spacer',
      'variablesManager.dock'
    ]);
  }
}

export default Example;
