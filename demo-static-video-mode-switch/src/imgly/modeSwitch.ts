/**
 * Mode Switch - Static / Video segmented control in the navigation bar
 *
 * Registered once on the editor instance, then placed in the navigation bar
 * by each mode's `setupNavigationBar()`.
 *
 * `applyMode()` calls `cesdk.resetEditor()` on every switch. That resets
 * engine settings and the component order, but *not* component registrations,
 * so registering once in `App`'s init is enough — each mode config only has to
 * re-insert `MODE_SWITCH_ID` into its own navigation bar order.
 *
 * This module deliberately imports nothing from `./index`: the mode configs
 * import it for `MODE_SWITCH_ID`, and `index.ts` re-exports `EditorMode` from
 * here, so keeping it a leaf avoids an import cycle.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/register-new-component-b04a04/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

export type EditorMode = 'Static' | 'Video';

/** Component id referenced by each mode's navigation bar order. */
export const MODE_SWITCH_ID = 'my-app.modeSwitch.navigationBar';

const MODES: EditorMode[] = ['Static', 'Video'];

export interface ModeSwitchController {
  /** Current mode, owned by the app. */
  getMode: () => EditorMode;
  /** True while a previous switch is still being applied. */
  isBusy: () => boolean;
  /** Applies the new mode. Rejects when the switch failed. */
  onChange: (mode: EditorMode) => Promise<void>;
}

/**
 * Register the Static / Video segmented control.
 *
 * Call once, before the first `applyMode()`, so the navigation bar order can
 * already reference the component.
 *
 * @param cesdk - The CreativeEditorSDK instance to register the control on
 * @param controller - Reads the app's current mode and applies changes
 */
export function registerModeSwitch(
  cesdk: CreativeEditorSDK,
  controller: ModeSwitchController
): void {
  cesdk.ui.registerComponent(MODE_SWITCH_ID, ({ builder, state }) => {
    // Seeded from the app so the correct segment is shown even if the editor
    // rebuilds this component's local state during a reset.
    const mode = state<EditorMode>('mode', controller.getMode());

    // A ButtonGroup of `isActive` buttons is CE.SDK's segmented control.
    builder.ButtonGroup('modeSwitch', {
      children: () => {
        MODES.forEach((candidate) => {
          builder.Button(candidate, {
            label: candidate,
            isActive: mode.value === candidate,
            onClick: async () => {
              // A click during a running switch is dropped, not queued —
              // otherwise the highlight would move while the editor stays put.
              if (candidate === mode.value || controller.isBusy()) return;
              // Move the control immediately; the config swap catches up
              // behind it. Roll back if the swap fails, so the highlight
              // never disagrees with the editor.
              const previous = mode.value;
              mode.setValue(candidate);
              try {
                await controller.onChange(candidate);
              } catch (error) {
                mode.setValue(previous);
                throw error;
              }
            }
          });
        });
      }
    });
  });
}
