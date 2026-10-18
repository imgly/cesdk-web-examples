/**
 * Internationalization Configuration - Customize Labels and Translations
 *
 * This file configures custom translations for the video editor UI.
 * You can override any built-in label or add translations for new languages.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/localization-508e20/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure translations for the video editor.
 *
 * Translations allow you to:
 * - Customize button labels and UI text
 * - Support multiple languages
 * - Match your brand voice
 * - Provide context-specific terminology
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 *
 * @example Changing the locale
 * ```typescript
 * cesdk.i18n.setLocale('de');
 * ```
 */
export function setupTranslations(cesdk: CreativeEditorSDK): void {
  // Example: Override built-in labels with custom text
  // cesdk.i18n.setTranslations({
  //   en: {
  //     'libraries.ly.img.video.label': 'Videos',
  //     'libraries.ly.img.audio.label': 'Audio',
  //     'component.fileOperation.export': 'Export Video',
  //     'common.done': 'Finish',
  //   },
  //   de: {
  //     'libraries.ly.img.video.label': 'Videos',
  //     'libraries.ly.img.audio.label': 'Audio',
  //     'component.fileOperation.export': 'Video exportieren',
  //     'common.done': 'Fertig',
  //   }
  // });

  // Suppress unused variable warning
  void cesdk;
}
