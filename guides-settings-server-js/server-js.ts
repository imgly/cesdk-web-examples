import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Settings
 *
 * Demonstrates how to read, write and observe engine settings:
 * - Listing all settings
 * - Reading and writing settings of each type
 * - Feature toggles
 * - Subscribing to settings changes
 * - Roles and their setting defaults
 */
async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    const allSettings = engine.editor.findAllSettings();
    console.log(allSettings.includes('doubleClickToCropEnabled')); // true
    // The list includes the public `features/*` flags.
    console.log(allSettings.includes('features/fontLineGapEnabled')); // true

    // Boolean settings
    engine.editor.setSetting('doubleClickToCropEnabled', true);
    const cropEnabled = engine.editor.getSetting('doubleClickToCropEnabled');
    console.log(cropEnabled); // true

    // Number settings
    engine.editor.setSetting('maxImageSize', 4096);
    engine.editor.setSetting('positionSnappingThreshold', 2.0);

    // String settings
    engine.editor.setSetting('page/title/separator', ' | ');

    // Color settings
    engine.editor.setSetting('highlightColor', { r: 1, g: 0, b: 1, a: 1 });

    // Enum settings
    engine.editor.setSetting('doubleClickSelectionMode', 'Direct');
    const enumOptions = engine.editor.getSettingEnumOptions(
      'doubleClickSelectionMode'
    );
    console.log(enumOptions); // ['Direct', 'Hierarchical']

    // The preview draws the motion blur of blocks with `motionBlur/enabled`.
    // Set it to false to show these blocks sharp while editing.
    engine.editor.setSetting('features/previewMotionBlurEnabled', false);

    // The line height of text includes the line gap that the font declares.
    // Set it to false for the line heights of engine versions before 1.73.
    console.log(engine.editor.getSetting('features/fontLineGapEnabled')); // true
    engine.editor.setSetting('features/fontLineGapEnabled', false);

    const unsubscribeSettings = engine.editor.onSettingsChanged(() => {
      console.log('Editor settings have changed');
    });

    // Later, to stop listening:
    unsubscribeSettings();

    // Get current role
    const currentRole = engine.editor.getRole();
    console.log(currentRole); // 'Creator'

    // React to role changes
    const unsubscribeRole = engine.editor.onRoleChanged((role) => {
      console.log('Role changed to:', role);
    });

    // Set role and apply role-dependent defaults
    engine.editor.setRole('Adopter');

    unsubscribeRole();
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
