'use client';

import classNames from 'classnames';
import { useState } from 'react';
import classes from './CaseComponent.module.css';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { SegmentedControl } from './components/SegmentedControl';

const CaseComponent = () => {
  const [selectedImage, setSelectedImage] = useState(IMAGE_URLS[0]);
  const [selectedCropPreset, setSelectedCropPreset] = useState(CROP_PRESETS[0]);
  const [selectedCropMode, setSelectedCropMode] = useState(CROP_MODES[0]);
  const [appliedButtonClickCount, setAppliedButtonClickCount] = useState(0);

  const config = useConfig(
    () => ({
      role: 'Creator',
      theme: 'light',
      callbacks: {
        onExport: 'download',
        onUpload: 'local',
        onBack: () => {
          setSelectedImage(null);
        }
      },
      ui: {
        elements: {
          navigation: {
            show: false
          },
          dock: {
            show: false
          }
        }
      },
      license: process.env.NEXT_PUBLIC_LICENSE
    }),
    []
  );

  const configure = useConfigure(
    async (instance) => {
      await instance.addDefaultAssetSources();
      await instance.addDemoAssetSources({ sceneMode: 'Design' });
      // Disable placeholder and preview features
      instance.feature.enable('ly.img.placeholder', false);
      instance.feature.enable('ly.img.preview', false);
