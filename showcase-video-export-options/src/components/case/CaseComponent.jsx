'use client';

import { ExportModal } from './ExportModal/ExportModal';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';

const ExportOptionsCESDK = () => {
  const [cesdk, setCesdk] = useCreativeEditor();
  const config = useConfig(
    () => ({
      role: 'Adopter',
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          panels: {
            settings: true
          }
        }
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Video' });
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/video-export-options/example-video-motion.scene`
    );
  }, []);

  return (
    <div style={wrapperStyle}>
      <div className="cesdkWrapperStyle">
        <CreativeEditor
          className="cesdkStyle"
          config={config}
          configure={configure}
          onInstanceChange={setCesdk}
        />
      </div>
      <div style={modalStyle}>
        {cesdk && <ExportModal engine={cesdk.engine} />}
      </div>
    </div>
  );
};
const modalStyle = {
  display: 'flex',
  overflow: 'hidden',
  /* Min height ensures that no layout jumps happen */
  minHeight: '670px',
  flexBasis: '330px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  background: '#fafafa',
  boxShadow:
    '0px 0px 2px rgba(18, 26, 33, 0.25), 0px 6px 6px -2px rgba(18, 26, 33, 0.12), 0px 2.5px 2.5px -2px rgba(18, 26, 33, 0.12), 0px 1.25px 1.25px -2px rgba(18, 26, 33, 0.12)',
  borderRadius: '12px'
};

const wrapperStyle = {
  minHeight: '640px',
  display: 'flex',
  borderRadius: '0.75rem',
  flexGrow: '1',
  gap: '1rem'
};
export default ExportOptionsCESDK;
