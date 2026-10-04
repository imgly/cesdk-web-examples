/**
 * Gallery Component
 *
 * Displays premium templates in a categorized grid view.
 * Users can browse templates by category and click to open them in the editor.
 */

import { useCallback, useRef, useState } from 'react';
import type { AssetResult } from '@cesdk/cesdk-js';
import classNames from 'classnames';

import { CATEGORIES } from './Gallery.const';

import styles from './Gallery.module.css';

// ============================================================================
// Types
// ============================================================================

interface GalleryProps {
  /**
   * The templates of each category, in the order of CATEGORIES. `null` while
   * they are listed, which shows placeholder cards.
   */
  templates: AssetResult[][] | null;
  onSelectTemplate: (template: AssetResult) => void;
}

const PLACEHOLDER_CARDS = 5;

// ============================================================================
// Component
// ============================================================================

export default function Gallery({ templates, onSelectTemplate }: GalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('e-commerce');
  const contentRef = useRef<HTMLDivElement>(null);

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
          {CATEGORIES.map((category, index) => {
            const categoryTemplates = templates?.[index] ?? [];
            if (templates != null && categoryTemplates.length === 0) {
              return null;
            }

            return (
              <section
                key={category.id}
                id={`category-${category.id}`}
                className={styles.categorySection}
              >
                <h2 className={styles.categoryTitle}>{category.label}</h2>
                <div className={styles.templateGrid}>
                  {templates == null
                    ? Array.from({ length: PLACEHOLDER_CARDS }, (_, card) => (
                        <div
                          key={card}
                          className={styles.placeholderCard}
                          aria-hidden="true"
                        >
                          <span className={styles.placeholderThumbnail} />
                          <span className={styles.placeholderLabel} />
                        </div>
                      ))
                    : categoryTemplates.map((template) => {
                        const label = template.label ?? template.id;
                        return (
                          <button
                            key={template.id}
                            type="button"
                            aria-label={label}
                            className={`${styles.templateCard} template-card`}
                            onClick={() => onSelectTemplate(template)}
                          >
                            <span className={styles.templateThumbnail}>
                              <img
                                src={template.meta?.thumbUri}
                                alt={label}
                                loading="lazy"
                              />
                              <span className={styles.templateOverlay}>
                                <span className={styles.useTemplateBtn}>
                                  Open &gt;
                                </span>
                              </span>
                            </span>
                            <span className={styles.templateLabel}>
                              {label}
                            </span>
                          </button>
                        );
                      })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
