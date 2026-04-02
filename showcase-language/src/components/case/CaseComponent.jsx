'use client';

import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import { useCallback, useRef, useState } from 'react';

import CreativeEditor from '@cesdk/cesdk-js/react';
import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './lib/design-editor/plugin';
import { addPremiumTemplatesAssetSource } from './lib/PremiumTemplateUtilities';

const config = {
  role: 'Creator',
  theme: 'light',
  license: process.env.NEXT_PUBLIC_LICENSE,
  ui: {
    elements: {
      panels: {
        settings: true
      },
      navigation: {
        action: {
          export: {
            show: true,
            format: ['image/png', 'application/pdf']
          }
        }
      }
    }
  },
  callbacks: {
    onExport: 'download',
    onUpload: 'local'
  }
};

const CaseComponent = () => {
  const [locale, setLocale] = useState('en');
  const cesdkRef = useRef(null);

  // initialization function called after SDK instance is created
  const init = useCallback(async (instance) => {
    // Add the design editor configuration plugin first
    await instance.addPlugin(new DesignEditorConfig());

    // Add default asset sources via plugins
    await instance.addPlugin(new ColorPaletteAssetSource());
    await instance.addPlugin(new TypefaceAssetSource());
    await instance.addPlugin(new TextAssetSource());
    await instance.addPlugin(new TextComponentAssetSource());
    await instance.addPlugin(new StickerAssetSource());
    await instance.addPlugin(new VectorShapeAssetSource());
    await instance.addPlugin(new FiltersAssetSource());
    await instance.addPlugin(new EffectsAssetSource());
    await instance.addPlugin(new BlurAssetSource());
    await instance.addPlugin(new CropPresetsAssetSource());
    await instance.addPlugin(new PagePresetsAssetSource());
    await instance.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    );
    // Add demo asset sources
    await instance.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    );

    await addPremiumTemplatesAssetSource(instance);

    // create a new design scene in the editor
    await instance.createDesignScene();

    cesdkRef.current = instance;
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/example-1.scene`
    );
  }, []);

  const handleLocaleChange = (newLocale) => {
    setLocale(newLocale);
    if (cesdkRef.current) {
      cesdkRef.current.i18n.setLocale(newLocale);
    }
  };

  return (
    <div style={wrapperStyle} className="space-y-2">
      <div className="flex flex-col items-center mobile-padding-top">
        <SegmentedControl
          options={[
            {
              label: 'English',
              value: 'en'
            },
            {
              label: 'German',
              value: 'de'
            }
          ]}
          value={locale}
          name="locale"
          onChange={handleLocaleChange}
          size="md"
        />
      </div>
      <div className="cesdkWrapperStyle">
        <CreativeEditor
          config={config}
          init={init}
          key={'editor'}
          className="cesdkStyle"
        />
      </div>
    </div>
  );
};

const wrapperStyle = {
  flexGrow: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyItems: 'center',
  justifyContent: 'center'
};

export default CaseComponent;
