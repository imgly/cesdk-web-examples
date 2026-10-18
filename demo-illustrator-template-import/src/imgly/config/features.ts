/**
 * Feature Configuration - Enable/Disable Advanced Editor Capabilities
 *
 * This file configures which features are available in the advanced editor.
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
 * - `'ly.img.placeholder.*'` - All placeholder features
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/disable-or-enable-f058e2/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure which features are enabled in the advanced editor.
 *
 * Enables all professional editing features for power users.
 * Features are organized by category for easy customization.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupFeatures(cesdk: CreativeEditorSDK): void {
  cesdk.feature.enable([
    'ly.img.adjustment' /* Adjustments button (brightness, contrast, saturation, etc.) */,

    // 'ly.img.animations', /* Animations button (video mode) */

    'ly.img.blendMode' /* Blend mode controls */,

    'ly.img.blur' /* Blur button */,

    // 'ly.img.canvas', /* Enables all children below */
    'ly.img.canvas.bar' /* Canvas Bar visibility */,
    'ly.img.canvas.menu' /* Canvas Menu visibility */,

    // 'ly.img.combine', /* Combine dropdown (shapes/cutouts) */
    'ly.img.combine.exclude' /* Exclude/XOR boolean operation */,
    'ly.img.combine.intersect' /* Intersect boolean operation */,
    'ly.img.combine.subtract' /* Subtract boolean operation */,
    'ly.img.combine.union' /* Union boolean operation */,

    // 'ly.img.crop', /* Enables all children below */
    'ly.img.crop.fillAlignment' /* Crop fill alignment controls */,
    'ly.img.crop.fillMode' /* Crop fill mode controls */,
    'ly.img.crop.flip' /* Crop flip controls */,
    'ly.img.crop.panel.autoOpen' /* Auto-open crop panel on crop mode */,
    'ly.img.crop.position' /* Crop position controls */,
    'ly.img.crop.rotation' /* Crop rotation controls */,
    'ly.img.crop.scale' /* Crop scale controls */,
    'ly.img.crop.size' /* Crop size controls */,

    'ly.img.cutout' /* Cutout controls for background removal */,

    'ly.img.delete' /* Delete button and keyboard shortcut */,

    'ly.img.dock' /* Dock visibility */,

    'ly.img.duplicate' /* Duplicate button and copy/paste */,

    'ly.img.effect' /* Effect button */,

    // 'ly.img.fill', /* Fill button and Fill Panel */
    // 'ly.img.fill.color', /* Solid and gradient fill controls */
    'ly.img.fill.color.library' /* Swatch library */,
    // 'ly.img.fill.color.picker', /* Color picker body (hue/saturation, hex, RGB/CMYK) */
    'ly.img.fill.color.picker.gradient' /* Gradient mode selector and stops editor */,
    'ly.img.fill.color.picker.opacity' /* Alpha/opacity slider */,
    'ly.img.fill.image' /* Image fill controls and crop */,
    // 'ly.img.fill.video', /* Video fill, trim, volume, speed */

    'ly.img.filter' /* Filter button */,

    // 'ly.img.group', /* Group and Ungroup buttons */
    'ly.img.group.create' /* Group multiple blocks */,
    'ly.img.group.enter' /* Enter group for editing */,
    'ly.img.group.select' /* Select parent group */,
    'ly.img.group.ungroup' /* Dissolve group */,

    // 'ly.img.inspector', /* Inspector visibility */
    'ly.img.inspector.bar' /* Inspector Bar visibility (contextual toolbar) */,
    'ly.img.inspector.toggle' /* Inspector Toggle button */,

    'ly.img.keyboard.shortcuts' /* Enable keyboard shortcuts */,

    'ly.img.library.panel' /* Asset Library panel */,

    // 'ly.img.navigation', /* Enables all children below */
    'ly.img.navigation.actions' /* Actions dropdown */,
    'ly.img.navigation.back' /* "Back" button */,
    'ly.img.navigation.bar' /* Navigation Bar visibility */,
    'ly.img.navigation.close' /* "Close" button */,
    // 'ly.img.navigation.documentSettings', /* Document settings button */
    'ly.img.navigation.undoRedo' /* "Undo" and "Redo" buttons */,
    'ly.img.navigation.zoom' /* Zoom controls */,

    // 'ly.img.notifications', /* Enables all children below */
    'ly.img.notifications.redo' /* Redo notifications */,
    'ly.img.notifications.undo' /* Undo notifications */,

    'ly.img.opacity' /* Opacity controls */,

    // 'ly.img.page', /* Enables all children below */
    'ly.img.page.add' /* Add Page button in Canvas Bar */,
    'ly.img.page.bleedMargin' /* Bleed margin controls */,
    'ly.img.page.clipContent' /* Clip content on/off toggle */,
    'ly.img.page.move' /* Move Up/Down/Left/Right buttons */,
    'ly.img.page.resize' /* Resize button and page formats */,
    'ly.img.page.settings' /* Read-only page dimensions, unit, and resolution */,

    // 'ly.img.placeholder', /* Enables all children below */
    // 'ly.img.placeholder.appearance', /* Appearance section */
    'ly.img.placeholder.appearance.adjustments' /* Adjustments option */,
    // 'ly.img.placeholder.appearance.animations', /* Animations option */
    'ly.img.placeholder.appearance.blur' /* Blur option */,
    'ly.img.placeholder.appearance.effect' /* Effect option */,
    'ly.img.placeholder.appearance.filter' /* Filter option */,
    'ly.img.placeholder.appearance.shadow' /* Shadow option */,
    // 'ly.img.placeholder.arrange', /* Arrange section */
    'ly.img.placeholder.arrange.flip' /* Flip option */,
    'ly.img.placeholder.arrange.move' /* Move option */,
    'ly.img.placeholder.arrange.resize' /* Resize option */,
    'ly.img.placeholder.arrange.rotate' /* Rotate option */,
    // 'ly.img.placeholder.audio', /* Audio section */
    // 'ly.img.placeholder.audio.change', /* Replace Audio option */
    // 'ly.img.placeholder.fill', /* Fill section */
    'ly.img.placeholder.fill.actAsPlaceholder' /* Act as Placeholder option */,
    'ly.img.placeholder.fill.change' /* Change Fill option */,
    'ly.img.placeholder.fill.changeType' /* Change Fill Type option */,
    'ly.img.placeholder.fill.crop' /* Crop option */,
    // 'ly.img.placeholder.general', /* General section (opacity, blend, etc.) */
    'ly.img.placeholder.general.blendMode' /* Blend Mode option */,
    'ly.img.placeholder.general.delete' /* Delete option */,
    'ly.img.placeholder.general.duplicate' /* Duplicate option */,
    'ly.img.placeholder.general.opacity' /* Opacity option */,
    // 'ly.img.placeholder.shape', /* Shape section */
    'ly.img.placeholder.shape.change' /* Change Shape option */,
    // 'ly.img.placeholder.stroke', /* Stroke section */
    'ly.img.placeholder.stroke.change' /* Change Stroke option */,
    // 'ly.img.placeholder.text', /* Text section */
    'ly.img.placeholder.text.actAsPlaceholder' /* Act as Placeholder option */,
    'ly.img.placeholder.text.character' /* Character option */,
    'ly.img.placeholder.text.edit' /* Edit Text option */,

    // 'ly.img.playbackSpeed', /* Playback speed control */

    // 'ly.img.position', /* Position dropdown (layer ordering) */
    'ly.img.position.align' /* Align left/right/center/top/bottom */,
    'ly.img.position.arrange' /* Bring forward/backward/front/back */,
    'ly.img.position.distribute' /* Distribute vertically/horizontally */,

    // 'ly.img.preview', /* Preview button (Creator role only) */

    // 'ly.img.replace', /* Enables all children below */
    'ly.img.replace.audio' /* Replace audio block content */,
    'ly.img.replace.fill' /* Replace image/video fill content */,
    'ly.img.replace.shape' /* Replace block shape */,

    'ly.img.rulers' /* Grid overlay, snap-to-grid, and canvas rulers */,

    // 'ly.img.scene.fontSizeUnit', /* Font size unit selector in page resize panel */
    // 'ly.img.scene.layout', /* Enables all children below */
    'ly.img.scene.layout.free' /* Free layout toggle in page layout controls */,
    'ly.img.scene.layout.horizontal' /* Horizontal layout toggle */,
    'ly.img.scene.layout.spacing' /* Gap + screen-space toggle for stacked layouts */,
    'ly.img.scene.layout.vertical' /* Vertical layout toggle */,

    // 'ly.img.settings', /* Quick settings menu for development */

    // 'ly.img.shadow', /* Shadow button */
    'ly.img.shadow.blur' /* Shadow blur radius */,
    // 'ly.img.shadow.color', /* Shadow color picker */
    'ly.img.shadow.color.library' /* Swatch library */,
    // 'ly.img.shadow.color.picker', /* Color picker body (hue/saturation, hex, RGB/CMYK) */
    'ly.img.shadow.color.picker.opacity' /* Alpha/opacity slider */,
    'ly.img.shadow.offset' /* Shadow angle and distance */,

    'ly.img.shape.edit' /* Edit Path button in Shape Options */,
    // 'ly.img.shape.options', /* Shape Options dropdown */
    'ly.img.shape.options.cornerRadius' /* Corner radius (rect/polygon) */,
    'ly.img.shape.options.innerDiameter' /* Star inner diameter */,
    'ly.img.shape.options.lineWidth' /* Line stroke width */,
    'ly.img.shape.options.points' /* Star point count */,
    'ly.img.shape.options.sides' /* Polygon side count */,

    // 'ly.img.stroke', /* Stroke controls (Color, Width) */
    'ly.img.stroke.cap' /* Stroke end caps (start/end) */,
    // 'ly.img.stroke.color', /* Stroke color picker */
    'ly.img.stroke.color.library' /* Swatch library */,
    // 'ly.img.stroke.color.picker', /* Color picker body (hue/saturation, hex, RGB/CMYK) */
    'ly.img.stroke.color.picker.opacity' /* Alpha/opacity slider */,
    'ly.img.stroke.cornerGeometry' /* Corner join geometry */,
    'ly.img.stroke.dash' /* Custom dash pattern controls */,
    'ly.img.stroke.position' /* Inner/center/outer selector */,
    'ly.img.stroke.style' /* Stroke style (dash) selector */,
    'ly.img.stroke.width' /* Stroke width input */,

    // 'ly.img.text', /* Enables all children below */
    'ly.img.text.advanced' /* Advanced text controls */,
    'ly.img.text.alignment' /* Text Horizontal Alignment */,
    // 'ly.img.text.background', /* Text background controls */
    'ly.img.text.background.library' /* Swatch library */,
    // 'ly.img.text.background.picker', /* Color picker body (hue/saturation, hex, RGB/CMYK) */
    'ly.img.text.background.picker.opacity' /* Alpha/opacity slider */,
    'ly.img.text.decoration' /* Underline and Strikethrough toggles */,
    'ly.img.text.edit' /* Edit button in Canvas Menu */,
    'ly.img.text.fontSize' /* Font Size input */,
    'ly.img.text.fontStyle' /* Bold and Italic toggles */,
    // 'ly.img.text.list', /* List style (bullets/numbered) */
    'ly.img.text.list.ordered' /* Numbered list */,
    'ly.img.text.list.unordered' /* Bulleted list */,
    // 'ly.img.text.path', /* Text on a path / circle */
    'ly.img.text.path.curve' /* Curve picker */,
    'ly.img.text.path.direction' /* Direction control */,
    'ly.img.text.path.edit' /* Edit Path button (requires ly.img.vectorEdit) */,
    'ly.img.text.path.offset' /* Offset slider */,
    'ly.img.text.path.position' /* Path Position control */,
    'ly.img.text.styles' /* Styles button (style presets) in Canvas Menu */,
    'ly.img.text.typeface' /* Typeface dropdown */,

    // 'ly.img.transform', /* Enables all children below */
    'ly.img.transform.flip' /* Flip controls */,
    'ly.img.transform.position' /* X and Y position controls */,
    'ly.img.transform.rotation' /* Rotation controls */,
    'ly.img.transform.size' /* Width and height controls */,

    // 'ly.img.transitions', /* Transitions button (video mode) */

    'ly.img.trim' /* Trim button (video mode) */,

    // 'ly.img.vectorEdit', /* Vector edit controls (parent) */
    'ly.img.vectorEdit.addMode' /* Add node mode toggle */,
    'ly.img.vectorEdit.bendMode' /* Bend mode toggle */,
    'ly.img.vectorEdit.deleteMode' /* Delete node mode toggle */,
    'ly.img.vectorEdit.done' /* Exit vector edit button */,
    'ly.img.vectorEdit.mirrorMode' /* Handle mirror mode dropdown */,
    'ly.img.vectorEdit.moveMode' /* Move/select mode toggle */

    // 'ly.img.video', /* Enables all children below */
    // 'ly.img.video.caption', /* Video captions */
    // 'ly.img.video.timeline', /* Video Timeline visibility */
    // 'ly.img.video.timeline.addClip', /* Add clips to timeline */
    // 'ly.img.video.timeline.audio', /* Audio track in timeline */
    // 'ly.img.video.timeline.clip.menu', /* Clip ellipsis button */
    // 'ly.img.video.timeline.clips', /* Clips track in timeline */
    // 'ly.img.video.timeline.controls', /* Base video control UI */
    // 'ly.img.video.timeline.controls.background', /* Background color controls */
    // 'ly.img.video.timeline.controls.bar', /* Timeline controls bar area */
    // 'ly.img.video.timeline.controls.loop', /* Loop toggle */
    // 'ly.img.video.timeline.controls.playback', /* Play/pause and timestamp */
    // 'ly.img.video.timeline.controls.split', /* Split clip control */
    // 'ly.img.video.timeline.controls.timelineZoom', /* Timeline zoom controls */
    // 'ly.img.video.timeline.controls.toggle', /* Timeline collapse/expand toggle */
    // 'ly.img.video.timeline.overlays', /* Overlays track in timeline */
    // 'ly.img.video.timeline.ruler', /* Timeline ruler/time scale */

    // 'ly.img.volume' /* Volume control (video mode) */
  ]);
}
