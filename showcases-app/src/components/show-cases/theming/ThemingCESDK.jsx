import CreativeEditorSDK from '@cesdk/cesdk-js';
import React, { useEffect, useRef } from 'react';
import {
  generateColorAbstractionTokensAccent,
  generateColorAbstractionTokensActive,
  generateColorAbstractionTokensBackground
} from './color';

const DEFAULT_BACKGROUND_COLOR = '#121921';
const DEFAULT_ACTIVE_COLOR = '#FDFDFD';
const DEFAULT_ACCENT_COLOR = '#4B64E2';

const ThemingCESDK = ({
  theme = 'dark',
  scale = 'normal',
  backgroundColor = '',
  activeColor = '',
  accentColor = ''
}) => {
  const cesdk_container = useRef(null);
  const enableCustomTheme = !!backgroundColor || !!activeColor || !!accentColor;
  useEffect(() => {
    let cesdk;
    let config = {
      theme: theme,
      role: 'Adopter',
      initialSceneURL:
        'https://img.ly/showcases/cesdk/web/example-1-adopter.scene',
      callbacks: {
        onExport: (blobs) => localDownload(blobs[0], `export.png`)
      },
      ui: {
        scale: scale,
        elements: {
          panels: {
            settings: true
          },
          navigation: {
            action: {
              export: true
            }
          }
        }
      }
    };
    if (navigator.userAgent !== 'ReactSnap' && cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        (instance) => {
          cesdk = instance;
        }
      );
    }
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [theme, scale, cesdk_container]);

  const customThemeStyle = enableCustomTheme
    ? generateCustomThemeStyle(
        generateCustomTheme(
          backgroundColor || DEFAULT_BACKGROUND_COLOR,
          activeColor || DEFAULT_ACTIVE_COLOR,
          accentColor || DEFAULT_ACCENT_COLOR
        )
      )
    : '';

  return (
    <div style={wrapperStyle}>
      <style>{customThemeStyle}</style>
      <div ref={cesdk_container} style={cesdkStyle}></div>
    </div>
  );
};

const generateCustomTheme = (backgroundColor, activeColor, accentColor) => ({
  ...generateColorAbstractionTokensAccent(accentColor),
  ...generateColorAbstractionTokensBackground(backgroundColor),
  ...generateColorAbstractionTokensActive(activeColor)
});
const generateCustomThemeStyle = (customThemeProperties) => `
  .ubq-public{
    ${Object.entries(customThemeProperties)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n')}
  }
`;

const localDownload = (data, filename) => {
  return new Promise((resolve) => {
    const element = document.createElement('a');
    element.setAttribute('href', window.URL.createObjectURL(data));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    resolve();
  });
};

const cesdkStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '0.75rem'
};

const wrapperStyle = {
  borderRadius: '0.75rem',
  flexGrow: '1',
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)'
};
export default ThemingCESDK;
