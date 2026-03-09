/**
 * Engine Settings Configuration - Customize Editor Behavior and Appearance
 *
 * This file configures low-level engine settings that control how the editor
 * behaves and appears. Settings are applied via `engine.editor.setSetting()`.
 *
 * @see https://img.ly/docs/cesdk/js/settings-970c98/
 */

import type { CreativeEngine } from '@cesdk/cesdk-js';

/**
 * Configure engine settings for the design editor.
 *
 * Settings control the underlying behavior of the engine, including:
 * - How users interact with blocks (handles, gestures, clicks)
 * - Visual appearance (colors, overlays, guides)
 * - Performance optimizations
 *
 * @param engine - The CreativeEngine instance to configure
 */
export function setupSettings(engine: CreativeEngine): void {
  // ============================================================================
  // CONTROL GIZMO SETTINGS
  // Configure the visual handles that appear when blocks are selected
  // ============================================================================

  // #region Control Gizmo Settings
  // Show/hide various control handles

  // Crop handles - Handles for adjusting crop area in crop mode
  // engine.editor.setSetting('controlGizmo/showCropHandles', true);

  // Crop scale handles - Outer handles that scale the full image during crop
  // engine.editor.setSetting('controlGizmo/showCropScaleHandles', true);

  // Move handles - Center handles for moving blocks
  // engine.editor.setSetting('controlGizmo/showMoveHandles', true);

  // Resize handles - Edge handles for non-proportional resizing
  // engine.editor.setSetting('controlGizmo/showResizeHandles', true);

  // Scale handles - Corner handles for proportional scaling
  // engine.editor.setSetting('controlGizmo/showScaleHandles', true);

  // Rotate handles - Handles for rotating blocks
  // engine.editor.setSetting('controlGizmo/showRotateHandles', true);

  // Minimum size (in screen pixels) when scaling down with gizmos or touch
  // Prevents blocks from becoming too small to interact with
  // engine.editor.setSetting('controlGizmo/blockScaleDownLimit', 8.0);
  // #endregion

  // ============================================================================
  // INTERACTION SETTINGS
  // Configure how users interact with the editor
  // ============================================================================

  // #region Interaction Settings
  // Enable double-click to enter crop mode for images
  engine.editor.setSetting('doubleClickToCropEnabled', true);

  // Selection mode for double-click:
  // - 'Direct': Select the exact element clicked
  // - 'Hierarchical': Traverse up/down the hierarchy on each click
  engine.editor.setSetting('doubleClickSelectionMode', 'Hierarchical');
  // #endregion

  // ============================================================================
  // PAGE AND CANVAS SETTINGS
  // Configure page appearance and behavior
  // ============================================================================

  // #region Page Settings
  // Allow cropping the page content via handles/gestures
  engine.editor.setSetting('page/allowCropInteraction', true);

  // Allow moving pages when layout is not controlled by scene
  // engine.editor.setSetting('page/allowMoveInteraction', true);

  // Allow resizing pages via handles/gestures
  // engine.editor.setSetting('page/allowResizeInteraction', true);

  // Allow rotating pages when layout is not controlled by scene
  // engine.editor.setSetting('page/allowRotateInteraction', true);

  // Dim areas outside of page boundaries for visual clarity
  engine.editor.setSetting('page/dimOutOfPageAreas', true);

  // Restrict resize to fixed aspect ratio
  // engine.editor.setSetting('page/restrictResizeInteractionToFixedAspectRatio', false);

  // Don't transform children when cropping fill (maintain absolute positions)
  engine.editor.setSetting('page/moveChildrenWhenCroppingFill', false);

  // Don't select page when clicking empty canvas area
  engine.editor.setSetting('page/selectWhenNoBlocksSelected', false);

  // Highlight page boundaries when cropping for better visual feedback
  // engine.editor.setSetting('page/highlightWhenCropping', true);
  // #endregion

  // #region Page Title Settings
  // Configure page title display

  // Show titles above each page for multi-page navigation
  engine.editor.setSetting('page/title/show', true);

  // Show title even when only one page exists
  engine.editor.setSetting('page/title/showOnSinglePage', true);

  // Include the template title in page titles
  engine.editor.setSetting('page/title/showPageTitleTemplate', true);

  // Append page name to the title
  engine.editor.setSetting('page/title/appendPageName', true);

  // Separator between page number and name (e.g., "Page 1 - Cover")
  engine.editor.setSetting('page/title/separator', '-');

  // Custom font for page titles (optional)
  // engine.editor.setSetting('page/title/fontFileUri', 'https://example.com/font.ttf');
  // #endregion

  // ============================================================================
  // TOUCH INTERACTION SETTINGS
  // Configure touch gestures and behavior
  // ============================================================================

  // #region Touch Settings
  // Whether starting a drag can select elements
  // engine.editor.setSetting('touch/dragStartCanSelect', true);

  // Enable single-finger panning (vs two-finger)
  // engine.editor.setSetting('touch/singlePointPanning', true);

  // Pinch gesture action:
  // - 'None': Pinch disabled
  // - 'Zoom': Pinch zooms the canvas
  // - 'Scale': Pinch scales selected blocks
  // engine.editor.setSetting('touch/pinchAction', 'Scale');

  // Rotate gesture action:
  // - 'None': Rotation disabled
  // - 'Rotate': Two-finger rotation rotates selected blocks
  // engine.editor.setSetting('touch/rotateAction', 'Rotate');
  // #endregion

  // ============================================================================
  // MOUSE INTERACTION SETTINGS
  // Configure mouse behavior
  // ============================================================================

  // #region Mouse Settings
  // Enable scroll wheel to pan the canvas
  // engine.editor.setSetting('mouse/enableScroll', true);

  // Enable scroll wheel + modifier key to zoom
  // engine.editor.setSetting('mouse/enableZoom', true);
  // #endregion

  // ============================================================================
  // ANIMATION SETTINGS
  // Configure block animations
  // ============================================================================

  // #region Animation Settings
  // Enable/disable block animations (in/out animations, loops)
  // engine.editor.setSetting('blockAnimations/enabled', true);
  // #endregion

  // ============================================================================
  // PLACEHOLDER CONTROL SETTINGS
  // Configure placeholder appearance for template editing
  // ============================================================================

  // #region Placeholder Settings
  // Show overlay pattern on placeholder elements
  engine.editor.setSetting('placeholderControls/showOverlay', true);

  // Show button on placeholders for easy content replacement
  engine.editor.setSetting('placeholderControls/showButton', true);
  // #endregion

  // ============================================================================
  // SNAPPING SETTINGS
  // Configure snap-to behavior for positioning and rotation
  // ============================================================================

  // #region Snapping Settings
  // Distance threshold (in pixels) for position snapping to guides
  // engine.editor.setSetting('positionSnappingThreshold', 4.0);

  // Angle threshold (in degrees) for rotation snapping
  // engine.editor.setSetting('rotationSnappingThreshold', 0.15);
  // #endregion

  // ============================================================================
  // CAMERA SETTINGS
  // Configure viewport and camera behavior
  // ============================================================================

  // #region Camera Settings
  // How to handle when clamp area is smaller than viewport:
  // - 'Center': Center the content
  // - 'Reverse': Allow panning beyond bounds then snap back
  // engine.editor.setSetting('camera/clamping/overshootMode', 'Reverse');
  // #endregion

  // ============================================================================
  // DOCK SETTINGS
  // Configure the asset dock appearance
  // ============================================================================

  // #region Dock Settings
  // Hide text labels on dock icons (icon-only mode)
  // engine.editor.setSetting('dock/hideLabels', false);

  // Dock icon size: 'normal' or 'large'
  // engine.editor.setSetting('dock/iconSize', 'large');
  // #endregion

  // ============================================================================
  // FEATURE FLAGS
  // Enable/disable specific engine capabilities
  // ============================================================================

  // #region Feature Flags
  // Force system emojis instead of custom emoji fonts
  // engine.editor.setSetting('forceSystemEmojis', true);

  // Enable single page mode (hide multi-page navigation)
  // engine.editor.setSetting('features/singlePageModeEnabled', false);

  // Enable page carousel navigation
  // engine.editor.setSetting('features/pageCarouselEnabled', true);

  // Retain cover mode during transform edits
  // engine.editor.setSetting('features/transformEditsRetainCoverMode', true);
  // #endregion

  // ============================================================================
  // COLOR PICKER SETTINGS
  // Configure color picker behavior
  // ============================================================================

  // #region Color Picker Settings
  // Restrict color picker to a specific color mode:
  // - 'Any': Allow both RGB and CMYK (default)
  // - 'RGB': Restrict to RGB colors only
  // - 'CMYK': Restrict to CMYK colors only
  engine.editor.setSetting('colorPicker/colorMode', 'Any');
  // #endregion

  // ============================================================================
  // COLOR SETTINGS
  // Customize UI colors for branding and theming
  // ============================================================================

  // #region Color Settings
  // All colors use RGBA format: { r: 0-1, g: 0-1, b: 0-1, a: 0-1 }

  // Highlight color for selected elements
  // engine.editor.setSetting('highlightColor', {
  //   r: 0.2,
  //   g: 0.3,
  //   b: 1.0,
  //   a: 1.0
  // });

  // Highlight color for placeholder elements
  // engine.editor.setSetting('placeholderHighlightColor', {
  //   r: 0.77,
  //   g: 0.06,
  //   b: 0.95,
  //   a: 1.0
  // });

  // Highlight color for text variables
  // engine.editor.setSetting('textVariableHighlightColor', {
  //   r: 0.7,
  //   g: 0.0,
  //   b: 0.7,
  //   a: 1.0
  // });

  // Color of position snapping guide lines
  // engine.editor.setSetting('snappingGuideColor', {
  //   r: 1.0,
  //   g: 0.004,
  //   b: 0.361,
  //   a: 1.0
  // });

  // Color of rotation snapping guide lines
  // engine.editor.setSetting('rotationSnappingGuideColor', {
  //   r: 1.0,
  //   g: 0.004,
  //   b: 0.361,
  //   a: 1.0
  // });

  // Color of the crop mode overlay (dims non-cropped area)
  // engine.editor.setSetting('cropOverlayColor', {
  //   r: 0.0,
  //   g: 0.0,
  //   b: 0.0,
  //   a: 0.39
  // });

  // Color indicating error states (e.g., invalid operations)
  // engine.editor.setSetting('errorStateColor', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 0.7
  // });

  // Color for progress indicators
  // engine.editor.setSetting('progressColor', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 0.7
  // });

  // Fill color for control handles
  // engine.editor.setSetting('handleFillColor', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 1.0
  // });

  // Color of handle/selection borders
  // engine.editor.setSetting('borderOutlineColor', {
  //   r: 0.0,
  //   g: 0.0,
  //   b: 0.0,
  //   a: 1.0
  // });

  // Background color of the canvas
  // engine.editor.setSetting('clearColor', {
  //   r: 0.1,
  //   g: 0.1,
  //   b: 0.1,
  //   a: 1.0
  // });

  // Color of page highlights/outlines
  // engine.editor.setSetting('pageHighlightColor', {
  //   r: 0.2,
  //   g: 0.3,
  //   b: 1.0,
  //   a: 1.0
  // });

  // Color filled into bleed margins of pages
  // engine.editor.setSetting('page/marginFillColor', {
  //   r: 0.79,
  //   g: 0.12,
  //   b: 0.4,
  //   a: 0.1
  // });

  // Color of the frame around bleed margin area
  // engine.editor.setSetting('page/marginFrameColor', {
  //   r: 0.79,
  //   g: 0.12,
  //   b: 0.4,
  //   a: 0.15
  // });

  // Inner border color around pages
  // engine.editor.setSetting('page/innerBorderColor', {
  //   r: 0.0,
  //   g: 0.0,
  //   b: 0.0,
  //   a: 0.0
  // });

  // Outer border color around pages
  // engine.editor.setSetting('page/outerBorderColor', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 0.0
  // });

  // Color of page titles
  // engine.editor.setSetting('page/title/color', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 1.0
  // });

  // Rule of thirds guide line color
  // engine.editor.setSetting('ruleOfThirdsLineColor', {
  //   r: 1.0,
  //   g: 1.0,
  //   b: 1.0,
  //   a: 0.3
  // });
  // #endregion

  // ============================================================================
  // RESOURCE SETTINGS
  // Configure paths and resource URIs
  // ============================================================================

  // #region Resource Settings
  // Base path for resolving relative paths and bundle:/* URIs */
  // engine.editor.setSetting('basePath', 'https://cdn.example.com/assets/');

  // Default font file URI
  // engine.editor.setSetting('defaultFontFileUri', 'https://example.com/fonts/default.ttf');

  // Default emoji font file URI
  // engine.editor.setSetting('defaultEmojiFontFileUri', 'https://example.com/fonts/emoji.ttf');

  // Fallback font for missing glyphs
  // engine.editor.setSetting('fallbackFontUri', 'https://example.com/fonts/fallback.ttf');
  // #endregion

  // ============================================================================
  // UPLOAD SETTINGS
  // Configure file upload behavior
  // ============================================================================

  // #region Upload Settings
  // Supported MIME types for file uploads (comma-separated)
  // engine.editor.setSetting('upload/supportedMimeTypes', 'image/jpeg,image/png,image/webp,video/mp4,video/webm');

  // Maximum image size (width or height) in pixels
  // engine.editor.setSetting('maxImageSize', 4096);

  // Clamp thumbnail sizes to GPU texture limit
  // engine.editor.setSetting('clampThumbnailTextureSizes', true);
  // #endregion

  // ============================================================================
  // NETWORK SETTINGS
  // Configure network behavior (Web only)
  // ============================================================================

  // #region Network Settings
  // Credentials mode for cross-origin fetch requests:
  // - 'omit': Never send cookies
  // - 'same-origin': Send cookies only for same-origin requests (default)
  // - 'include': Always send cookies, even for cross-origin
  // engine.editor.setSetting('web/fetchCredentials', 'same-origin');
  // #endregion
}
