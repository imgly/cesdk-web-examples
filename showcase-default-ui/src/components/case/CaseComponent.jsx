'use client';

import CreativeEditor, { useConfig, useConfigure } from './lib/CreativeEditor';

const CaseComponent = () => {
  const config = useConfig(
    () => ({
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
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/example-1.scene`
    );
  }, []);

  return (
    <div className="cesdkWrapperStyle">
      <CreativeEditor
        className="cesdkStyle"
        config={config}
        configure={configure}
      />
    </div>
  );
};

export default CaseComponent;
