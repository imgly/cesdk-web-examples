'use client';

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

const DEFAULT_BACKGROUND_COLOR = '#121921';
const DEFAULT_ACTIVE_COLOR = '#FDFDFD';
const DEFAULT_ACCENT_COLOR = '#4B64E2';

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
      role: 'Adopter',
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
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
