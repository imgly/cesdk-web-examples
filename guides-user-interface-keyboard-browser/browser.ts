import {
  CANVAS_SHORTCUT_SCOPE,
  EDITOR_SHORTCUT_SCOPE,
  type EditorPlugin,
  type EditorPluginContext
} from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ImageColorsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

class KeyboardExample implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Loading the design editor config registers the default keyboard
    // shortcut catalog automatically (undo/redo, copy/paste, save,
    // zoom, text formatting, etc.).
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create');

    // Inspect the current state of the shortcut subsystem
    const enabled = cesdk.feature.isEnabled('ly.img.keyboard.shortcuts');
    console.log('Keyboard shortcuts enabled:', enabled);

    // Disable shortcuts at runtime — the runtime detaches its listener
    // immediately. Re-enable later to restore everything without
    // re-registering the catalog.
    // cesdk.feature.enable('ly.img.keyboard.shortcuts', false);
    // cesdk.feature.enable('ly.img.keyboard.shortcuts', true);

    // Add a chord shortcut. `Mod` resolves to Cmd on macOS and Ctrl
    // elsewhere, so one registration covers both platforms. Press
    // Cmd/Ctrl+Alt+H to surface a notification — a stand-in for
    // opening a help dialog.
    cesdk.shortcuts.set({
      keys: 'Mod+Alt+h',
      description: 'Show keyboard help',
      category: 'Help',
      scope: [EDITOR_SHORTCUT_SCOPE],
      run: ({ cesdk }) => {
        console.log('Help shortcut triggered');
        cesdk.ui.showNotification({
          message: 'Keyboard help triggered (Mod+Alt+H)',
          type: 'info',
          duration: 3000
        });
      }
    });

    // Single-key shortcuts work the same way — just omit the modifier.
    // Press '?' to log a quick hint.
    cesdk.shortcuts.set({
      keys: 'Shift+?',
      description: 'Quick hint',
      category: 'Help',
      scope: [CANVAS_SHORTCUT_SCOPE],
      run: ({ cesdk }) => {
        cesdk.ui.showNotification({
          message: 'Tip: press Cmd/Ctrl+Alt+H for help',
          type: 'info',
          duration: 3000
        });
      }
    });

    // Sequences are arrays of chord strings pressed within `sequenceTimeout`
    // milliseconds of each other. Press 'g' then 'p' to jump to the first page.
    cesdk.shortcuts.set({
      keys: ['g', 'p'],
      description: 'Go to first page',
      category: 'Navigation',
      scope: [CANVAS_SHORTCUT_SCOPE],
      sequenceTimeout: 1000,
      run: ({ cesdk }) => {
        const [firstPage] = cesdk.engine.scene.getPages();
        if (firstPage != null) {
          cesdk.engine.block.select(firstPage);
          cesdk.ui.showNotification({
            message: 'Jumped to the first page',
            type: 'success',
            duration: 2000
          });
        }
      }
    });

    // Replace the default save binding with a custom handler. Remove
    // the existing entry first, then register the replacement on the
    // same keys. `Mod+s` matches both Cmd+S (macOS) and Ctrl+S
    // (Windows/Linux), so one call covers both.
    cesdk.shortcuts.remove({ keys: 'Mod+s', scopes: '*' });
    cesdk.shortcuts.set({
      keys: 'Mod+s',
      description: 'Custom save handler',
      category: 'File',
      scope: [EDITOR_SHORTCUT_SCOPE],
      run: ({ cesdk }) => {
        console.log('Custom save triggered — replace this with your own logic');
        cesdk.ui.showNotification({
          message: 'Custom save triggered',
          type: 'info',
          duration: 2000
        });
      }
    });

    // Use the `when:` predicate to gate execution on the active scope
    // and the current selection. The runtime resolves `uiScope` from
    // the focused element so the predicate doesn't need to query it.
    // Press Cmd/Ctrl+Shift+M while a text block is selected to mark it
    // as reviewed (here, just a log + notification).
    cesdk.shortcuts.set({
      keys: 'Mod+Shift+m',
      description: 'Mark selected text as reviewed',
      category: 'Editing',
      scope: [CANVAS_SHORTCUT_SCOPE],
      run: ({ cesdk }) => {
        const [selected] = cesdk.engine.block.findAllSelected();
        console.log('Marked text block as reviewed:', selected);
        cesdk.ui.showNotification({
          message: 'Marked as reviewed',
          type: 'success',
          duration: 2000
        });
      },
      // `scope` already gates this to the canvas; `when` only checks state.
      when: ({ cesdk }) => {
        const selected = cesdk.engine.block.findAllSelected();
        if (selected.length === 0) return false;
        return selected.every(
          (id) => cesdk.engine.block.getType(id) === '//ly.img.ubq/text'
        );
      }
    });

    // List every registered shortcut. Combine with `get` and `has` to build
    // help dialogs or to detect conflicts before registering custom bindings.
    const allShortcuts = cesdk.shortcuts.list({ scopes: '*' });
    console.log(`Registered shortcuts: ${allShortcuts.length}`);

    // A chord is a single `+`-joined string; an array is a multi-step sequence.
    const undoShortcut = cesdk.shortcuts.get({ keys: 'Mod+z', scopes: '*' });
    console.log('Undo shortcut:', undoShortcut);

    const conflict = cesdk.shortcuts.has('Mod+k');
    console.log('Mod+K already in use?', conflict);

    // `list` takes a `{ scopes }` selector and lists by scope; `get` and
    // `remove` take a `{ keys, scopes }` selector and match when keys AND scopes
    // both match. Each field is a glob (or array of globs); `'*'` matches
    // everything, `[]` matches nothing. To list by key, list a scope and filter.

    // Every Mod+<key> shortcut in the canvas scope.
    const modCanvas = cesdk.shortcuts
      .list({ scopes: [CANVAS_SHORTCUT_SCOPE] })
      .filter((shortcut) => String(shortcut.keys).startsWith('Mod+'));
    console.log('Mod+ canvas shortcuts:', modCanvas.length);

    // Find the shortcut bound to a chord.
    const boldShortcut = cesdk.shortcuts.get({ keys: 'Mod+b', scopes: '*' });
    console.log('Bold shortcut:', boldShortcut);

    // Remove a chord in a specific scope (narrow with `scopes`, or `'*'` for all).
    cesdk.shortcuts.remove({
      keys: 'Mod+b',
      scopes: [CANVAS_SHORTCUT_SCOPE]
    });
  }
}

export default KeyboardExample;
