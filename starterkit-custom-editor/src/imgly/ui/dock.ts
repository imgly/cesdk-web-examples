/**
 * Dock Configuration
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/dock-cb916c/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setupDock(cesdk: CreativeEditorSDK): void {
  // #region Dock display settings
  // Configure dock display settings
  // cesdk.engine.editor.setSetting('dock/hideLabels', true);
  // cesdk.engine.editor.setSetting('dock/iconSize', 'normal');
  // #endregion
  // #region Dock components configuration
  // Configure dock components
  // cesdk.ui.setDockOrder([
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.template',
  //     icon: '@imgly/Template',
  //     label: 'libraries.ly.img.template.label',
  //     entries: ['ly.img.template']
  //   },
  //   {
  //     id: 'ly.img.separator',
  //     key: 'ly.img.separator'
  //   },
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.elements',
  //     icon: '@imgly/Library',
  //     label: 'component.library.elements',
  //     entries: [
  //       'ly.img.image',
  //       'ly.img.text',
  //       'ly.img.vectorpath',
  //       'ly.img.sticker'
  //     ]
  //   },
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.upload',
  //     icon: '@imgly/Upload',
  //     label: 'libraries.ly.img.upload.label',
  //     entries: ['ly.img.upload']
  //   },
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.image',
  //     icon: '@imgly/Image',
  //     label: 'libraries.ly.img.image.label',
  //     entries: ['ly.img.image', 'ly.img.image.upload']
  //   },
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.text',
  //     icon: '@imgly/Text',
  //     label: 'libraries.ly.img.text.label',
  //     entries: ['ly.img.text']
  //   },
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.vectorpath',
  //     icon: '@imgly/Shapes',
  //     label: 'libraries.ly.img.vectorpath.label',
  //     entries: ['ly.img.vectorpath']
  //   },
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.sticker',
  //     icon: '@imgly/Sticker',
  //     label: 'libraries.ly.img.sticker.label',
  //     entries: ['ly.img.sticker']
  //   }
  // ]);
  // #endregion
}
