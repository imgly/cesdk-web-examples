/**
 * CE.SDK Static / Video Mode Switch Demo - App Component
 *
 * Single editor instance; swaps between the full Design and Video
 * configs at runtime by calling applyMode() on the live editor.
 *
 * The Static / Video control itself lives *inside* the editor, centered in the
 * navigation bar — see `imgly/modeSwitch.ts`. This component only owns the
 * current mode and applies it.
 */

import { useCallback, useRef } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import { applyMode, registerModeSwitch, type EditorMode } from '../imgly';
import styles from './App.module.css';


interface AppProps {
  config: Configuration;
  sceneUrl: string;
}

const INITIAL_MODE: EditorMode = 'Static';

export default function App({ config, sceneUrl }: AppProps) {
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);
  // Refs, not state: the mode switch is rendered by the editor now, so
  // changing modes no longer needs to re-render this component.
  const modeRef = useRef<EditorMode>(INITIAL_MODE);
  const busyRef = useRef(false);

  const handleModeChange = useCallback(async (nextMode: EditorMode) => {
    const cesdk = cesdkRef.current;
    if (cesdk == null || busyRef.current) return;

    const previousMode = modeRef.current;
    modeRef.current = nextMode;
    busyRef.current = true;
    try {
      await applyMode(cesdk, nextMode);
      await cesdk.actions.run('zoom.toPage', { autoFit: true });
    } catch (error) {
      // The editor is still in the previous mode, so the app must say so too.
      modeRef.current = previousMode;
      throw error;
    } finally {
      busyRef.current = false;
    }
  }, []);

  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      cesdkRef.current = cesdk;

      // Register before the first applyMode() so each mode's navigation bar
      // order can already reference the component.
      registerModeSwitch(cesdk, {
        getMode: () => modeRef.current,
        isBusy: () => busyRef.current,
        onChange: handleModeChange
      });

      await applyMode(cesdk, INITIAL_MODE);
      await cesdk.loadFromURL(sceneUrl);
      await cesdk.actions.run('zoom.toPage', { autoFit: true });
    },
    [sceneUrl, handleModeChange]
  );

  return (
    <div className={styles.app}>
      <div className={styles.editorWrapper}>
        <CreativeEditor
          className={styles.editor}
          config={config}
          init={handleInit}
        />
      </div>
    </div>
  );
}
