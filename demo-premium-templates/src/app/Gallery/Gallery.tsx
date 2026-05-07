/**
 * Gallery Component
 *
 * Displays premium templates in a categorized grid view.
 * Users can browse templates by category and click to open them in the editor.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { CATEGORIES, PREMIUM_TEMPLATES_BASE_URL } from './Gallery.const';
import type { TemplateAsset, TemplateSourceData } from './Gallery.types';

import styles from './Gallery.module.css';

// ============================================================================
// Types
// ============================================================================

interface GalleryProps {
  onSelectTemplate: (template: TemplateAsset) => void;
}

// ============================================================================
// Component
// ============================================================================

export default function Gallery({ onSelectTemplate }: GalleryProps) {
  const [templates, setTemplates] = useState<TemplateAsset[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('e-commerce');
  const [isLoading, setIsLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch templates on mount
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch(
          `${PREMIUM_TEMPLATES_BASE_URL}/dist/templates/content.json`
        );
        const data: TemplateSourceData = await response.json();

        // Replace {{base_url}} placeholders with actual CDN URL
        const jsonString = JSON.stringify(data);
        const replacedString = jsonString.replace(
          /\{\{base_url\}\}/g,
          `${PREMIUM_TEMPLATES_BASE_URL}/dist`
        );
        const modifiedData: TemplateSourceData = JSON.parse(replacedString);

        setTemplates(modifiedData.assets || []);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  // Get templates for a specific category
  const getTemplatesForCategory = useCallback(
    (categoryId: string): TemplateAsset[] => {
      const category = CATEGORIES.find((c) => c.id === categoryId);
      if (!category) return [];

      return templates.filter((template) =>
        template.groups.some((group) =>
          group.toLowerCase().includes(category.groupPattern.toLowerCase())
        )
      );
    },
    [templates]
  );

  // Handle category tab click
  const handleCategoryClick = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);

    // Scroll to the category section within the gallery container
    const section = document.getElementById(`category-${categoryId}`);
    const container = contentRef.current;
    if (section && container) {
      const sectionTop = section.offsetTop - container.offsetTop;
      container.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }
  }, []);

  // Handle template card click
  const handleTemplateClick = useCallback(
    (template: TemplateAsset) => {
      onSelectTemplate(template);
    },
    [onSelectTemplate]
  );

  // Render loading state
  if (isLoading) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.galleryLoading}>
          <div className={styles.loadingSpinner} />
          <p>Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      {/* Header with category tabs */}
      <div className={styles.galleryHeader}>
        <div className={styles.categoryTabs}>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              className={classNames(styles.categoryTab, {
                [styles.active]: category.id === selectedCategory
              })}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery content with all categories */}
      <div className={styles.galleryContent} ref={contentRef}>
        <div className={styles.galleryInner}>
          {CATEGORIES.map((category) => {
            const categoryTemplates = getTemplatesForCategory(category.id);
            if (categoryTemplates.length === 0) return null;

            return (
              <section
                key={category.id}
                id={`category-${category.id}`}
                className={styles.categorySection}
              >
                <h2 className={styles.categoryTitle}>{category.label}</h2>
                <div className={styles.templateGrid}>
                  {categoryTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`${styles.templateCard} template-card`}
                      onClick={() => handleTemplateClick(template)}
                    >
                      <div className={styles.templateThumbnail}>
                        <img
                          src={template.meta.thumbUri}
                          alt={template.label.en}
                          loading="lazy"
                        />
                        <div className={styles.templateOverlay}>
                          <span className={styles.useTemplateBtn}>
                            Open &gt;
                          </span>
                        </div>
                      </div>
                      <div className={styles.templateLabel}>
                        {template.label.en}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
