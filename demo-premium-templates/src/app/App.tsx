/**
 * App Component
 *
 * Main application component that orchestrates the gallery and editor modal.
 * Demonstrates a two-step workflow:
 * 1. Template Gallery - Browse and select premium templates by category
 * 2. Design Editor - Edit the selected template in a modal with full CE.SDK capabilities
 */

import { useCallback, useState } from 'react';

import EditorModal from './EditorModal/EditorModal';
import Gallery from './Gallery/Gallery';
import type { TemplateAsset } from './Gallery/Gallery.types';

import styles from './App.module.css';

// ============================================================================
// Component
// ============================================================================

export default function App() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateAsset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle template selection from gallery
  const handleSelectTemplate = useCallback((template: TemplateAsset) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  }, []);

  return (
    <div className={styles.app}>
      {/* Template Gallery (always visible) */}
      <Gallery onSelectTemplate={handleSelectTemplate} />

      {/* Editor Modal (shown when template is selected) */}
      <EditorModal
        isOpen={isModalOpen}
        template={selectedTemplate}
        onClose={handleCloseModal}
      />
    </div>
  );
}
