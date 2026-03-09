/**
 * Feature Configuration - Enable/Disable Editor Capabilities
 *
 * This file configures which features are available in the video editor.
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
 * Configure which features are enabled in the video editor.
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
    'ly.img.navigation.bar' /* Navigation Bar visibility */,
    'ly.img.navigation.back' /* "Back" button */,
    'ly.img.navigation.close' /* "Close" button */,
    'ly.img.navigation.undoRedo' /* "Undo" and "Redo" buttons */,
    'ly.img.navigation.zoom' /* Zoom controls */,
    'ly.img.navigation.actions' /* Actions dropdown */,
    // #endregion

    // ============================================================================
    // TEXT FEATURES
    // Configure text editing capabilities
    // ============================================================================

    // #region Text Features
    'ly.img.text.edit' /* Edit button in Canvas Menu */,
    'ly.img.text.typeface' /* Typeface dropdown */,
    'ly.img.text.fontSize' /* Font Size input */,
    'ly.img.text.fontStyle' /* Bold and Italic toggles */,
    'ly.img.text.alignment' /* Text Horizontal Alignment */,
    'ly.img.text.advanced' /* Advanced text controls */,
    'ly.img.text.background' /* Text background controls */,
    // #endregion

    // ============================================================================
    // CROP FEATURES
    // Configure image and video cropping capabilities
    // ============================================================================

    // #region Crop Features
    'ly.img.crop' /* Crop button */,
    'ly.img.crop.size' /* Crop size controls */,
    'ly.img.crop.rotation' /* Crop rotation controls */,
    'ly.img.crop.flip' /* Crop flip controls */,
    'ly.img.crop.fillMode' /* Crop fill mode controls */,
    'ly.img.crop.scale' /* Crop scale controls */,
    'ly.img.crop.position' /* Crop position controls */,
    'ly.img.crop.panel.autoOpen' /* Auto-open crop panel on crop mode */,
    // #endregion

    // ============================================================================
    // TRANSFORM FEATURES
    // Configure block position, size, and rotation controls
    // ============================================================================

    // #region Transform Features
    'ly.img.transform.position' /* X and Y position controls */,
    'ly.img.transform.size' /* Width and height controls */,
    'ly.img.transform.rotation' /* Rotation controls */,
    'ly.img.transform.flip' /* Flip controls */,
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
    'ly.img.cutout' /* Cutout controls */,
    // #endregion

    // ============================================================================
    // CANVAS FEATURES
    // Configure the canvas area and context menu
    // ============================================================================

    // #region Canvas Features
    'ly.img.canvas.bar' /* Canvas Bar visibility */,
    'ly.img.canvas.menu' /* Canvas Menu visibility */,
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
    'ly.img.replace' /* Replace button in Canvas Menu and Fill Panel */,
    'ly.img.replace.fill' /* Replace image/video fill content */,
    'ly.img.replace.shape' /* Replace block shape */,
    'ly.img.replace.audio' /* Replace audio block content */,
    // #endregion

    // ============================================================================
    // PAGE FEATURES
    // Configure page functionality (used for multi-page video compositions)
    // ============================================================================

    // #region Page Features
    'ly.img.page.move' /* Move Up/Down/Left/Right buttons */,
    'ly.img.page.add' /* Add Page button in Canvas Bar */,
    'ly.img.page.resize' /* Resize button and page formats */,
    // #endregion

    // ============================================================================
    // STYLING FEATURES
    // Configure block appearance options
    // ============================================================================

    // #region Styling Features
    'ly.img.fill' /* Fill button and Fill Panel */,
    'ly.img.stroke' /* Stroke controls (Color, Width) */,
    'ly.img.opacity' /* Opacity controls */,
    'ly.img.blendMode' /* Blend mode controls */,
    'ly.img.shape.options' /* Shape Options dropdown */,
    'ly.img.combine' /* Combine dropdown (shapes/cutouts) */,
    'ly.img.position' /* Position dropdown */,
    'ly.img.trim' /* Trim button (video/audio mode) */,
    // #endregion

    // ============================================================================
    // NOTIFICATION FEATURES
    // Configure user feedback notifications
    // ============================================================================

    // #region Notification Features
    'ly.img.notifications' /* Global notifications visibility */,
    'ly.img.notifications.undo' /* Undo notifications */,
    'ly.img.notifications.redo' /* Redo notifications */,
    // #endregion

    // ============================================================================
    // DOCK AND LIBRARY FEATURES
    // Configure the asset dock and library panels
    // ============================================================================

    // #region Dock and Library Features
    'ly.img.dock' /* Dock visibility */,
    'ly.img.library.panel' /* Asset Library panel */,
    // #endregion

    // ============================================================================
    // VIDEO FEATURES
    // Configure video editing capabilities including timeline and controls
    // ============================================================================

    // #region Video Features
    'ly.img.video.timeline' /* Video Timeline visibility */,
    'ly.img.video.clips' /* Clips track in timeline */,
    'ly.img.video.overlays' /* Overlays track in timeline */,
    'ly.img.video.audio' /* Audio track in timeline */,
    'ly.img.video.addClip' /* Add clips to timeline */,
    'ly.img.video.controls' /* Base video control UI */,
    'ly.img.video.controls.toggle' /* Timeline collapse/expand toggle */,
    'ly.img.video.controls.background' /* Background color controls */,
    'ly.img.video.controls.playback' /* Play/pause and timestamp */,
    'ly.img.video.controls.loop' /* Loop toggle */,
    'ly.img.video.controls.split' /* Split clip control */,
    'ly.img.video.controls.timelineZoom' /* Timeline zoom controls */,
    'ly.img.video.caption' /* Video captions */,
    // #endregion

    // ============================================================================
    // MEDIA CONTROLS
    // Configure audio and video playback controls
    // ============================================================================

    // #region Media Controls
    'ly.img.audio.replace' /* Replace audio track */,
    'ly.img.volume' /* Volume control */,
    'ly.img.playbackSpeed' /* Playback speed control */,
    // #endregion

    // ============================================================================
    // ANIMATIONS
    // Configure animation capabilities for video elements
    // ============================================================================

    // #region Animations
    'ly.img.animations' /* Animations button */
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
    // DEVELOPMENT FEATURES
    // Uncomment for development and debugging
    // ============================================================================

    // #region Development Features
    // 'ly.img.settings', /* Quick settings menu for development */
    // #endregion
  ]);
}
