/**
 * Video Timeline Configuration - Timeline Controls Bar
 *
 * Configure the controls bar above the video timeline. Only relevant when the
 * editor runs in Video mode. The bar is composed from registered components in
 * a configurable order — reorder or remove the built-in controls, or add your
 * own via `cesdk.ui.registerComponent(...)`.
 *
 * ## Built-in Component IDs
 *
 * - `'ly.img.video.timeline.background'` - Page background color control
 * - `'ly.img.video.timeline.split'` - Split the selected clip at the playhead
 * - `'ly.img.video.timeline.playbackInfo'` - Playback time / total duration
 * - `'ly.img.video.timeline.playPause'` - Play/pause button
 * - `'ly.img.video.timeline.loop'` - Loop playback toggle
 * - `'ly.img.video.timeline.zoom'` - Timeline zoom controls
 * - `'ly.img.video.timeline.toggle'` - Expand/collapse the timeline
 * - `'ly.img.spacer'` - Flexible space separating groups
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/reference/component-order-api-d4e5f6/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the video timeline controls bar.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupVideoTimeline(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // TIMELINE CONTROLS BAR
  // Uncomment to configure when using the editor in Video mode
  // ============================================================================
  // #region Timeline Controls Bar
  // cesdk.ui.setComponentOrder({ in: 'ly.img.video.timeline.controls.bar' }, [
  //   'ly.img.video.timeline.background',
  //   'ly.img.video.timeline.split',
  //   'ly.img.spacer',
  //   'ly.img.video.timeline.playbackInfo',
  //   'ly.img.video.timeline.playPause',
  //   'ly.img.video.timeline.loop',
  //   'ly.img.spacer',
  //   'ly.img.video.timeline.zoom',
  //   'ly.img.video.timeline.toggle'
  // ]);
  // #endregion

  // Set a fixed timeline height
  // cesdk.actions.run('timeline.setHeight', { height: 320 });
  // Suppress unused variable warning
  void cesdk;
}
