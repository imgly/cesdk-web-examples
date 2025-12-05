/**
 * Editor Plugin - Configures CE.SDK for custom editing workflows
 */
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import { setupFeatures } from './features';
import { setupTranslations } from './i18n';
import { setupSettings } from './settings';
import { setupUI } from './ui';
// import { setupActions } from './actions';
// import CreativeEditorSDK from '@cesdk/cesdk-js';

const CESDK_VERSION = '1.61';

export class CustomEditorConfig implements EditorPlugin {
  name = 'cesdk-custom-editor';

  version = CESDK_VERSION;

  // version = CreativeEditorSDK.version;

  async initialize({ cesdk, engine }: EditorPluginContext) {
    if (cesdk) {
      cesdk.resetEditor();

      setupFeatures(cesdk);
      setupUI(cesdk);
      setupTranslations(cesdk);
      // setupActions(cesdk);

      setupSettings(engine);
    }
  }
}
