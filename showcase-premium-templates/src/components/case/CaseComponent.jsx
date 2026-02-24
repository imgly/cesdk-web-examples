'use client';

import { useEffect, useRef, useState } from 'react';
import classes from './CaseComponent.module.css';
import { CESDKModal } from './components/CESDKModal';
import { SegmentedControl } from './components/SegmentedControl';
import ChevronRightIcon from './icons/ChevronRight.svg';
import {
  getTemplateBaseURL,
  persistSelectedTemplateToURL
} from './lib/PremiumTemplateUtilities';

const CATEGORIES = [
  { label: 'E-commerce', value: 'e-commerce' },
  { label: 'Event', value: 'event' },
  { label: 'Personal', value: 'personal' },
  { label: 'Professional', value: 'professional' },
  { label: 'Socials', value: 'socials' }
];

const CaseComponent = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const baseURL = getTemplateBaseURL();
      if (!baseURL) {
        setAssets([]);
        return;
      }

      try {
        const response = await fetch(`${baseURL}/dist/templates/content.json`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAssets(data.assets || []);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
        setAssets([]);
      }
    };

    fetchAssets();
  }, []);
  const [currentCategory, setCurrentCategory] = useState(CATEGORIES[0].value);
  const [currentAsset, setCurrentAsset] = useState(undefined);
  const containerRef = useRef(null);

  // Check URL for template parameter after assets are loaded
  useEffect(() => {
    if (assets.length > 0) {
      const templateId = new URL(window.location.href).searchParams.get(
        'template'
      );
      if (templateId) {
        const asset = assets.find((a) => a.id === templateId);
        if (asset) {
          setCurrentAsset(asset);
        }
      }
    }
  }, [assets]);

  useEffect(() => {
    if (containerRef.current && currentAsset) {
      persistSelectedTemplateToURL(currentAsset.id);
      // prevent background scrolling when modal is open
      document.body.classList.add('no-scroll');
    } else {
      // enable scrolling again when modal is closed
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [currentAsset]);

  return (
    <div className={classes.container} ref={containerRef}>
      <SegmentedControl
        options={CATEGORIES}
        onChange={(value) => {
          setCurrentCategory(value);
          const element = document.getElementById(value);
          element?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }}
        value={currentCategory}
      />
      {CATEGORIES.map((category) => (
        <section
          className={classes.wrapperCategory}
          key={category.value}
          id={category.value}
        >
          <h3 className="h3">{category.label}</h3>
          <div className={classes.wrapperTemplates}>
            {assets
              .filter((asset) => asset.groups[0] === category.value)
              .map((asset) => (
                <div className={classes.wrapperAsset} key={asset.id}>
                  <div className={classes.wrapperThumbnail}>
                    <img
                      src={asset.meta.thumbUri.replace(
                        '{{base_url}}',
                        getTemplateBaseURL() + '/dist'
                      )}
                      alt={asset.label.en}
                    />
                    <div className={classes.overlay}>
                      <button
                        onClick={() => setCurrentAsset(asset)}
                        className={classes.openButton}
                      >
                        <span>Open</span>
                        <ChevronRightIcon />
                      </button>
                    </div>
                  </div>
                  <div className={classes.assetLabel}>{asset.label.en}</div>
                </div>
              ))}
          </div>
        </section>
      ))}
      {currentAsset && (
        <CESDKModal
          asset={currentAsset}
          onClose={() => {
            setCurrentAsset(undefined);
            const url = new URL(window.location.href);
            url.searchParams.delete('template');
            window.history.pushState({}, '', url);
          }}
        />
      )}
    </div>
  );
};

export default CaseComponent;
