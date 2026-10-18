/**
 * Internationalization Configuration - Customize Labels and Translations
 *
 * This file configures custom translations for the design editor UI.
 * You can override any built-in label or add translations for new languages.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/localization-508e20/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure translations for the design editor.
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
  //     'libraries.ly.img.templates.label': 'Templates',
  //     'libraries.ly.img.image.label': 'Photos',
  //     'component.fileOperation.export': 'Download',
  //     'common.done': 'Finish',
  //   },
  //   de: {
  //     'libraries.ly.img.templates.label': 'Vorlagen',
  //     'libraries.ly.img.image.label': 'Fotos',
  //     'component.fileOperation.export': 'Herunterladen',
  //     'common.done': 'Fertig',
  //   }
  // });

  // Suppress unused variable warning
  void cesdk;
}
