/**
 * Internationalization Configuration - Customize Labels and Translations
 *
 * This file configures custom translations for the photo editor UI.
 * You can override any built-in label or add translations for new languages.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/localization-508e20/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure translations for the photo editor.
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
  // Photo editor specific labels
  cesdk.i18n.setTranslations({
    en: {
      'libraries.ly.img.sticker.label': 'Stickers',
      'libraries.ly.img.vector.shape.label': 'Shapes',
      'libraries.ly.img.text.label': 'Text'
    }
  });
}
