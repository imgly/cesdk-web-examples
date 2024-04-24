'use client';

import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import { useState } from 'react';
import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const [locale, setLocale] = useState('en');
  const config = useConfig(
    () => ({
      locale,
      role: 'Adopter',
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
    }),
    [locale]
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/example-1.scene`
    );
  });

  return (
    <div style={wrapperStyle} className="space-y-2">
      <div className="flex flex-col items-center">
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
          onChange={(value) => setLocale(value)}
          size="md"
        />
      </div>
      <div style={cesdkWrapperStyle}>
        <CreativeEditor
          style={cesdkStyle}
          config={config}
          configure={configure}
        ></CreativeEditor>
      </div>
    </div>
  );
};

const cesdkStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
const cesdkWrapperStyle = {
  position: 'relative',
  minHeight: '640px',
  overflow: 'hidden',
  flexGrow: 1,
  display: 'flex',
  borderRadius: '0.75rem',
  boxShadow:
    '0px 0px 2px rgba(22, 22, 23, 0.25), 0px 4px 6px -2px rgba(22, 22, 23, 0.12), 0px 2px 2.5px -2px rgba(22, 22, 23, 0.12), 0px 1px 1.75px -2px rgba(22, 22, 23, 0.12)'
};

const wrapperStyle = {
  flexGrow: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyItems: 'center',
  justifyContent: 'center'
};

export default CaseComponent;
