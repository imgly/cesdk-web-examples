import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    // Register the notification demo buttons in the navigation bar
    cesdk.ui.registerComponent(
      'ly.img.notifications.demo.navigationBar',
      ({ builder }) => {
        // Display a simple notification with a string message
        builder.Button('simple-notification', {
          label: 'Simple',
          onClick: () => {
            cesdk.ui.showNotification('Welcome to CE.SDK!');
          }
        });

        // Display notifications with different types
        builder.Button('info-notification', {
          label: 'Info',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'This is an info notification',
              type: 'info'
            });
          }
        });

        builder.Button('success-notification', {
          label: 'Success',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Operation completed successfully',
              type: 'success'
            });
          }
        });

        builder.Button('warning-notification', {
          label: 'Warning',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Please check your input',
              type: 'warning'
            });
          }
        });

        builder.Button('error-notification', {
          label: 'Error',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Something went wrong',
              type: 'error'
            });
          }
        });

        // Add an action button to a notification
        builder.Button('action-notification', {
          label: 'With Action',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'New template available',
              type: 'info',
              action: {
                label: 'View',
                onClick: ({ id }) => {
                  console.log('Action clicked on notification:', id);
                  cesdk.ui.dismissNotification(id);
                }
              }
            });
          }
        });

        // Create a loading notification that updates to success
        builder.Button('loading-notification', {
          label: 'Loading → Success',
          onClick: () => {
            const loadingId = cesdk.ui.showNotification({
              message: 'Processing your request...',
              type: 'loading',
              duration: 'infinite'
            });

            // Simulate async operation completing
            setTimeout(() => {
              cesdk.ui.updateNotification(loadingId, {
                type: 'success',
                message: 'Processing complete!',
                duration: 'medium'
              });
            }, 2000);
          }
        });

        // Show a notification that can be dismissed
        builder.Button('dismiss-notification', {
          label: 'Auto-Dismiss',
          onClick: () => {
            const notificationId = cesdk.ui.showNotification({
              message: 'This will be dismissed in 2 seconds',
              type: 'info',
              duration: 'infinite'
            });

            setTimeout(() => {
              cesdk.ui.dismissNotification(notificationId);
            }, 2000);
          }
        });

        // Handle notification dismiss events
        builder.Button('ondismiss-notification', {
          label: 'With Callback',
          onClick: () => {
            cesdk.ui.showNotification({
              message: 'Dismiss me to see the callback',
              type: 'info',
              onDismiss: () => {
                console.log('Notification was dismissed');
              }
            });
          }
        });
      }
    );

    // Add the demo buttons to the navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      'ly.img.notifications.demo.navigationBar'
    );
  }
}

export default Example;
