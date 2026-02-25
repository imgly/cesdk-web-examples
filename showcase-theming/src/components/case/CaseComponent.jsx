'use client';

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

import { ColorPicker } from '@/components/ui/ColorPicker/ColorPicker';
import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import { useState } from 'react';
import {
  generateColorAbstractionTokensAccent,
  generateColorAbstractionTokensActive,
  generateColorAbstractionTokensBackground,
  generateStaticTokens
} from './color';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';
import { DesignEditorConfig } from './lib/design-editor/plugin';
import { addPremiumTemplatesAssetSource } from './lib/PremiumTemplateUtilities';

const themeColors = {
  light: {
    backgroundColor: '#D6DBE1',
    activeColor: '#4E545A',
    accentColor: '#4260F5'
  },
  dark: {
    backgroundColor: '#121A21',
    activeColor: '#F5F5F5',
    accentColor: '#415AD3'
  }
};

const ThemingCESDK = () => {
  const [chosenTheme, setChosenTheme] = useState('dark');
  const [scale, setScale] = useState('normal');
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [accentColor, setAccentColor] = useState(null);

  const useCustomTheme = !!backgroundColor || !!activeColor || !!accentColor;
  const calculatedTheme = useCustomTheme ? 'custom' : chosenTheme;
  const resetCustomTheme = () => {
    setBackgroundColor(null);
    setActiveColor(null);
    setAccentColor(null);
  };

  const config = useConfig(
    () => ({
      theme: chosenTheme,
      role: 'Creator',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        scale: scale,
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
      }
    }),
    [chosenTheme, scale]
  );

  const configure = useConfigure(async (instance) => {
    // Add the design editor configuration plugin first
    await instance.addPlugin(new DesignEditorConfig());

    // Asset Source Plugins (replaces addDefaultAssetSources)
    await instance.addPlugin(new ColorPaletteAssetSource());
    await instance.addPlugin(new TypefaceAssetSource());
    await instance.addPlugin(new TextAssetSource());
    await instance.addPlugin(new TextComponentAssetSource());
    await instance.addPlugin(new VectorShapeAssetSource());
    await instance.addPlugin(new StickerAssetSource());
    await instance.addPlugin(new EffectsAssetSource());
    await instance.addPlugin(new FiltersAssetSource());
    await instance.addPlugin(new BlurAssetSource());
    await instance.addPlugin(new PagePresetsAssetSource());
    await instance.addPlugin(new CropPresetsAssetSource());
    await instance.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    );

    // Demo assets (replaces addDemoAssetSources)
    await instance.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    );

    await addPremiumTemplatesAssetSource(instance);
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/example-1.scene`
    );
  }, []);

  const customThemeStyle = useCustomTheme
    ? generateCustomThemeStyle(
        generateCustomTheme(
          backgroundColor || themeColors[chosenTheme].backgroundColor,
          activeColor || themeColors[chosenTheme].activeColor,
          accentColor || themeColors[chosenTheme].accentColor
        )
      )
    : '';

  return (
    <div style={wrapperStyle}>
      <style>{customThemeStyle}</style>
      <div className="cesdkWrapperStyle">
        <CreativeEditor
          className="cesdkStyle"
          config={config}
          configure={configure}
        />
      </div>
      <div style={sidebarStyle}>
        <div>
          <SegmentedControl
            label="UI Scaling"
            options={[
              { label: 'Normal', value: 'normal' },
              { label: 'Large', value: 'large' }
            ]}
            value={scale}
            name="scale"
            onChange={(value) => setScale(value)}
          />
        </div>
        <hr />
        <SegmentedControl
          label="Theme"
          options={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' }
          ]}
          value={calculatedTheme}
          name="theme"
          onChange={(value) => {
            resetCustomTheme();
            setChosenTheme(value);
          }}
        />
        <ColorPicker
          label="Background"
          value={backgroundColor || themeColors[chosenTheme]?.backgroundColor}
          name="backgroundColor"
          onChange={(value) => setBackgroundColor(value)}
          presetColors={['#DCDFE1', '#230D38', '#242623', '#FCEFEB', '#060709']}
        />
        <ColorPicker
          label="Active"
          value={activeColor || themeColors[chosenTheme]?.activeColor}
          name="activeColor"
          onChange={(value) => setActiveColor(value)}
          presetColors={['#5D6266', '#D142A3', '#BBC6A4', '#F4BCAC', '#4D5E6D']}
        />
        <ColorPicker
          label="Accent"
          value={accentColor || themeColors[chosenTheme]?.accentColor}
          name="accentColor"
          onChange={(value) => setAccentColor(value)}
          presetColors={['#3E4044', '#66D3EB', '#F6CE4B', '#265E7A', '#D0FDEB']}
        />
      </div>
    </div>
  );
};

const generateCustomTheme = (backgroundColor, activeColor, accentColor) => ({
  ...generateColorAbstractionTokensAccent(accentColor),
  ...generateColorAbstractionTokensBackground(backgroundColor),
  ...generateColorAbstractionTokensActive(activeColor),
  ...generateStaticTokens()
});
const generateCustomThemeStyle = (customThemeProperties) => `
  .ubq-public{
    ${Object.entries(customThemeProperties)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n')}
  }
`;

const wrapperStyle = {
  minHeight: '640px',
  display: 'flex',
  borderRadius: '0.75rem',
  flexGrow: '1',
  gap: '1rem'
};
const sidebarStyle = {
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  background: '#fff',
  borderRadius: '16px',
  boxShadow:
    '0px 0px 2px rgba(22, 22, 23, 0.25), 0px 4px 6px -2px rgba(22, 22, 23, 0.12), 0px 2px 2.5px -2px rgba(22, 22, 23, 0.12), 0px 1px 1.75px -2px rgba(22, 22, 23, 0.12)',
  color: '#161617',
  flexBasis: '280px',
  flexShrink: 0,
  padding: '16px 20px',
  gap: '16px'
};

export default ThemingCESDK;
