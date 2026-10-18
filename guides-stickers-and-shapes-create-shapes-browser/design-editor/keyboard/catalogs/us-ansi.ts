/**
 * Default keyboard shortcut catalog — US-ANSI layout — for this editor config.
 *
 * This catalog lives next to the config's `keyboard.ts`; each config is
 * self-contained and owns its own copy. The thin `keyboard.ts` wrapper imports
 * this constant and registers it.
 *
 * Each `run`/`when` receives the editor through its context argument
 * (`({ cesdk }) => …`), so the catalog never needs to close over a `cesdk`
 *
 * ## Shortcut shape
 *
 * ```ts
 * {
 *   keys: 'Mod+s',                  // W3C key with optional modifiers
 *   description: 'Save scene',      // human-readable label
 *   category: 'File',               // grouping for help dialogs
 *   run: 'saveScene',               // action id OR function
 *   scope: ['ly.img.scope.canvas'], // optional: restrict to UI scopes
 *   when: ({ cesdk }) => true                // optional editor-state predicate
 * }
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/keyboard/
 */

import { type KeyboardShortcut } from '@cesdk/cesdk-js';

/**
 * The default US-ANSI keyboard shortcut catalog.
 */
export const usAnsiCatalog: KeyboardShortcut[] = [
  // ========================================================================
  // SELECTION
  // ========================================================================

  // #region Selection
  {
    keys: 'Mod+a',
    description: 'Select all elements on the current page',
    category: 'Selection',
    run: 'selection.all',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) => cesdk.engine.editor.getEditMode() === 'Transform'
  },
  {
    keys: 'Enter',
    description: 'Enter or exit the selected group',
    category: 'Selection',
    run: 'group.enterOrExit',
    scope: ['ly.img.scope.canvas']
  },
  {
    keys: 'Escape',
    description: 'Select parent group or deselect',
    category: 'Selection',
    run: 'selection.parentOrDeselect',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  // #endregion

  // ========================================================================
  // EDITING
  // ========================================================================

  // #region Editing
  // Delete / Backspace: a vector node/point in Vector mode, else the selection.
  {
    keys: 'Delete',
    description: 'Delete selected vector node, point, or elements',
    category: 'Editing',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    run: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Vector' &&
      (cesdk.engine.editor.hasSelectedVectorNode() ||
        cesdk.engine.editor.hasSelectedVectorControlPoint())
        ? cesdk.actions.run('vectorPath.deleteNodeOrPoint')
        : cesdk.actions.run('selection.delete'),
    when: ({ cesdk }) =>
      (cesdk.engine.editor.getEditMode() === 'Vector' &&
        (cesdk.engine.editor.hasSelectedVectorNode() ||
          cesdk.engine.editor.hasSelectedVectorControlPoint())) ||
      (cesdk.engine.editor.getEditMode() === 'Transform' &&
        cesdk.engine.block.findAllSelected().length > 0 &&
        cesdk.feature.isEnabled('ly.img.delete', { engine: cesdk.engine }))
  },
  {
    keys: 'Backspace',
    description: 'Delete selected vector node, point, or elements',
    category: 'Editing',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    run: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Vector' &&
      (cesdk.engine.editor.hasSelectedVectorNode() ||
        cesdk.engine.editor.hasSelectedVectorControlPoint())
        ? cesdk.actions.run('vectorPath.deleteNodeOrPoint')
        : cesdk.actions.run('selection.delete'),
    when: ({ cesdk }) =>
      (cesdk.engine.editor.getEditMode() === 'Vector' &&
        (cesdk.engine.editor.hasSelectedVectorNode() ||
          cesdk.engine.editor.hasSelectedVectorControlPoint())) ||
      (cesdk.engine.editor.getEditMode() === 'Transform' &&
        cesdk.engine.block.findAllSelected().length > 0 &&
        cesdk.feature.isEnabled('ly.img.delete', { engine: cesdk.engine }))
  },
  {
    keys: 'Mod+d',
    description: 'Duplicate selected elements',
    category: 'Editing',
    run: 'selection.duplicate',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      if (
        !cesdk.feature.isEnabled('ly.img.duplicate', { engine: cesdk.engine })
      )
        return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'lifecycle/duplicate')
      );
    }
  },
  {
    keys: 'Mod+g',
    description: 'Group selected elements',
    category: 'Editing',
    run: 'selection.group',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 1 &&
      cesdk.feature.isEnabled('ly.img.group', { engine: cesdk.engine }) &&
      cesdk.feature.isEnabled('ly.img.group.create', {
        engine: cesdk.engine
      })
  },
  {
    keys: 'Mod+Shift+g',
    description: 'Ungroup the selected group',
    category: 'Editing',
    run: 'selection.ungroup',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) => {
      if (
        !cesdk.feature.isEnabled('ly.img.group', { engine: cesdk.engine }) ||
        !cesdk.feature.isEnabled('ly.img.group.ungroup', {
          engine: cesdk.engine
        })
      )
        return false;
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      return cesdk.engine.block
        .findAllSelected()
        .some((id) => cesdk.engine.block.getType(id) === '//ly.img.ubq/group');
    }
  },
  {
    keys: 'Mod+c',
    description: 'Copy',
    category: 'Editing',
    run: 'copy',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      const [first] = selected;
      if (first == null) return false;
      if (!cesdk.engine.block.isAllowedByScope(first, 'lifecycle/duplicate')) {
        return false;
      }
      const pageInSelection = selected.some(
        (id) =>
          cesdk.engine.block.isValid(id) &&
          cesdk.engine.block.getType(id) === '//ly.img.ubq/page'
      );
      if (!pageInSelection) return true;
      return (
        cesdk.engine.editor.getRole() === 'Creator' &&
        cesdk.feature.isEnabled('ly.img.duplicate')
      );
    }
  },
  {
    keys: 'Mod+x',
    description: 'Cut',
    category: 'Editing',
    run: 'cut',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      const [first] = selected;
      if (first == null) return false;
      if (!cesdk.engine.block.isAllowedByScope(first, 'lifecycle/duplicate')) {
        return false;
      }
      const pageInSelection = selected.some(
        (id) =>
          cesdk.engine.block.isValid(id) &&
          cesdk.engine.block.getType(id) === '//ly.img.ubq/page'
      );
      if (!pageInSelection) return true;
      return (
        cesdk.engine.editor.getRole() === 'Creator' &&
        cesdk.feature.isEnabled('ly.img.duplicate')
      );
    }
  },
  {
    keys: 'Mod+v',
    description: 'Paste',
    category: 'Editing',
    run: 'paste',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) => cesdk.engine.editor.getEditMode() === 'Transform'
  },
  {
    keys: 's',
    description: 'Split the selected clip at the playhead',
    category: 'Editing',
    run: 'selection.split',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) =>
      (cesdk.engine.editor.getEditMode() === 'Transform' ||
        cesdk.engine.editor.getEditMode() === 'Playback') &&
      cesdk.engine.block.findAllSelected().length > 0 &&
      cesdk.feature.isEnabled('ly.img.video.timeline.controls.split', {
        engine: cesdk.engine
      })
  },
  // #endregion

  // ========================================================================
  // TEXT FORMATTING
  // ========================================================================

  // #region Text formatting
  {
    keys: 'Mod+b',
    description: 'Toggle bold on selected text',
    category: 'Text formatting',
    run: 'text.toggleBold',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) =>
      cesdk.engine.block
        .findAllSelected()
        .some((id) => cesdk.engine.block.getType(id) === '//ly.img.ubq/text') &&
      cesdk.feature.isEnabled('ly.img.text.fontStyle', {
        engine: cesdk.engine
      })
  },
  {
    keys: 'Mod+i',
    description: 'Toggle italic on selected text',
    category: 'Text formatting',
    run: 'text.toggleItalic',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) =>
      cesdk.engine.block
        .findAllSelected()
        .some((id) => cesdk.engine.block.getType(id) === '//ly.img.ubq/text') &&
      cesdk.feature.isEnabled('ly.img.text.fontStyle', {
        engine: cesdk.engine
      })
  },
  {
    keys: 'Mod+u',
    description: 'Toggle underline on selected text',
    category: 'Text formatting',
    run: 'text.toggleUnderline',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) =>
      cesdk.engine.block
        .findAllSelected()
        .some((id) => cesdk.engine.block.getType(id) === '//ly.img.ubq/text') &&
      cesdk.feature.isEnabled('ly.img.text.decoration', {
        engine: cesdk.engine
      })
  },
  {
    keys: 'Mod+Shift+x',
    description: 'Toggle strikethrough on selected text',
    category: 'Text formatting',
    run: 'text.toggleStrikethrough',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) =>
      cesdk.engine.block
        .findAllSelected()
        .some((id) => cesdk.engine.block.getType(id) === '//ly.img.ubq/text') &&
      cesdk.feature.isEnabled('ly.img.text.decoration', {
        engine: cesdk.engine
      })
  },
  {
    keys: 'Alt+Shift+5',
    description: 'Toggle strikethrough on selected text',
    category: 'Text formatting',
    run: 'text.toggleStrikethrough',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.videoTimeline'],
    when: ({ cesdk }) =>
      cesdk.engine.block
        .findAllSelected()
        .some((id) => cesdk.engine.block.getType(id) === '//ly.img.ubq/text') &&
      cesdk.feature.isEnabled('ly.img.text.decoration', {
        engine: cesdk.engine
      })
  },
  // #endregion

  // ========================================================================
  // MOVEMENT
  // ========================================================================

  // #region Movement
  {
    keys: 'ArrowUp',
    description: 'Nudge selection up',
    category: 'Movement',
    run: 'selection.nudgeUp',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'ArrowDown',
    description: 'Nudge selection down',
    category: 'Movement',
    run: 'selection.nudgeDown',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'ArrowLeft',
    description: 'Nudge selection left',
    category: 'Movement',
    run: 'selection.nudgeLeft',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'ArrowRight',
    description: 'Nudge selection right',
    category: 'Movement',
    run: 'selection.nudgeRight',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'Shift+ArrowUp',
    description: 'Nudge selection up (extended step)',
    category: 'Movement',
    run: 'selection.nudgeUpExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'Shift+ArrowDown',
    description: 'Nudge selection down (extended step)',
    category: 'Movement',
    run: 'selection.nudgeDownExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'Shift+ArrowLeft',
    description: 'Nudge selection left (extended step)',
    category: 'Movement',
    run: 'selection.nudgeLeftExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'Shift+ArrowRight',
    description: 'Nudge selection right (extended step)',
    category: 'Movement',
    run: 'selection.nudgeRightExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  // Crop offset: nudge the image inside its crop frame while in Crop mode.
  // Shares the arrow keys with selection nudge — edit modes are mutually
  // exclusive, so the `when` gate routes to the right action.
  {
    keys: 'ArrowUp',
    description: 'Move crop up',
    category: 'Movement',
    run: 'crop.nudgeDown',
    scope: ['ly.img.scope.canvas', '//ly.img.panel/inspector/crop'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Crop' &&
      cesdk.engine.block.findAllSelected().length === 1
  },
  {
    keys: 'ArrowDown',
    description: 'Move crop down',
    category: 'Movement',
    run: 'crop.nudgeUp',
    scope: ['ly.img.scope.canvas', '//ly.img.panel/inspector/crop'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Crop' &&
      cesdk.engine.block.findAllSelected().length === 1
  },
  {
    keys: 'ArrowLeft',
    description: 'Move crop left',
    category: 'Movement',
    run: 'crop.nudgeRight',
    scope: ['ly.img.scope.canvas', '//ly.img.panel/inspector/crop'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Crop' &&
      cesdk.engine.block.findAllSelected().length === 1
  },
  {
    keys: 'ArrowRight',
    description: 'Move crop right',
    category: 'Movement',
    run: 'crop.nudgeLeft',
    scope: ['ly.img.scope.canvas', '//ly.img.panel/inspector/crop'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Crop' &&
      cesdk.engine.block.findAllSelected().length === 1
  },
  {
    keys: 'Shift+ArrowUp',
    description: 'Move crop up (extended step)',
    category: 'Movement',
    run: 'crop.nudgeDownExtended',
    scope: ['ly.img.scope.canvas', '//ly.img.panel/inspector/crop'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Crop' &&
      cesdk.engine.block.findAllSelected().length === 1
  },
  {
    keys: 'Shift+ArrowDown',
    description: 'Move crop down (extended step)',
    category: 'Movement',
    run: 'crop.nudgeUpExtended',
    scope: ['ly.img.scope.canvas', '//ly.img.panel/inspector/crop'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Crop' &&
      cesdk.engine.block.findAllSelected().length === 1
  },
  {
    keys: 'Shift+ArrowLeft',
    description: 'Move crop left (extended step)',
    category: 'Movement',
    run: 'crop.nudgeRightExtended',
    scope: ['ly.img.scope.canvas', '//ly.img.panel/inspector/crop'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Crop' &&
      cesdk.engine.block.findAllSelected().length === 1
  },
  {
    keys: 'Shift+ArrowRight',
    description: 'Move crop right (extended step)',
    category: 'Movement',
    run: 'crop.nudgeLeftExtended',
    scope: ['ly.img.scope.canvas', '//ly.img.panel/inspector/crop'],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Crop' &&
      cesdk.engine.block.findAllSelected().length === 1
  },
  // Rotate the selection: Alt+Left/Right by 1°, add Shift for 15°.
  {
    keys: 'Alt+ArrowLeft',
    description: 'Rotate selection left',
    category: 'Movement',
    run: 'selection.rotateCCW',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/rotate')
      );
    }
  },
  {
    keys: 'Alt+ArrowRight',
    description: 'Rotate selection right',
    category: 'Movement',
    run: 'selection.rotateCW',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/rotate')
      );
    }
  },
  {
    keys: 'Alt+Shift+ArrowLeft',
    description: 'Rotate selection left (extended step)',
    category: 'Movement',
    run: 'selection.rotateCCWExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/rotate')
      );
    }
  },
  {
    keys: 'Alt+Shift+ArrowRight',
    description: 'Rotate selection right (extended step)',
    category: 'Movement',
    run: 'selection.rotateCWExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/rotate')
      );
    }
  },
  // Resize the selection: Mod+Arrow by 1 unit (Right/Down grow), add Shift
  // for 10. Top-left anchored, like the dimensions inspector.
  {
    keys: 'Mod+ArrowRight',
    description: 'Grow selection width',
    category: 'Movement',
    run: 'selection.resizeWidthGrow',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+ArrowLeft',
    description: 'Shrink selection width',
    category: 'Movement',
    run: 'selection.resizeWidthShrink',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+ArrowDown',
    description: 'Grow selection height',
    category: 'Movement',
    run: 'selection.resizeHeightGrow',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+ArrowUp',
    description: 'Shrink selection height',
    category: 'Movement',
    run: 'selection.resizeHeightShrink',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Shift+ArrowRight',
    description: 'Grow selection width (extended step)',
    category: 'Movement',
    run: 'selection.resizeWidthGrowExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Shift+ArrowLeft',
    description: 'Shrink selection width (extended step)',
    category: 'Movement',
    run: 'selection.resizeWidthShrinkExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Shift+ArrowDown',
    description: 'Grow selection height (extended step)',
    category: 'Movement',
    run: 'selection.resizeHeightGrowExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Shift+ArrowUp',
    description: 'Shrink selection height (extended step)',
    category: 'Movement',
    run: 'selection.resizeHeightShrinkExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  // Opposite-anchored resize: Mod+Control+Arrow grows/shrinks from the left/top
  // edge instead of the right/bottom, keeping the far edge fixed.
  {
    keys: 'Mod+Control+ArrowLeft',
    description: 'Grow selection width from the left',
    category: 'Movement',
    run: 'selection.resizeWidthGrowFromLeft',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Control+ArrowRight',
    description: 'Shrink selection width from the left',
    category: 'Movement',
    run: 'selection.resizeWidthShrinkFromLeft',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Control+ArrowUp',
    description: 'Grow selection height from the top',
    category: 'Movement',
    run: 'selection.resizeHeightGrowFromTop',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Control+ArrowDown',
    description: 'Shrink selection height from the top',
    category: 'Movement',
    run: 'selection.resizeHeightShrinkFromTop',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Control+Shift+ArrowLeft',
    description: 'Grow selection width from the left (extended step)',
    category: 'Movement',
    run: 'selection.resizeWidthGrowFromLeftExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Control+Shift+ArrowRight',
    description: 'Shrink selection width from the left (extended step)',
    category: 'Movement',
    run: 'selection.resizeWidthShrinkFromLeftExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Control+Shift+ArrowUp',
    description: 'Grow selection height from the top (extended step)',
    category: 'Movement',
    run: 'selection.resizeHeightGrowFromTopExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  {
    keys: 'Mod+Control+Shift+ArrowDown',
    description: 'Shrink selection height from the top (extended step)',
    category: 'Movement',
    run: 'selection.resizeHeightShrinkFromTopExtended',
    scope: ['ly.img.scope.canvas'],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, 'layer/resize')
      );
    }
  },
  // #endregion

  // ========================================================================
  // TIMELINE
  // ========================================================================

  // #region Timeline
  // The keyboard alternative to dragging clips, trim handles, and the
  // playhead. All timeline-scoped, so they never fire on the design canvas.
  // Clip move/track, trim and skimming all act on the selected clip (a block
  // with a duration) directly on the timeline — no Trim edit mode required,
  // mirroring the drag/trim handles.
  // Clip move (in time) and track moves. A clip (a block with a duration) must
  // be selected. Move = Left/Right (0.1s), Shift for the 1s step; move to an
  // existing track = Up/Down; move to a new track = Shift+Up/Down.
  // {
  // keys: 'ArrowLeft',
  // description: 'Move clip earlier',
  // category: 'Timeline',
  // run: 'timeline.clip.moveEarlier',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'ArrowRight',
  // description: 'Move clip later',
  // category: 'Timeline',
  // run: 'timeline.clip.moveLater',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'Shift+ArrowLeft',
  // description: 'Move clip earlier (extended step)',
  // category: 'Timeline',
  // run: 'timeline.clip.moveEarlierExtended',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'Shift+ArrowRight',
  // description: 'Move clip later (extended step)',
  // category: 'Timeline',
  // run: 'timeline.clip.moveLaterExtended',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'Mod+ArrowLeft',
  // description: 'Insert clip earlier, pushing later clips',
  // category: 'Timeline',
  // run: 'timeline.clip.insertPushEarlier',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'Mod+ArrowRight',
  // description: 'Insert clip later, pushing later clips',
  // category: 'Timeline',
  // run: 'timeline.clip.insertPushLater',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'ArrowUp',
  // description: 'Move clip to the track above',
  // category: 'Timeline',
  // run: 'timeline.clip.moveToTrackAbove',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'ArrowDown',
  // description: 'Move clip to the track below',
  // category: 'Timeline',
  // run: 'timeline.clip.moveToTrackBelow',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'Shift+ArrowUp',
  // description: 'Move clip to a new track above',
  // category: 'Timeline',
  // run: 'timeline.clip.newTrackAbove',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'Shift+ArrowDown',
  // description: 'Move clip to a new track below',
  // category: 'Timeline',
  // run: 'timeline.clip.newTrackBelow',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: ',',
  // description: 'Move the playhead back',
  // category: 'Timeline',
  // run: 'timeline.skim.back',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) => cesdk.engine.scene.getCurrentPage() != null
  // },
  // {
  // keys: '.',
  // description: 'Move the playhead forward',
  // category: 'Timeline',
  // run: 'timeline.skim.forward',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) => cesdk.engine.scene.getCurrentPage() != null
  // },
  // {
  // keys: 'Home',
  // description: 'Move the playhead to the start',
  // category: 'Timeline',
  // run: 'timeline.skim.toStart',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) => cesdk.engine.scene.getCurrentPage() != null
  // },
  // {
  // keys: 'End',
  // description: 'Move the playhead to the end',
  // category: 'Timeline',
  // run: 'timeline.skim.toEnd',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) => cesdk.engine.scene.getCurrentPage() != null
  // },
  // {
  // keys: 'Alt+ArrowRight',
  // description: 'Extend the trim out point',
  // category: 'Timeline',
  // run: 'trim.moveOutLater',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'Alt+ArrowLeft',
  // description: 'Pull in the trim out point',
  // category: 'Timeline',
  // run: 'trim.moveOutEarlier',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'Alt+Shift+ArrowRight',
  // description: 'Push in the trim in point',
  // category: 'Timeline',
  // run: 'trim.moveInLater',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // {
  // keys: 'Alt+Shift+ArrowLeft',
  // description: 'Pull back the trim in point',
  // category: 'Timeline',
  // run: 'trim.moveInEarlier',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  //   cesdk.engine.block
  //     .findAllSelected()
  //     .some(
  //       (id) =>
  //         cesdk.engine.block.isValid(id) &&
  //         cesdk.engine.block.supportsDuration(id)
  //     )
  // },
  // #endregion

  // ========================================================================
  // PAGE NAVIGATION
  // ========================================================================

  // #region Page navigation
  {
    keys: 'ArrowDown',
    description: 'Scroll to next page',
    category: 'Page navigation',
    run: 'page.selectNext',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.editor'],
    when: ({ cesdk }) => cesdk.engine.editor.getRole() === 'Presenter'
  },
  {
    keys: 'ArrowUp',
    description: 'Scroll to previous page',
    category: 'Page navigation',
    run: 'page.selectPrevious',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.editor'],
    when: ({ cesdk }) => cesdk.engine.editor.getRole() === 'Presenter'
  },
  {
    keys: 'ArrowRight',
    description: 'Scroll to next page',
    category: 'Page navigation',
    run: 'page.selectNext',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.editor'],
    when: ({ cesdk }) => cesdk.engine.editor.getRole() === 'Presenter'
  },
  {
    keys: 'ArrowLeft',
    description: 'Scroll to previous page',
    category: 'Page navigation',
    run: 'page.selectPrevious',
    scope: ['ly.img.scope.canvas', 'ly.img.scope.editor'],
    when: ({ cesdk }) => cesdk.engine.editor.getRole() === 'Presenter'
  },
  // #endregion

  // ========================================================================
  // PLAYBACK
  // ========================================================================

  // #region Playback
  // {
  // keys: 'Space',
  // description: 'Play / pause the current page',
  // category: 'Playback',
  // run: 'video.playPause',
  // scope: ['ly.img.scope.videoTimeline'],
  // when: ({ cesdk }) =>
  // cesdk.feature.isEnabled('ly.img.video.timeline.controls.playback')
  // },
  // #endregion

  // ========================================================================
  // VIEW
  // ========================================================================

  // #region View
  {
    keys: 'Shift+1',
    description: 'Zoom to fit',
    category: 'View',
    run: 'zoom.toFit',
    scope: ['ly.img.scope.editor']
  },
  {
    keys: 'Shift+2',
    description: 'Zoom to 100%',
    category: 'View',
    run: ({ cesdk }) => {
      void cesdk.actions.run('zoom.toLevel', 1, { animate: false });
    },
    scope: ['ly.img.scope.editor']
  },
  {
    keys: 'Shift++',
    description: 'Zoom in',
    category: 'View',
    run: ({ cesdk }) => {
      void cesdk.actions.run('zoom.in', { animate: true });
    },
    scope: ['ly.img.scope.editor']
  },
  {
    keys: '+',
    description: 'Zoom in',
    category: 'View',
    run: ({ cesdk }) => {
      void cesdk.actions.run('zoom.in', { animate: true });
    },
    scope: ['ly.img.scope.editor']
  },
  {
    keys: '-',
    description: 'Zoom out',
    category: 'View',
    run: ({ cesdk }) => {
      void cesdk.actions.run('zoom.out', { animate: true });
    },
    scope: ['ly.img.scope.editor']
  },
  {
    keys: 'Mod+.',
    description: 'Show or hide the user interface',
    category: 'View',
    run: 'toggleUserInterfaceVisibility',
    scope: ['ly.img.scope.editor']
  },
  // #endregion

  // ========================================================================
  // HISTORY
  // ========================================================================

  // #region History
  {
    keys: 'Mod+z',
    description: 'Undo last action',
    category: 'History',
    run: 'history.undo',
    scope: ['ly.img.scope.editor']
  },
  {
    keys: 'Mod+Shift+z',
    description: 'Redo last undone action',
    category: 'History',
    run: 'history.redo',
    scope: ['ly.img.scope.editor']
  },
  // #endregion

  // ========================================================================
  // FILE
  // ========================================================================

  // #region File
  {
    keys: 'Mod+s',
    description: 'Save scene',
    category: 'File',
    run: 'saveScene',
    scope: ['ly.img.scope.editor']
  },
  {
    keys: 'Mod+Shift+s',
    description: 'Save archive',
    category: 'File',
    run: ({ cesdk }) => {
      void cesdk.actions.run('exportScene', { format: 'archive' });
    },
    scope: ['ly.img.scope.editor']
  }
  // #endregion
];
