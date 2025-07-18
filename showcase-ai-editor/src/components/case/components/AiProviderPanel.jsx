import { useState, useCallback, useEffect } from 'react';
import styles from './AiProviderPanel.module.css';
import classNames from 'classnames';

const AiProviderPanel = ({ providers, onApplyChanges }) => {
  const [localProviders, setLocalProviders] = useState(providers || {});
  const [expandedSections, setExpandedSections] = useState(() => {
    return Object.keys(providers || {}).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
  });

  // Sync local providers with props when they change
  useEffect(() => {
    if (providers) {
      setLocalProviders(providers);
    }
  }, [providers]);

  // Check if there are changes between local and original providers
  const hasChanges = JSON.stringify(localProviders) !== JSON.stringify(providers);

  const toggleSection = useCallback((sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  }, []);

  const handleProviderToggle = useCallback((sectionKey, providerIndex) => {
    setLocalProviders(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        providers: prev[sectionKey].providers.map((provider, index) =>
          index === providerIndex
            ? { ...provider, selected: !provider.selected }
            : provider
        )
      }
    }));
  }, []);

  const renderProviderSection = (sectionKey, section) => {
    const isExpanded = expandedSections[sectionKey];
    const selectedCount = section.providers.filter(p => p.selected).length;
    const totalCount = section.providers.length;

    return (
      <div key={sectionKey} className={styles.section}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection(sectionKey)}
        >
          <div className={styles.sectionTitle}>
            <span className={classNames(styles.expandIcon, {
              [styles.expanded]: isExpanded
            })}></span>
            <span>{section.name}</span>
          </div>
          <span className={styles.sectionCount}>
            {selectedCount}/{totalCount}
          </span>
        </div>
        
        {isExpanded && (
          <div className={styles.sectionContent}>
            {section.providers.map((provider, index) => (
              <div key={index} className={classNames(styles.providerItem, {
                [styles.selected]: provider.selected
              })}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={provider.selected}
                    onChange={() => handleProviderToggle(sectionKey, index)}
                  />
                  <span className={styles.checkmark}></span>
                  <div className={styles.providerInfo}>
                    <span className={styles.providerName}>{provider.name}</span>
                    <span className={styles.providerLabel}>{provider.label}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>AI Providers</h2>
        <p className={styles.subtitle}>
          Select which AI Providers you want to include in CE.SDK
        </p>
      </div>
      
      <div className={styles.sectionsContainer}>
        {Object.entries(localProviders).map(([key, section]) =>
          renderProviderSection(key, section)
        )}
      </div>
      
      <div className={styles.footer}>
        <button
          className={'button button--primary button--small'}
          onClick={() => onApplyChanges(localProviders)}
          disabled={!hasChanges}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default AiProviderPanel;
