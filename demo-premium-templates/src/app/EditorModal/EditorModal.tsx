/**
 * Editor Modal Component
 *
 * Modal wrapper for CE.SDK editor. Displays when a template is selected
 * and allows full editing capabilities.
 */

import { useCallback } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import { initPremiumTemplatesEditor } from '../../imgly';
import type { TemplateAsset } from '../Gallery/Gallery.types';

import styles from './EditorModal.module.css';

// ============================================================================
// Types
// ============================================================================

interface EditorModalProps {
  isOpen: boolean;
  template: TemplateAsset | null;
  config: Configuration;
  onClose: () => void;
}

// ============================================================================
// Component
// ============================================================================

export default function EditorModal({
  isOpen,
  template,
  config,
  onClose
}: EditorModalProps) {
  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      (window as any).cesdk = cesdk;

      // Register close callback using Order API
      cesdk.ui.registerComponent(
        'ly.img.close.navigationBar',
        ({ builder }) => {
          builder.Button('close', {
            label: 'common.close',
            icon: '@imgly/Cross',
            variant: 'regular',
            onClick: onClose
          });
        }
      );

      // Initialize the editor with premium templates plugin
      await initPremiumTemplatesEditor(cesdk);

      // Hide page title in editor
      cesdk.engine.editor.setSetting('page/title/show', false);

      // Load the selected template
      if (template?.meta?.uri) {
        await cesdk.load(template.meta.uri);

        // Set the scene name to display in the navigation bar title
        const scene = cesdk.engine.scene.get();
        if (scene) {
          cesdk.engine.block.setName(scene, template.label.en);
        }

        // Deselect any selected blocks
        cesdk.engine.block.findAllSelected().forEach((block) => {
          cesdk.engine.block.setSelected(block, false);
        });

        // Zoom to first page
        const pages = cesdk.engine.scene.getPages();
        if (pages.length > 0) {
          await cesdk.actions.run('zoom.toBlock', pages[0], {
            autoFit: false,
            animate: false
          });
        }
      }
    },
    [template, onClose]
  );

  if (!isOpen || !template) return null;

  return (
    <div className={styles.editorOverlay}>
      <div className={styles.editorModal}>
        <CreativeEditor
          key={template.id}
          className={styles.cesdkContainer}
          config={config}
          init={handleInit}
        />
      </div>
    </div>
  );
}
