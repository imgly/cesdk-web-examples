'use client';

import classNames from 'classnames';
import { useState } from 'react';
import classes from './CaseComponent.module.css';
import { SegmentedControl } from './components/SegmentedControl';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const [selectedImage, setSelectedImage] = useState(IMAGE_URLS[0]);
  const [selectedCropPreset, setSelectedCropPreset] = useState(CROP_PRESETS[0]);
  const [selectedCropMode, setSelectedCropMode] = useState(CROP_MODES[0]);
  const [appliedButtonClickCount, setAppliedButtonClickCount] = useState(1);

  const config = useConfig(
    () => ({
      role: 'Adopter',
      theme: 'light',
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          navigation: {
            action: {
              export: {
                show: true,
                format: ['image/png']
              }
            }
          }
        }
      },
      license: process.env.NEXT_PUBLIC_LICENSE
    }),
    []
  );

  const configure = useConfigure(
    async (instance) => {
      instance.i18n.setTranslations({
        en: {
          'component.fileOperation.exportImage': 'Export Image'
        }
      });

      await instance.addDefaultAssetSources();
      await instance.addDemoAssetSources({ sceneMode: 'Design' });
