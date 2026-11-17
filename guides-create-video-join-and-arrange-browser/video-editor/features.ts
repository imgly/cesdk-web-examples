/**
 * Feature Configuration - What the editor offers
 *
 * `cesdk.features.configure` switches features and their options on or off and sets what they offer. Every built-in
 * feature is listed: switched on where this editor uses it, commented out where it does not. Options inside a
 * feature start on; switch off the ones this editor does not offer.
 *
 * - `cesdk.features.list()` returns every feature with its options and settings.
 * - `cesdk.features.explain(id, { blockId })` says why something does not show.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/disable-or-enable-f058e2/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure which features the video editor offers.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupFeatures(cesdk: CreativeEditorSDK): void {
  cesdk.features.configure({
    'ly.img.adjustment': { enabled: true },
    'ly.img.animations': { enabled: true },
    'ly.img.blendMode': { enabled: true },
    'ly.img.blur': { enabled: true },
    'ly.img.canvas.bar': { enabled: true },
    'ly.img.canvas.menu': { enabled: true },
    'ly.img.combine': { enabled: true },
    'ly.img.crop': { enabled: true },
    'ly.img.cutout': { enabled: true },
    'ly.img.delete': { enabled: true },
    'ly.img.dock': { enabled: true },
    'ly.img.documentSettings': { enabled: true },
    'ly.img.duplicate': { enabled: true },
    'ly.img.effect': { enabled: true },
    // 'ly.img.exclusionArea': { enabled: true },
    'ly.img.fill': {
      enabled: true,
      // Color mode of each color picker: 'RGB' for video editing, 'CMYK', or 'Any' for both
      options: { color: { options: { picker: { colorMode: 'RGB' } } } }
    },
    'ly.img.filter': { enabled: true },
    'ly.img.group': { enabled: true },
    'ly.img.inspector': { enabled: true },
    'ly.img.inspector.bar': { enabled: true },
    'ly.img.keyboard.shortcuts': { enabled: true },
    // 'ly.img.layerList': { enabled: true },
    'ly.img.library': { enabled: true },
    'ly.img.navigation.bar': { enabled: true },
    'ly.img.notifications': { enabled: true },
    'ly.img.opacity': { enabled: true },
    'ly.img.page': {
      enabled: true,
      options: {
        move: { enabled: false },
        add: { enabled: false },
        bleedMargin: { enabled: false, options: { color: { enabled: false } } },
        printMarks: {
          enabled: false,
          options: {
            crop: { enabled: false },
            registration: { enabled: false }
          }
        },
        safetyMargin: {
          enabled: false,
          options: { color: { enabled: false } }
        },
        layout: {
          enabled: false,
          layouts: [],
          options: { spacing: { enabled: false } }
        },
        fontSizeUnit: { enabled: false }
      }
    },
    // 'ly.img.placeholder': { enabled: true },
    'ly.img.playbackSpeed': { enabled: true },
    'ly.img.position': { enabled: true },
    // 'ly.img.preview': { enabled: true },
    'ly.img.replace': { enabled: true },
    // 'ly.img.rulers': { enabled: true },
    // 'ly.img.settings': { enabled: true },
    'ly.img.shadow': {
      enabled: true,
      options: { color: { options: { picker: { colorMode: 'RGB' } } } }
    },
    'ly.img.shape': {
      enabled: true,
      options: { lineWidth: { enabled: true }, edit: { enabled: false } }
    },
    'ly.img.stroke': {
      enabled: true,
      options: { color: { options: { picker: { colorMode: 'RGB' } } } }
    },
    'ly.img.text': {
      enabled: true,
      options: {
        color: { options: { picker: { colorMode: 'RGB' } } },
        background: { options: { picker: { colorMode: 'RGB' } } }
      }
    },
    'ly.img.timing': { enabled: true },
    'ly.img.transform': { enabled: true },
    'ly.img.transitions': {
      enabled: true
      // Always show the clip transition control (default reveals it on hover):
      // controlVisibility: 'always'
    },
    'ly.img.trim': { enabled: true },
    // 'ly.img.vectorEdit': { enabled: true },
    'ly.img.video.caption': { enabled: true },
    'ly.img.video.timeline': {
      enabled: true,
      // Only show the active track in the timeline (hides inactive tracks)
      trackVisibility: 'active',
      options: { ruler: { enabled: false } }
    },
    'ly.img.volume': { enabled: true }
  });
}
