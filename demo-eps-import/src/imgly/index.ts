import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { configureEditor } from './config/editor-ui';
import { createTemplate } from './scene';

export { ARTWORK_FRAME } from './scene';
export { EPSGalleryPlugin } from './plugins/eps-gallery-plugin';

export function initEditor(cesdk: CreativeEditorSDK) {
  configureEditor(cesdk);
  return createTemplate(cesdk.engine);
}
