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
          onChange={(value) => setLocale(value)}
          size="md"
        />
      </div>
      <div className="cesdkWrapperStyle">
        <CreativeEditor
          className="cesdkStyle"
          config={config}
          configure={configure}
        ></CreativeEditor>
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
