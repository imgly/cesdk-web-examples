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

import CreativeEditorSDK, {
  CANVAS_SHORTCUT_SCOPE,
  EDITOR_SHORTCUT_SCOPE,
  VIDEO_TIMELINE_SHORTCUT_SCOPE,
  type KeyboardShortcut
} from '@cesdk/cesdk-js';

const LIFECYCLE_DUPLICATE_SCOPE = 'lifecycle/duplicate';

const isVectorPointDelete = (cesdk: CreativeEditorSDK): boolean =>
  cesdk.engine.editor.getEditMode() === 'Vector' &&
  (cesdk.engine.editor.hasSelectedVectorNode() ||
    cesdk.engine.editor.hasSelectedVectorControlPoint());

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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) => cesdk.engine.editor.getEditMode() === 'Transform'
  },
  {
    keys: 'Enter',
    description: 'Enter or exit the selected group',
    category: 'Selection',
    run: 'group.enterOrExit',
    scope: [CANVAS_SHORTCUT_SCOPE]
  },
  {
    keys: 'Escape',
    description: 'Select parent group or deselect',
    category: 'Selection',
    run: 'selection.parentOrDeselect',
    scope: [CANVAS_SHORTCUT_SCOPE],
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
  ...['Delete', 'Backspace'].map(
    (keys): KeyboardShortcut => ({
      keys,
      description: 'Delete selected vector node, point, or elements',
      category: 'Editing',
      scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
      run: ({ cesdk }) =>
        isVectorPointDelete(cesdk)
          ? cesdk.actions.run('vectorPath.deleteNodeOrPoint')
          : cesdk.actions.run('selection.delete'),
      when: ({ cesdk }) =>
        isVectorPointDelete(cesdk) ||
        (cesdk.engine.editor.getEditMode() === 'Transform' &&
          cesdk.engine.block.findAllSelected().length > 0 &&
          cesdk.feature.isEnabled('ly.img.delete', { engine: cesdk.engine }))
    })
  ),
  {
    keys: 'Mod+d',
    description: 'Duplicate selected elements',
    category: 'Editing',
    run: 'selection.duplicate',
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      if (selected.length === 0) return false;
      if (
        !cesdk.feature.isEnabled('ly.img.duplicate', { engine: cesdk.engine })
      )
        return false;
      return selected.every((id) =>
        cesdk.engine.block.isAllowedByScope(id, LIFECYCLE_DUPLICATE_SCOPE)
      );
    }
  },
  {
    keys: 'Mod+g',
    description: 'Group selected elements',
    category: 'Editing',
    run: 'selection.group',
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      const [first] = selected;
      if (first == null) return false;
      if (
        !cesdk.engine.block.isAllowedByScope(first, LIFECYCLE_DUPLICATE_SCOPE)
      ) {
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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) => {
      if (cesdk.engine.editor.getEditMode() !== 'Transform') return false;
      const selected = cesdk.engine.block.findAllSelected();
      const [first] = selected;
      if (first == null) return false;
      if (
        !cesdk.engine.block.isAllowedByScope(first, LIFECYCLE_DUPLICATE_SCOPE)
      ) {
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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) => cesdk.engine.editor.getEditMode() === 'Transform'
  },
  {
    keys: 's',
    description: 'Split the selected clip at the playhead',
    category: 'Editing',
    run: 'selection.split',
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
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
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'ArrowDown',
    description: 'Nudge selection down',
    category: 'Movement',
    run: 'selection.nudgeDown',
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'ArrowLeft',
    description: 'Nudge selection left',
    category: 'Movement',
    run: 'selection.nudgeLeft',
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'ArrowRight',
    description: 'Nudge selection right',
    category: 'Movement',
    run: 'selection.nudgeRight',
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'Shift+ArrowUp',
    description: 'Nudge selection up (extended step)',
    category: 'Movement',
    run: 'selection.nudgeUpExtended',
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'Shift+ArrowDown',
    description: 'Nudge selection down (extended step)',
    category: 'Movement',
    run: 'selection.nudgeDownExtended',
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'Shift+ArrowLeft',
    description: 'Nudge selection left (extended step)',
    category: 'Movement',
    run: 'selection.nudgeLeftExtended',
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
  {
    keys: 'Shift+ArrowRight',
    description: 'Nudge selection right (extended step)',
    category: 'Movement',
    run: 'selection.nudgeRightExtended',
    scope: [CANVAS_SHORTCUT_SCOPE, VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) =>
      cesdk.engine.editor.getEditMode() === 'Transform' &&
      cesdk.engine.block.findAllSelected().length > 0
  },
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
    scope: [CANVAS_SHORTCUT_SCOPE, EDITOR_SHORTCUT_SCOPE],
    when: ({ cesdk }) => cesdk.engine.editor.getRole() === 'Presenter'
  },
  {
    keys: 'ArrowUp',
    description: 'Scroll to previous page',
    category: 'Page navigation',
    run: 'page.selectPrevious',
    scope: [CANVAS_SHORTCUT_SCOPE, EDITOR_SHORTCUT_SCOPE],
    when: ({ cesdk }) => cesdk.engine.editor.getRole() === 'Presenter'
  },
  {
    keys: 'ArrowRight',
    description: 'Scroll to next page',
    category: 'Page navigation',
    run: 'page.selectNext',
    scope: [CANVAS_SHORTCUT_SCOPE, EDITOR_SHORTCUT_SCOPE],
    when: ({ cesdk }) => cesdk.engine.editor.getRole() === 'Presenter'
  },
  {
    keys: 'ArrowLeft',
    description: 'Scroll to previous page',
    category: 'Page navigation',
    run: 'page.selectPrevious',
    scope: [CANVAS_SHORTCUT_SCOPE, EDITOR_SHORTCUT_SCOPE],
    when: ({ cesdk }) => cesdk.engine.editor.getRole() === 'Presenter'
  },
  // #endregion

  // ========================================================================
  // PLAYBACK
  // ========================================================================

  // #region Playback
  {
    keys: 'Space',
    description: 'Play / pause the current page',
    category: 'Playback',
    run: 'video.playPause',
    scope: [VIDEO_TIMELINE_SHORTCUT_SCOPE],
    when: ({ cesdk }) =>
      cesdk.feature.isEnabled('ly.img.video.timeline.controls.playback')
  },
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
    scope: [EDITOR_SHORTCUT_SCOPE]
  },
  {
    keys: 'Shift+2',
    description: 'Zoom to 100%',
    category: 'View',
    run: ({ cesdk }) => {
      void cesdk.actions.run('zoom.toLevel', 1, { animate: false });
    },
    scope: [EDITOR_SHORTCUT_SCOPE]
  },
  {
    keys: 'Shift++',
    description: 'Zoom in',
    category: 'View',
    run: ({ cesdk }) => {
      void cesdk.actions.run('zoom.in', { animate: true });
    },
    scope: [EDITOR_SHORTCUT_SCOPE]
  },
  {
    keys: '+',
    description: 'Zoom in',
    category: 'View',
    run: ({ cesdk }) => {
      void cesdk.actions.run('zoom.in', { animate: true });
    },
    scope: [EDITOR_SHORTCUT_SCOPE]
  },
  {
    keys: '-',
    description: 'Zoom out',
    category: 'View',
    run: ({ cesdk }) => {
      void cesdk.actions.run('zoom.out', { animate: true });
    },
    scope: [EDITOR_SHORTCUT_SCOPE]
  },
  {
    keys: 'Mod+.',
    description: 'Show or hide the user interface',
    category: 'View',
    run: 'toggleUserInterfaceVisibility',
    scope: [EDITOR_SHORTCUT_SCOPE]
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
    scope: [EDITOR_SHORTCUT_SCOPE]
  },
  {
    keys: 'Mod+Shift+z',
    description: 'Redo last undone action',
    category: 'History',
    run: 'history.redo',
    scope: [EDITOR_SHORTCUT_SCOPE]
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
    scope: [EDITOR_SHORTCUT_SCOPE]
  },
  {
    keys: 'Mod+Shift+s',
    description: 'Save archive',
    category: 'File',
    run: ({ cesdk }) => {
      void cesdk.actions.run('exportScene', { format: 'archive' });
    },
    scope: [EDITOR_SHORTCUT_SCOPE]
  }
  // #endregion
];
