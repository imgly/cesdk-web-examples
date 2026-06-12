/**
 * Keyboard shortcuts for this editor config.
 *
 * The catalog lives in `./catalogs/us-ansi` so the config stays
 * self-contained. This file is the thin wrapper that builds the catalog for the
 * given `cesdk` and registers it. To ship a different layout, swap in a sibling
 * catalog with the same signature.
 *
 * @see ./catalogs/us-ansi
 * @see https://img.ly/docs/cesdk/js/user-interface/keyboard/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { usAnsiCatalog } from './catalogs/us-ansi';

/** Register the default keyboard shortcuts for this editor config. */
export function setupKeyboardShortcuts(cesdk: CreativeEditorSDK): void {
  cesdk.shortcuts.set(usAnsiCatalog);
}
