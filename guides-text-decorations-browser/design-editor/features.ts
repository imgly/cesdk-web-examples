/**
 * Feature Configuration - Enable/Disable Editor Capabilities
 *
 * This file configures which features are available in the design editor.
 * Features control the visibility and availability of UI elements and functionality.
 *
 * ## Feature System Overview
 *
 * - `cesdk.feature.enable(features)` - Enable features with default predicates
 * - `cesdk.feature.disable(features)` - Disable features completely
 * - `cesdk.feature.set(feature, predicate)` - Set custom predicate for conditional availability
 *
 * ## Glob Pattern Support
 *
 * Use glob patterns to enable/disable entire feature groups:
 * - `'ly.img.text.*'` - All text features
 * - `'ly.img.crop.*'` - All crop features
 * - `'ly.img.video.*'` - All video features
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/disable-or-enable-f058e2/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure which features are enabled in the design editor.
 *
 * Features are organized by category for easy customization.
 * Uncomment or add features as needed for your use case.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupFeatures(cesdk: CreativeEditorSDK): void {
  cesdk.feature.enable([
    // ============================================================================
    // NAVIGATION FEATURES
    // Configure the top navigation bar visibility and controls
    // ============================================================================

    // #region Navigation Features
    'ly.img.navigation' /* Enables all children below */,
    // 'ly.img.navigation.bar', /* Navigation Bar visibility */
    // 'ly.img.navigation.back', /* "Back" button */
    // 'ly.img.navigation.close', /* "Close" button */
    // 'ly.img.navigation.undoRedo', /* "Undo" and "Redo" buttons */
    // 'ly.img.navigation.zoom', /* Zoom controls */
    // 'ly.img.navigation.actions', /* Actions dropdown */
    // 'ly.img.navigation.documentSettings', /* Document settings button */
    // #endregion

    // ============================================================================
    // TEXT FEATURES
    // Configure text editing capabilities
    // ============================================================================

    // #region Text Features
    'ly.img.text' /* Enables all children below */,
    // 'ly.img.text.edit', /* Edit button in Canvas Menu */
    // 'ly.img.text.typeface', /* Typeface dropdown */
    // 'ly.img.text.fontSize', /* Font Size input */
    // 'ly.img.text.fontStyle', /* Bold and Italic toggles */
    // 'ly.img.text.decoration', /* Underline and Strikethrough toggles */
    // 'ly.img.text.alignment', /* Text Horizontal Alignment */
    // 'ly.img.text.list', /* List style (bullets/numbered) */
    // 'ly.img.text.list.unordered', /* Bulleted list */
    // 'ly.img.text.list.ordered', /* Numbered list */
    // 'ly.img.text.advanced', /* Advanced text controls */
    // 'ly.img.text.background', /* Text background controls */
    // #endregion

    // ============================================================================
    // CROP FEATURES
    // Configure image and block cropping capabilities
    // ============================================================================

    // #region Crop Features
    'ly.img.crop' /* Enables all children below */,
    // 'ly.img.crop.size', /* Crop size controls */
    // 'ly.img.crop.rotation', /* Crop rotation controls */
    // 'ly.img.crop.flip', /* Crop flip controls */
    // 'ly.img.crop.fillMode', /* Crop fill mode controls */
    // 'ly.img.crop.scale', /* Crop scale controls */
    // 'ly.img.crop.position', /* Crop position controls */
    // 'ly.img.crop.panel.autoOpen', /* Auto-open crop panel on crop mode */
    // #endregion

    // ============================================================================
    // TRANSFORM FEATURES
    // Configure block position, size, and rotation controls
    // ============================================================================

    // #region Transform Features
    'ly.img.transform' /* Enables all children below */,
    // 'ly.img.transform.position', /* X and Y position controls */
    // 'ly.img.transform.size', /* Width and height controls */
    // 'ly.img.transform.rotation', /* Rotation controls */
    // 'ly.img.transform.flip', /* Flip controls */
    // #endregion

    // ============================================================================
    // EFFECTS FEATURES
    // Configure visual effects and adjustments
    // ============================================================================

    // #region Effects Features
    'ly.img.filter' /* Filter button */,
    'ly.img.adjustment' /* Adjustments button */,
    'ly.img.effect' /* Effect button */,
    'ly.img.blur' /* Blur button */,
    'ly.img.shadow' /* Shadow button */,
    // 'ly.img.shadow.color', /* Shadow color picker */
    // 'ly.img.shadow.offset', /* Shadow angle and distance */
    // 'ly.img.shadow.blur', /* Shadow blur radius */
    'ly.img.cutout' /* Cutout controls */,
    // #endregion

    // ============================================================================
    // CANVAS FEATURES
    // Configure the canvas area and context menu
    // ============================================================================

    // #region Canvas Features
    'ly.img.canvas' /* Enables all children below */,
    // 'ly.img.canvas.bar', /* Canvas Bar visibility */
    // 'ly.img.canvas.menu', /* Canvas Menu visibility */
    // #endregion

    // ============================================================================
    // INSPECTOR FEATURES
    // Configure the inspector panel and toolbar
    // ============================================================================

    // #region Inspector Features
    'ly.img.inspector' /* Inspector visibility */,
    'ly.img.inspector.bar' /* Inspector Bar visibility */,
    'ly.img.inspector.toggle' /* Inspector Toggle button */,
    // #endregion

    // ============================================================================
    // GENERAL EDITING FEATURES
    // Configure common editing operations
    // ============================================================================

    // #region General Editing Features
    'ly.img.delete' /* Delete button and keyboard shortcut */,
    'ly.img.duplicate' /* Duplicate button and copy/paste */,
    'ly.img.group' /* Group and Ungroup buttons */,
    // 'ly.img.group.create', /* Group multiple blocks */
    // 'ly.img.group.ungroup', /* Dissolve group */
    // 'ly.img.group.enter', /* Enter group for editing */
    // 'ly.img.group.select', /* Select parent group */
    'ly.img.replace' /* Enables all children below */,
    // 'ly.img.replace.fill', /* Replace image/video fill content */
    // 'ly.img.replace.shape', /* Replace block shape */
    // 'ly.img.replace.audio', /* Replace audio block content */
    // #endregion

    // ============================================================================
    // PAGE FEATURES
    // Configure multi-page functionality
    // ============================================================================

    // #region Page Features
    'ly.img.page' /* Enables all page children below */,
    // 'ly.img.page.move', /* Move Up/Down/Left/Right buttons */
    // 'ly.img.page.add', /* Add Page button in Canvas Bar */
    // 'ly.img.page.resize', /* Resize button and page formats */
    // 'ly.img.page.settings', /* Read-only page dimensions, unit, and resolution */
    // 'ly.img.page.bleedMargin', /* Bleed margin controls */
    // 'ly.img.page.clipContent', /* Clip content on/off toggle */
    // #endregion

    // ============================================================================
    // SCENE FEATURES
    // Configure scene layout options
    // ============================================================================

    // #region Scene Features
    'ly.img.scene.layout' /* Enables all children below */,
    // 'ly.img.scene.layout.horizontal', /* Horizontal layout toggle */
    // 'ly.img.scene.layout.vertical', /* Vertical layout toggle */
    // 'ly.img.scene.layout.free', /* Free layout toggle */
    // #endregion

    // ============================================================================
    // STYLING FEATURES
    // Configure block appearance options
    // ============================================================================

    // #region Styling Features
    // 'ly.img.fill' /* Fill button and Fill Panel */,
    'ly.img.fill.color' /* Solid and gradient fill controls */,
    'ly.img.fill.image' /* Image fill controls and crop */,
    // 'ly.img.fill.video', /* Video fill, trim, volume, speed */
    'ly.img.stroke' /* Stroke controls (Color, Width) */,
    // 'ly.img.stroke.color', /* Stroke color picker */
    // 'ly.img.stroke.width', /* Stroke width input */
    // 'ly.img.stroke.style', /* Stroke style (dash) selector */
    // 'ly.img.stroke.position', /* Inner/center/outer selector */
    // 'ly.img.stroke.cornerGeometry', /* Corner join geometry */
    'ly.img.opacity' /* Opacity controls */,
    'ly.img.blendMode' /* Blend mode controls */,
    'ly.img.shape.options' /* Shape Options dropdown */,
    // 'ly.img.shape.edit', /* Edit Path button in Shape Options (advanced editors only) */
    // 'ly.img.vectorEdit', /* Vector edit controls (parent) */
    // 'ly.img.vectorEdit.moveMode', /* Move/select mode toggle */
    // 'ly.img.vectorEdit.addMode', /* Add node mode toggle */
    // 'ly.img.vectorEdit.deleteMode', /* Delete node mode toggle */
    // 'ly.img.vectorEdit.bendMode', /* Bend mode toggle */
    // 'ly.img.vectorEdit.mirrorMode', /* Handle mirror mode dropdown */
    // 'ly.img.vectorEdit.done', /* Exit vector edit button */
    // 'ly.img.shape.options.cornerRadius', /* Corner radius (rect/polygon) */
    // 'ly.img.shape.options.points', /* Star point count */
    // 'ly.img.shape.options.innerDiameter', /* Star inner diameter */
    // 'ly.img.shape.options.sides', /* Polygon side count */
    // 'ly.img.shape.options.lineWidth', /* Line stroke width */
    'ly.img.combine' /* Combine dropdown (shapes/cutouts) */,
    // 'ly.img.combine.union', /* Union boolean operation */
    // 'ly.img.combine.subtract', /* Subtract boolean operation */
    // 'ly.img.combine.intersect', /* Intersect boolean operation */
    // 'ly.img.combine.exclude', /* Exclude/XOR boolean operation */
    'ly.img.position' /* Position dropdown */,
    // 'ly.img.position.arrange', /* Bring forward/backward/front/back */
    // 'ly.img.position.align', /* Align left/right/center/top/bottom */
    // 'ly.img.position.distribute', /* Distribute vertically/horizontally */
    'ly.img.trim' /* Trim button (video mode) */,
    // #endregion

    // ============================================================================
    // NOTIFICATION FEATURES
    // Configure user feedback notifications
    // ============================================================================

    // #region Notification Features
    'ly.img.notifications' /* Enables all children below */,
    // 'ly.img.notifications.undo', /* Undo notifications */
    // 'ly.img.notifications.redo', /* Redo notifications */
    // #endregion

    // ============================================================================
    // DOCK AND LIBRARY FEATURES
    // Configure the asset dock and library panels
    // ============================================================================

    // #region Dock and Library Features
    'ly.img.dock' /* Dock visibility */,
    'ly.img.library.panel' /* Asset Library panel */
    // #endregion

    // ============================================================================
    // PLACEHOLDER FEATURES
    // Uncomment to enable template placeholder functionality
    // ============================================================================

    // #region Placeholder Features
    // 'ly.img.placeholder', /* Placeholder button in Canvas Menu */
    // 'ly.img.placeholder.general', /* General section (opacity, blend, etc.) */
    // 'ly.img.placeholder.general.opacity', /* Opacity option */
    // 'ly.img.placeholder.general.blendMode', /* Blend Mode option */
    // 'ly.img.placeholder.general.duplicate', /* Duplicate option */
    // 'ly.img.placeholder.general.delete', /* Delete option */
    // 'ly.img.placeholder.arrange', /* Arrange section */
    // 'ly.img.placeholder.arrange.move', /* Move option */
    // 'ly.img.placeholder.arrange.resize', /* Resize option */
    // 'ly.img.placeholder.arrange.rotate', /* Rotate option */
    // 'ly.img.placeholder.arrange.flip', /* Flip option */
    // 'ly.img.placeholder.fill', /* Fill section */
    // 'ly.img.placeholder.fill.change', /* Change Fill option */
    // 'ly.img.placeholder.fill.changeType', /* Change Fill Type option */
    // 'ly.img.placeholder.fill.actAsPlaceholder', /* Act as Placeholder option */
    // 'ly.img.placeholder.fill.crop', /* Crop option */
    // 'ly.img.placeholder.shape', /* Shape section */
    // 'ly.img.placeholder.shape.change', /* Change Shape option */
    // 'ly.img.placeholder.stroke', /* Stroke section */
    // 'ly.img.placeholder.stroke.change', /* Change Stroke option */
    // 'ly.img.placeholder.text', /* Text section */
    // 'ly.img.placeholder.text.edit', /* Edit Text option */
    // 'ly.img.placeholder.text.actAsPlaceholder', /* Act as Placeholder option */
    // 'ly.img.placeholder.text.character', /* Character option */
    // 'ly.img.placeholder.appearance', /* Appearance section */
    // 'ly.img.placeholder.appearance.adjustments', /* Adjustments option */
    // 'ly.img.placeholder.appearance.filter', /* Filter option */
    // 'ly.img.placeholder.appearance.effect', /* Effect option */
    // 'ly.img.placeholder.appearance.blur', /* Blur option */
    // 'ly.img.placeholder.appearance.shadow', /* Shadow option */
    // 'ly.img.placeholder.appearance.animations', /* Animations option */
    // 'ly.img.preview', /* Preview button (Creator role only) */
    // #endregion

    // ============================================================================
    // VIDEO FEATURES
    // Uncomment to enable video editing functionality
    // ============================================================================

    // #region Video Features
    // 'ly.img.video.timeline', /* Video Timeline visibility */
    // 'ly.img.video.timeline.ruler', /* Timeline ruler/time scale */
    // 'ly.img.video.clips', /* Clips track in timeline */
    // 'ly.img.video.overlays', /* Overlays track in timeline */
    // 'ly.img.video.audio', /* Audio track in timeline */
    // 'ly.img.video.addClip', /* Add clips to timeline */
    // 'ly.img.video.controls', /* Base video control UI */
    // 'ly.img.video.controls.toggle', /* Timeline collapse/expand toggle */
    // 'ly.img.video.controls.background', /* Background color controls */
    // 'ly.img.video.controls.playback', /* Play/pause and timestamp */
    // 'ly.img.video.controls.loop', /* Loop toggle */
    // 'ly.img.video.controls.split', /* Split clip control */
    // 'ly.img.video.controls.timelineZoom', /* Timeline zoom controls */
    // 'ly.img.video.caption', /* Video captions */
    // 'ly.img.volume', /* Volume control (video mode) */
    // 'ly.img.playbackSpeed', /* Playback speed control */
    // 'ly.img.animations', /* Animations button (video mode) */
    // #endregion

    // ============================================================================
    // DEVELOPMENT FEATURES
    // Uncomment for development and debugging
    // ============================================================================

    // #region Development Features
    // 'ly.img.settings', /* Quick settings menu for development */
    // #endregion

    // ============================================================================
    // GRID & RULERS
    // Uncomment to enable rulers and grid overlay
    // ============================================================================

    // 'ly.img.rulers', /* Grid overlay, snap-to-grid, and canvas rulers */
  ]);
}
