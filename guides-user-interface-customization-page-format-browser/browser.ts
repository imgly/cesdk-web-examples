import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Page Format Customization Guide
 *
 * This example demonstrates:
 * - Creating custom page format presets
 * - Configuring page dimensions with different design units
 * - Registering custom page formats with the UI
 * - Setting a default page format
 * - Controlling orientation behavior
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default CE.SDK asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Create a local asset source for custom page formats
    cesdk.engine.asset.addLocalSource('my-custom-formats');

    // Add custom page format presets with dimensions in millimeters
    cesdk.engine.asset.addAssetToSource('my-custom-formats', {
      id: 'din-a4-portrait',
      label: { en: 'DIN A4 Portrait' },
      meta: {
        default: true
      },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 210,
          height: 297,
          designUnit: 'Millimeter'
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('my-custom-formats', {
      id: 'din-a4-landscape',
      label: { en: 'DIN A4 Landscape' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 297,
          height: 210,
          designUnit: 'Millimeter'
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('my-custom-formats', {
      id: 'din-a3-portrait',
      label: { en: 'DIN A3 Portrait' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 297,
          height: 420,
          designUnit: 'Millimeter'
        }
      }
    });

    // Add a page format using pixel dimensions
    cesdk.engine.asset.addAssetToSource('my-custom-formats', {
      id: 'social-instagram-square',
      label: { en: 'Instagram Square' },
      meta: {
        fixedOrientation: true
      },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 1080,
          height: 1080,
          designUnit: 'Pixel'
        }
      }
    });

    // Add a page format using inch dimensions
    cesdk.engine.asset.addAssetToSource('my-custom-formats', {
      id: 'us-letter-portrait',
      label: { en: 'US Letter Portrait' },
      payload: {
        transformPreset: {
          type: 'FixedSize',
          width: 8.5,
          height: 11,
          designUnit: 'Inch'
        }
      }
    });

    // Register custom page format source with the UI
    // This replaces the default page formats with only the custom ones
    cesdk.ui.updateAssetLibraryEntry('ly.img.pagePresets', {
      sourceIds: ['my-custom-formats']
    });

    // Intercept format application to apply to existing pages instead of creating new ones
    cesdk.engine.asset.registerApplyMiddleware(
      async (sourceId, assetResult, apply) => {
        // Only intercept our custom page format source
        if (sourceId !== 'my-custom-formats') {
          return apply(sourceId, assetResult);
        }

        // Get the first page
        const pages = cesdk.engine.scene.getPages();
        if (pages.length === 0) {
          return apply(sourceId, assetResult);
        }

        // Apply the format to the existing page
        const page = pages[0];
        await cesdk.engine.asset.applyToBlock(sourceId, assetResult, page);

        // Zoom to show the updated page
        await cesdk.engine.scene.zoomToBlock(page, {
          padding: {
            left: 40,
            top: 40,
            right: 40,
            bottom: 40
          }
        });

        return page;
      }
    );

    // Create a design scene - the default format (DIN A4 Portrait) is applied
    await cesdk.createDesignScene();

    // Zoom to fit the page in the viewport
    const engine = cesdk.engine;
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      await engine.scene.zoomToBlock(pages[0], {
        padding: {
          left: 40,
          top: 40,
          right: 40,
          bottom: 40
        }
      });
    }

    // Open the page resize panel on startup
    cesdk.ui.openPanel('//ly.img.panel/inspector/pageResize');
  }
}

export default Example;
