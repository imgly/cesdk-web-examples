/**
 * Editor Modal Component
 *
 * Modal wrapper for CE.SDK editor. Displays when a template is selected
 * and allows full editing capabilities.
 */

import { useEffect, useRef } from 'react';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initPremiumTemplatesEditor } from '../../imgly';
import type { TemplateAsset } from '../Gallery/Gallery.types';

import styles from './EditorModal.module.css';

// ============================================================================
// Types
// ============================================================================

interface EditorModalProps {
  isOpen: boolean;
  template: TemplateAsset | null;
  onClose: () => void;
}

// ============================================================================
// Component
// ============================================================================

export default function EditorModal({
  isOpen,
  template,
  onClose
}: EditorModalProps) {
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize CE.SDK when modal opens
  useEffect(() => {
    if (!isOpen || !template || !containerRef.current) return;

    let mounted = true;

    async function initializeEditor() {
      if (!containerRef.current) return;

      const config = {
        userId: 'demo-premium-templates-editor-user',
        role: 'Adopter' as const,

        // Local assets for development
        ...(import.meta.env.CESDK_USE_LOCAL && {
          baseURL: import.meta.env.VITE_CESDK_ASSETS_BASE_URL
        })

        // license: 'YOUR_LICENSE_KEY',
      };

      try {
        // Create the editor
        const cesdk = await CreativeEditorSDK.create(
          containerRef.current,
          config
        );

        if (!mounted) {
          cesdk.dispose();
          return;
        }

        cesdkRef.current = cesdk;

        // Debug access (remove in production)
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
        if (template.meta?.uri) {
          await cesdk.loadFromArchiveURL(template.meta.uri);

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
      } catch (error) {
        console.error('Failed to initialize CE.SDK:', error);
        onClose();
      }
    }

    initializeEditor();

    // Cleanup on unmount or when modal closes
    return () => {
      mounted = false;
      if (cesdkRef.current) {
        cesdkRef.current.dispose();
        cesdkRef.current = null;
      }
    };
  }, [isOpen, template, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.editorOverlay}>
      <div className={styles.editorModal}>
        <div ref={containerRef} className={styles.cesdkContainer} />
      </div>
    </div>
  );
}
