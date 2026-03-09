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
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });

    // Register a notifications dropdown in the navigation bar
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
              duration: 'long',
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
              duration: 'long',
              onDismiss: () => {
                console.log('Notification was dismissed');
              }
            });
          }
        });
      }
    );

    // Register a dialogs dropdown in the navigation bar
    cesdk.ui.registerComponent(
      'ly.img.dialogs.demo.navigationBar',
      ({ builder }) => {
        // Display a simple dialog with a string message
        builder.Button('simple-dialog', {
          label: 'Simple',
          onClick: () => {
            cesdk.ui.showDialog('This is a simple dialog message');
          }
        });

        // Show a dialog and close it programmatically
        builder.Button('close-dialog', {
          label: 'Auto-Close',
          onClick: () => {
            const dialogId = cesdk.ui.showDialog(
              'This dialog will close in 2 seconds'
            );
            setTimeout(() => {
              cesdk.ui.closeDialog(dialogId);
            }, 2000);
          }
        });

        // Display a warning dialog with actions
        builder.Button('warning-dialog', {
          label: 'Warning',
          onClick: () => {
            cesdk.ui.showDialog({
              type: 'warning',
              content: {
                title: 'Unsaved Changes',
                message:
                  'You have unsaved changes. Do you want to save before leaving?'
              },
              actions: [
                {
                  label: 'Save',
                  color: 'accent',
                  onClick: ({ id }) => {
                    console.log('Save clicked');
                    cesdk.ui.closeDialog(id);
                  }
                },
                {
                  label: "Don't Save",
                  variant: 'plain',
                  onClick: ({ id }) => {
                    console.log('Discard clicked');
                    cesdk.ui.closeDialog(id);
                  }
                }
              ],
              cancel: {
                label: 'Cancel',
                onClick: ({ id }) => cesdk.ui.closeDialog(id)
              }
            });
          }
        });

        // Create a loading dialog with progress indicator
        builder.Button('progress-dialog', {
          label: 'Progress',
          onClick: () => {
            const progressDialogId = cesdk.ui.showDialog({
              type: 'loading',
              content: {
                title: 'Exporting',
                message: 'Preparing your export...'
              },
              progress: 'indeterminate',
              clickOutsideToClose: false
            });

            // Simulate progress updates
            let progress = 0;
            const progressInterval = setInterval(() => {
              progress += 20;
              cesdk.ui.updateDialog(progressDialogId, {
                progress: { value: progress, max: 100 },
                content: {
                  title: 'Exporting',
                  message: `Processing... ${progress}%`
                }
              });

              if (progress >= 100) {
                clearInterval(progressInterval);
                cesdk.ui.updateDialog(progressDialogId, {
                  type: 'success',
                  content: {
                    title: 'Export Complete',
                    message: 'Your file has been exported successfully.'
                  },
                  progress: undefined,
                  actions: [
                    {
                      label: 'Done',
                      color: 'accent',
                      onClick: ({ id }) => cesdk.ui.closeDialog(id)
                    }
                  ],
                  clickOutsideToClose: true
                });
              }
            }, 500);
          }
        });

        // Dialog with multi-paragraph content and large size
        builder.Button('content-dialog', {
          label: 'Large Content',
          onClick: () => {
            cesdk.ui.showDialog({
              type: 'info',
              size: 'large',
              content: {
                title: 'About This Feature',
                message: [
                  'Notifications and dialogs help communicate with users during the editing workflow.',
                  'Use notifications for non-blocking feedback and dialogs for important decisions.'
                ]
              },
              actions: [
                {
                  label: 'Got It',
                  color: 'accent',
                  onClick: ({ id }) => cesdk.ui.closeDialog(id)
                }
              ]
            });
          }
        });

        // Handle dialog close events
        builder.Button('onclose-dialog', {
          label: 'With Callback',
          onClick: () => {
            cesdk.ui.showDialog({
              type: 'info',
              content: 'Close this dialog to see the callback',
              onClose: () => {
                console.log('Dialog was closed');
              }
            });
          }
        });
      }
    );

    // Add the demo dropdowns to the navigation bar
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.navigationBar.position.left',
      'ly.img.navigationBar.position.center',
      'ly.img.navigationBar.position.right',
      'ly.img.notifications.demo.navigationBar',
      'ly.img.dialogs.demo.navigationBar'
    ]);
  }
}

export default Example;
