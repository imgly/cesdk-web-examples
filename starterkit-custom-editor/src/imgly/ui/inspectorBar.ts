/**
 * Inspector Bar Configuration
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/inspector-bar-8ca1cd/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setupInspectorBar(cesdk: CreativeEditorSDK): void {
  // #region Inspector bar - Transform mode
  // Transform mode inspector bar
  // cesdk.ui.setInspectorBarOrder(
  //   [
  //     // Layout spacers
  //     'ly.img.spacer',
  //     // Video and media controls
  //     'ly.img.video.caption.inspectorBar',
  //     'ly.img.audio.replace.inspectorBar',
  //     // Shape and geometry controls
  //     'ly.img.shape.options.inspectorBar',
  //     'ly.img.cutout.type.inspectorBar',
  //     'ly.img.cutout.offset.inspectorBar',
  //     'ly.img.cutout.smoothing.inspectorBar',
  //     // Group management
  //     'ly.img.group.create.inspectorBar',
  //     'ly.img.group.ungroup.inspectorBar',
  //     'ly.img.combine.inspectorBar',
  //     'ly.img.separator',
  //     // Text formatting controls
  //     'ly.img.text.typeFace.inspectorBar',
  //     'ly.img.text.style.inspectorBar',
  //     'ly.img.text.bold.inspectorBar',
  //     'ly.img.text.italic.inspectorBar',
  //     'ly.img.text.fontSize.inspectorBar',
  //     'ly.img.text.alignHorizontal.inspectorBar',
  //     'ly.img.text.advanced.inspectorBar',
  //     'ly.img.separator',
  //     // Basic appearance controls
  //     'ly.img.fill.inspectorBar',
  //     'ly.img.stroke.inspectorBar',
  //     'ly.img.separator',
  //     // Text background
  //     'ly.img.text.background.inspectorBar',
  //     'ly.img.separator',
  //     // Media controls
  //     'ly.img.trim.inspectorBar',
  //     'ly.img.volume.inspectorBar',
  //     'ly.img.crop.inspectorBar',
  //     'ly.img.separator',
  //     // Animation controls
  //     'ly.img.animations.inspectorBar',
  //     'ly.img.separator',
  //     // Image adjustments
  //     'ly.img.adjustment.inspectorBar',
  //     'ly.img.filter.inspectorBar',
  //     'ly.img.separator',
  //     // Visual effects
  //     'ly.img.effect.inspectorBar',
  //     'ly.img.blur.inspectorBar',
  //     'ly.img.shadow.inspectorBar',
  //     'ly.img.separator',
  //     // Element properties
  //     'ly.img.opacityOptions.inspectorBar',
  //     'ly.img.position.inspectorBar',
  //     'ly.img.separator',
  //     // Layout controls
  //     'ly.img.spacer',
  //     'ly.img.inspectorToggle.inspectorBar'
  //   ],
  //   { editMode: 'Transform' }
  // );
  // #endregion
  // #region Inspector bar - Trim mode
  // Trim mode inspector bar
  // cesdk.ui.setInspectorBarOrder(
  //   [
  //     'ly.img.trimControls.inspectorBar'
  //   ],
  //   { editMode: 'Trim' }
  // );
  // #endregion
  // #region Inspector bar - Crop mode
  // Crop mode inspector bar
  // cesdk.ui.setInspectorBarOrder(
  //   [
  //     'ly.img.spacer',
  //     'ly.img.cropControls.inspectorBar',
  //     'ly.img.spacer'
  //   ],
  //   { editMode: 'Crop' }
  // );
  // #endregion
}
