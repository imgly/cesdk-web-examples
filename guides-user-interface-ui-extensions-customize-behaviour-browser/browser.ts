import type {
  CreativeEngine,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';
import type { BlockEvent } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';
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

export default class CustomizeBehaviorExample implements EditorPlugin {
  name = 'CustomizeBehaviorExample';
  version = '1.0.0';

  async initialize({ cesdk, engine }: EditorPluginContext) {
    if (!cesdk) {
      throw new Error('CE.SDK not available');
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

    // Load a simple scene for demonstration
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_1.scene'
    );

    // Show welcome dialog first, then run demonstrations after user confirms
    this.demonstrateDialogs(cesdk, engine);
  }

  private demonstrateEventSubscription(
    engine: CreativeEngine,
    cesdk: any
  ): void {
    // Subscribe to all block events
    const unsubscribe = engine.event.subscribe([], (events: BlockEvent[]) => {
      events.forEach((event) => {
        // eslint-disable-next-line no-console
        console.log(`Block event: ${event.type} on block ${event.block}`);

        // Show notification when blocks are created
        if (event.type === 'Created') {
          cesdk.ui.showNotification({
            message: `Block created: ${event.block}`,
            type: 'info',
            duration: 'short'
          });
        }
      });
    });

    // Store unsubscribe function for cleanup
    (window as any).unsubscribeEvents = unsubscribe;
  }

  private demonstratePanelManagement(cesdk: any): void {
    // Check if inspector panel is open
    const isInspectorOpen = cesdk.ui.isPanelOpen('//ly.img.panel/inspector');
    // eslint-disable-next-line no-console
    console.log('Inspector panel open:', isInspectorOpen);

    // Open panel conditionally
    if (!isInspectorOpen) {
      cesdk.ui.openPanel('//ly.img.panel/inspector');
    }

    // Close panel after delay (for demonstration)
    setTimeout(() => {
      cesdk.ui.closePanel('//ly.img.panel/inspector');
      // eslint-disable-next-line no-console
      console.log('Inspector panel closed');
    }, 2000);

    // Find all available panels
    const allPanels = cesdk.ui.findAllPanels();
    // eslint-disable-next-line no-console
    console.log('Available panels:', allPanels);
  }

  private demonstrateNotifications(cesdk: any): void {
    // Show simple notification
    const notificationId = cesdk.ui.showNotification('Welcome to CE.SDK!');
    // eslint-disable-next-line no-console
    console.log('Notification ID:', notificationId);

    // Show notification with configuration
    setTimeout(() => {
      cesdk.ui.showNotification({
        message: 'This is a success message',
        type: 'success',
        duration: 'medium'
      });
    }, 1000);

    // Show error notification
    setTimeout(() => {
      cesdk.ui.showNotification({
        message: 'This is an error notification',
        type: 'error',
        duration: 'long'
      });
    }, 2000);
  }

  private demonstrateDialogs(
    cesdk: CreativeEditorSDK,
    engine: CreativeEngine
  ): void {
    // Show welcome dialog immediately
    cesdk.ui.showDialog({
      type: 'info',
      content: {
        title: 'Welcome to CE.SDK UI Behavior Customization',
        message:
          "This example demonstrates how to programmatically control CE.SDK's interface through event subscriptions, panel management, notifications, dialogs, custom actions, and theme controls. Click 'Confirm' to start the demonstration."
      },
      actions: [
        {
          label: 'Cancel',
          onClick: (context) => {
            // eslint-disable-next-line no-console
            console.log('User cancelled demonstration');
            cesdk.ui.closeDialog(context.id);
          }
        },
        {
          label: 'Confirm',
          onClick: (context) => {
            // eslint-disable-next-line no-console
            console.log('User confirmed - starting demonstrations');
            cesdk.ui.closeDialog(context.id);

            // Run all demonstrations after user confirms
            this.demonstrateEventSubscription(engine, cesdk);
            this.demonstratePanelManagement(cesdk);
            this.demonstrateNotifications(cesdk);
            this.demonstrateCustomActions(cesdk);
            this.demonstrateThemeControl(cesdk);
            this.demonstrateFeatureManagement(cesdk);
          }
        }
      ]
    });
  }

  private demonstrateCustomActions(cesdk: any): void {
    // Register a custom download action
    cesdk.actions.register(
      'downloadFile',
      async (blob: Blob, mimeType: string) => {
        // eslint-disable-next-line no-console
        console.log('Custom download action called:', { blob, mimeType });

        // Custom download logic
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `export.${mimeType.split('/')[1]}`;
        link.click();
        URL.revokeObjectURL(url);

        cesdk.ui.showNotification({
          message: 'File downloaded successfully!',
          type: 'success'
        });
      }
    );

    // List all registered actions
    const actions = cesdk.actions.list();
    // eslint-disable-next-line no-console
    console.log('Registered actions:', actions);

    // Check if specific action exists
    const downloadAction = cesdk.actions.get('downloadFile');
    // eslint-disable-next-line no-console
    console.log('Download action registered:', !!downloadAction);
  }

  private demonstrateThemeControl(cesdk: any): void {
    // Get current theme
    const currentTheme = cesdk.ui.getTheme();
    // eslint-disable-next-line no-console
    console.log('Current theme:', currentTheme);

    // Toggle theme after delay
    setTimeout(() => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      cesdk.ui.setTheme(newTheme);
      // eslint-disable-next-line no-console
      console.log('Theme changed to:', newTheme);

      cesdk.ui.showNotification({
        message: `Theme switched to ${newTheme} mode`,
        type: 'info'
      });
    }, 5000);

    // Get current scale
    const currentScale = cesdk.ui.getScale();
    // eslint-disable-next-line no-console
    console.log('Current scale:', currentScale);
  }

  private demonstrateFeatureManagement(cesdk: any): void {
    // Check if feature is enabled
    const isUndoEnabled = cesdk.feature.isEnabled('ly.img.undo');
    // eslint-disable-next-line no-console
    console.log('Undo feature enabled:', isUndoEnabled);

    // Disable feature conditionally
    setTimeout(() => {
      // Example: Disable undo for demonstration
      // cesdk.feature.disable('ly.img.undo');
      // eslint-disable-next-line no-console
      console.log('Feature management demonstrated (undo not disabled)');
    }, 6000);

    // List features matching pattern
    const allFeatures = cesdk.feature.list({ matcher: 'ly.img.*' });
    // eslint-disable-next-line no-console
    console.log('Available features:', allFeatures.slice(0, 10));
  }

  async demonstrateExternalIntegration(
    engine: CreativeEngine,
    cesdk: any
  ): Promise<void> {
    // Example: Integrate with external state management
    const externalState = {
      selectedBlockCount: 0,
      lastEventType: ''
    };

    // Subscribe to events and update external state
    engine.event.subscribe([], (events: BlockEvent[]) => {
      events.forEach((event) => {
        externalState.lastEventType = event.type;
        // eslint-disable-next-line no-console
        console.log('External state updated:', externalState);
      });
    });

    // Listen for external changes and update UI
    // In a real app, this would connect to Redux, MobX, etc.
    setInterval(() => {
      const selectedBlocks = engine.block.findAllSelected();
      if (selectedBlocks.length !== externalState.selectedBlockCount) {
        externalState.selectedBlockCount = selectedBlocks.length;
        // eslint-disable-next-line no-console
        console.log('Selection changed:', externalState.selectedBlockCount);

        // Show panel when blocks are selected
        if (selectedBlocks.length > 0) {
          cesdk.ui.openPanel('//ly.img.panel/inspector');
        }
      }
    }, 1000);
  }

  private demonstrateContextAwareWorkflow(
    engine: CreativeEngine,
    cesdk: any
  ): void {
    // Create context-aware workflow
    engine.event.subscribe([], (events: BlockEvent[]) => {
      events.forEach((event) => {
        if (event.type === 'Created') {
          // Show notification for new blocks
          cesdk.ui.showNotification({
            message: 'New block created - Opening inspector',
            type: 'info'
          });

          // Open inspector panel
          cesdk.ui.openPanel('//ly.img.panel/inspector');
        }

        if (event.type === 'Destroyed') {
          // Check if any blocks remain
          const allBlocks = engine.block.findAll();
          if (allBlocks.length === 0) {
            cesdk.ui.showNotification({
              message: 'All blocks removed',
              type: 'info'
            });
          }
        }
      });
    });
  }
}
