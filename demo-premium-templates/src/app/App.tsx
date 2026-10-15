/**
 * App Component
 *
 * Main application component that orchestrates the gallery and the editor.
 * Demonstrates a two-step workflow:
 * 1. Template Gallery - Browse and select premium templates by category
 * 2. Design Editor - Edit the selected template with full CE.SDK capabilities
 *
 * One editor is created when the page loads and kept for the whole visit. The
 * gallery lists the templates from it, and every template opens in it.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { AssetResult, Configuration } from '@cesdk/cesdk-js';
import CreativeEditor from '@cesdk/cesdk-js/react';
import classNames from 'classnames';

import { initPremiumTemplatesEditor } from '../imgly';
import {
  createPremiumTemplatesAssetSource,
  listPremiumTemplates,
  openPremiumTemplate
} from '../imgly/premium-templates';
import Gallery from './Gallery/Gallery';
import { CATEGORIES } from './Gallery/Gallery.const';

import styles from './App.module.css';


// ============================================================================
// Types
// ============================================================================

interface AppProps {
  config: Configuration;
}

type Status =
  | { kind: 'gallery' }
  | { kind: 'opening'; label: string }
  | { kind: 'editing' }
  | { kind: 'openFailed' }
  | { kind: 'startFailed' }
  | { kind: 'catalogueFailed' };

// ============================================================================
// Component
// ============================================================================

export default function App({ config }: AppProps) {
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  // An open that finishes after the visitor went back must not show the editor
  const openSequenceRef = useRef(0);
  const [templates, setTemplates] = useState<AssetResult[][] | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'gallery' });

  const isEditing = status.kind === 'editing';
  const isBusy =
    status.kind === 'opening' ||
    (templates == null &&
      status.kind !== 'startFailed' &&
      status.kind !== 'catalogueFailed');

  // Hidden, not unmounted: the editor keeps its engine and its layout
  useEffect(() => {
    editorRef.current?.toggleAttribute('inert', !isEditing);
  }, [isEditing]);

  const handleClose = useCallback(() => {
    openSequenceRef.current += 1;
    setStatus({ kind: 'gallery' });
  }, []);

  const handleSelectTemplate = useCallback(async (template: AssetResult) => {
    // Cards exist only once init has stored the editor
    const cesdk = cesdkRef.current as CreativeEditorSDK;
    const sequence = ++openSequenceRef.current;
    setStatus({ kind: 'opening', label: template.label ?? template.id });
    try {
      await openPremiumTemplate(cesdk, template);
      if (sequence === openSequenceRef.current) setStatus({ kind: 'editing' });
    } catch (error) {
      if (sequence !== openSequenceRef.current) return;
      console.error('Failed to open the template:', error);
      setStatus({ kind: 'openFailed' });
    }
  }, []);

  // Never changes identity, so the editor is created once
  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      cesdkRef.current = cesdk;

      cesdk.ui.registerComponent(
        'ly.img.close.navigationBar',
        ({ builder }) => {
          builder.Button('close', {
            label: 'common.close',
            icon: '@imgly/Cross',
            variant: 'regular',
            onClick: handleClose
          });
        }
      );

      await initPremiumTemplatesEditor(cesdk);

      // Hide page title in editor
      cesdk.engine.editor.setSetting('page/title/show', false);

      // A template can only be applied to an existing scene, so start with an
      // empty design that the first picked template replaces
      await cesdk.actions.run('scene.create', { mode: 'Design' });

      // Added apart from the editor setup, so a catalogue that cannot be read
      // is reported as that and not as an editor that failed to start
      try {
        await cesdk.addPlugin(createPremiumTemplatesAssetSource());
        setTemplates(
          await listPremiumTemplates(
            cesdk.engine,
            CATEGORIES.map((category) => category.id)
          )
        );
      } catch (error) {
        console.error('Failed to list the premium templates:', error);
        setStatus({ kind: 'catalogueFailed' });
      }
    },
    [handleClose]
  );

  const handleError = useCallback((error: unknown) => {
    console.error('Failed to start the editor:', error);
    setStatus({ kind: 'startFailed' });
  }, []);

  const reload = useCallback(() => window.location.reload(), []);

  return (
    <div className={styles.app} aria-busy={isBusy}>
      {/* Template Gallery (always visible behind the editor) */}
      <Gallery templates={templates} onSelectTemplate={handleSelectTemplate} />

      {/* Editor, created once and hidden while the gallery shows */}
      <div
        ref={editorRef}
        className={classNames(styles.editorOverlay, {
          [styles.hidden]: !isEditing
        })}
        aria-hidden={!isEditing}
      >
        <div className={styles.editorModal}>
          <CreativeEditor
            className={styles.cesdkContainer}
            config={config}
            init={handleInit}
            onError={handleError}
          />
        </div>
      </div>

      {status.kind === 'opening' && (
        <div className={styles.statusLayer} role="status">
          <div className={styles.statusCard}>
            <div className={styles.spinner} />
            <p>Opening {status.label}…</p>
            <button
              type="button"
              className={styles.statusButton}
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {status.kind === 'openFailed' && (
        <div className={styles.statusLayer} role="alert">
          <div className={styles.statusCard}>
            <p>This template could not be opened.</p>
            <button
              type="button"
              className={styles.statusButton}
              onClick={handleClose}
            >
              Back to templates
            </button>
          </div>
        </div>
      )}

      {(status.kind === 'startFailed' || status.kind === 'catalogueFailed') && (
        <div className={styles.statusLayer} role="alert">
          <div className={styles.statusCard}>
            <p>
              {status.kind === 'startFailed'
                ? 'The editor could not start.'
                : 'The templates could not be loaded.'}
            </p>
            <button
              type="button"
              className={styles.statusButton}
              onClick={reload}
            >
              Reload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
