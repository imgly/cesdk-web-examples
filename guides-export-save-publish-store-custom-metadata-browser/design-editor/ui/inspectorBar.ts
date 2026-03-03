/**
 * Inspector Bar Configuration - Contextual Toolbar for Selected Elements
 *
 * Configure the inspector bar that appears above selected blocks.
 * Different edit modes show different controls.
 *
 * ## Edit Modes
 *
 * - `'Transform'`: Default mode - shows full editing controls
 * - `'Text'`: Text editing - shows text formatting controls
 * - `'Crop'`: Crop mode - shows crop controls
 * - `'Trim'`: Trim mode - shows trim controls for video/audio
 *
 * ## Available Components
 *
 * **Text:**
 * - `'ly.img.text.typeFace.inspectorBar'` - Font family selector
 * - `'ly.img.text.style.inspectorBar'` - Font style (weight/italic)
 * - `'ly.img.text.bold.inspectorBar'` - Bold toggle
 * - `'ly.img.text.italic.inspectorBar'` - Italic toggle
 * - `'ly.img.text.fontSize.inspectorBar'` - Font size control
 * - `'ly.img.text.alignHorizontal.inspectorBar'` - Text alignment
 * - `'ly.img.text.advanced.inspectorBar'` - Advanced text options
 * - `'ly.img.text.background.inspectorBar'` - Text background color
 *
 * **Media:**
 * - `'ly.img.trim.inspectorBar'` - Trim button for video/audio
 * - `'ly.img.volume.inspectorBar'` - Volume control
 * - `'ly.img.crop.inspectorBar'` - Crop button
 * - `'ly.img.video.caption.inspectorBar'` - Video captions
 * - `'ly.img.audio.replace.inspectorBar'` - Replace audio
 * - `'ly.img.animations.inspectorBar'` - Animation controls
 *
 * **Effects:**
 * - `'ly.img.adjustment.inspectorBar'` - Color adjustments
 * - `'ly.img.filter.inspectorBar'` - Photo filters
 * - `'ly.img.effect.inspectorBar'` - Visual effects
 * - `'ly.img.blur.inspectorBar'` - Blur effect
 * - `'ly.img.shadow.inspectorBar'` - Drop shadow
 *
 * **Styling:**
 * - `'ly.img.fill.inspectorBar'` - Fill color
 * - `'ly.img.stroke.inspectorBar'` - Stroke/border
 * - `'ly.img.opacityOptions.inspectorBar'` - Opacity and blend mode
 *
 * **Layout:**
 * - `'ly.img.position.inspectorBar'` - Position and size
 * - `'ly.img.combine.inspectorBar'` - Boolean operations
 * - `'ly.img.group.create.inspectorBar'` - Create group
 * - `'ly.img.group.ungroup.inspectorBar'` - Ungroup
 *
 * **Shapes:**
 * - `'ly.img.shape.options.inspectorBar'` - Shape-specific options
 * - `'ly.img.cutout.type.inspectorBar'` - Cutout shape type
 * - `'ly.img.cutout.offset.inspectorBar'` - Cutout offset
 * - `'ly.img.cutout.smoothing.inspectorBar'` - Cutout smoothing
 *
 * **Special Controls:**
 * - `'ly.img.inspectorToggle.inspectorBar'` - Toggle inspector panel
 * - `'ly.img.trimControls.inspectorBar'` - Trim mode controls
 * - `'ly.img.cropControls.inspectorBar'` - Crop mode controls
 *
 * **Layout:**
 * - `'ly.img.spacer'` - Flexible spacer
 * - `'ly.img.separator'` - Visual separator
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/inspector-bar-8ca1cd/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the inspector bar layout for different edit modes.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupInspectorBar(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // INSPECTOR BAR - TRANSFORM MODE
  // Full editing controls for selected blocks
  // ============================================================================

  // #region Inspector Bar - Transform Mode
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.inspector.bar', when: { editMode: 'Transform' } },
    [
      'ly.img.spacer',

      // ============================
      // Media Controls
      // ============================
      'ly.img.video.caption.inspectorBar',

      // ============================
      // Shape Controls
      // ============================
      'ly.img.shape.options.inspectorBar',
      'ly.img.cutout.type.inspectorBar',
      'ly.img.cutout.offset.inspectorBar',
      'ly.img.cutout.smoothing.inspectorBar',

      // ============================
      // Group Management
      // ============================
      'ly.img.group.create.inspectorBar',
      'ly.img.group.ungroup.inspectorBar',
      'ly.img.audio.replace.inspectorBar',
      'ly.img.separator',

      // ============================
      // Text Formatting
      // ============================
      'ly.img.text.typeFace.inspectorBar',
      'ly.img.text.style.inspectorBar',
      'ly.img.text.bold.inspectorBar',
      'ly.img.text.italic.inspectorBar',
      'ly.img.text.fontSize.inspectorBar',
      'ly.img.text.alignHorizontal.inspectorBar',
      'ly.img.text.advanced.inspectorBar',
      'ly.img.combine.inspectorBar',
      'ly.img.separator',

      // ============================
      // Appearance
      // ============================
      'ly.img.fill.inspectorBar',
      'ly.img.trim.inspectorBar',
      'ly.img.volume.inspectorBar',
      'ly.img.crop.inspectorBar',
      'ly.img.separator',
      'ly.img.stroke.inspectorBar',
      'ly.img.separator',
      'ly.img.text.background.inspectorBar',
      'ly.img.separator',

      // ============================
      // Animations
      // ============================
      'ly.img.animations.inspectorBar',
      'ly.img.separator',

      // ============================
      // Effects
      // ============================
      {
        id: 'ly.img.appearance.inspectorBar',
        children: [
          'ly.img.adjustment.inspectorBar',
          'ly.img.filter.inspectorBar',
          'ly.img.effect.inspectorBar',
          'ly.img.blur.inspectorBar'
        ]
      },
      'ly.img.separator',
      'ly.img.shadow.inspectorBar',
      'ly.img.separator',

      // ============================
      // Properties
      // ============================
      'ly.img.opacityOptions.inspectorBar',
      'ly.img.separator',
      'ly.img.position.inspectorBar',
      'ly.img.spacer',
      'ly.img.separator',
      'ly.img.inspectorToggle.inspectorBar'
    ]
  );
  // #endregion

  // ============================================================================
  // INSPECTOR BAR - TRIM MODE
  // Controls for trimming video/audio clips
  // ============================================================================

  // #region Inspector Bar - Trim Mode
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.inspector.bar', when: { editMode: 'Trim' } },
    ['ly.img.spacer', 'ly.img.trimControls.inspectorBar', 'ly.img.spacer']
  );
  // #endregion

  // ============================================================================
  // INSPECTOR BAR - CROP MODE
  // Controls for cropping images
  // ============================================================================

  // #region Inspector Bar - Crop Mode
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.inspector.bar', when: { editMode: 'Crop' } },
    ['ly.img.spacer', 'ly.img.cropControls.inspectorBar', 'ly.img.spacer']
  );
  // #endregion
}
