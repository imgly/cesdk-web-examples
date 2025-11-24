/**
 * Actions Configuration
 * @see https://img.ly/docs/cesdk/js/actions-6ch24x
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setupActions(cesdk: CreativeEditorSDK): void {
  // #region Basic actions
  // Define a "Load" action to handle importing scenes in the editor
  // cesdk.actions.register('importScene', async () => {
  //   const scene = await cesdk.utils.loadFile({
  //     accept: '.scene',
  //     returnType: 'text'
  //   });
  //   await cesdk.engine.scene.loadFromString(scene);
  // });
  // Define a "Save" action to handle saving scenes in the editor
  // cesdk.actions.register('saveScene', async () => {
  //   const scene = await cesdk.engine.scene.saveToString();
  //   await cesdk.utils.downloadFile(scene, 'text/plain;charset=UTF-8');
  // });
  // Define an "Export" action to handle exporting designs as PNG images in the editor
  // cesdk.actions.register('exportImage', async () => {
  //   const { blobs, options } = await cesdk.utils.export({
  //     mimeType: 'image/png'
  //   });
  //   await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  // });
  // #endregion
  // #region Export actions
  // Define an "Export Video" action to handle exporting videos as MP4 files in the editor
  // cesdk.actions.register('exportVideo', async () => {
  //   const { blobs, options } = await cesdk.utils.export({
  //     mimeType: 'video/mp4'
  //   });
  //   await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  // });
  // Define an "Export PDF" action to handle exporting documents as PDF files in the editor
  // cesdk.actions.register('exportPDF', async () => {
  //   const { blobs, options } = await cesdk.utils.export({
  //     mimeType: 'application/pdf'
  //   });
  //   await cesdk.utils.downloadFile(blobs[0], options.mimeType);
  // });
  // Define an "Export Scene" action to handle exporting scene data as SCENE files in the editor
  // cesdk.actions.register('exportScene', async () => {
  //   const scene = await cesdk.engine.scene.saveToString();
  //   await cesdk.utils.downloadFile(scene, 'text/plain;charset=UTF-8');
  // });
  // Define an "Export Archive" action to handle exporting scenes and assets as ZIP archives in the editor
  // cesdk.actions.register('exportArchive', async () => {
  //   const scene = await cesdk.engine.scene.saveToArchive();
  //   await cesdk.utils.downloadFile(scene, 'application/zip');
  // });
  // #endregion
  // #region Import actions
  // Define an "Import Archive" action to handle importing scenes from ZIP files in the editor
  // cesdk.actions.register('importArchive', async () => {
  //   const scene = await cesdk.utils.loadFile({
  //     accept: '.zip',
  //     returnType: 'dataURL'
  //   });
  //   await cesdk.engine.scene.loadFromArchiveURL(scene);
  // });
  // #endregion
}
