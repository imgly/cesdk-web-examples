'use client';

import ValidationBox from '@/components/ui/ValidationBox/ValidationBox';
import { useCallback, useMemo, useState } from 'react';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';
import RefreshIcon from './refresh.svg';
import { checkImageContent, selectAllBlocks } from './restrictionsUtility';

const ImageComplianceCESDK = () => {
  const [validationResults, setValidationResults] = useState([]);
  const [checkRan, setCheckRan] = useState(false);
  const [cesdk, setCesdk] = useCreativeEditor();

  const runImageModerationCheck = useCallback(async () => {
    if (!cesdk) {
      return;
    }
    setCheckRan(false);
    const validationResults = await checkImageContent(cesdk.engine);
    setValidationResults(validationResults);
    setCheckRan(true);
  }, [cesdk, setValidationResults]);

  const config = useConfig(
    () => ({
      role: 'Adopter',
      license: process.env.NEXT_PUBLIC_LICENSE,
      theme: 'light',
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
          },
          libraries: {
            insert: {
              entries: (defaultEntries) => {
                return [
                  ...defaultEntries.filter(
                    ({ id }) => !['ly.img.upload'].includes(id)
                  )
                ];
              }
            }
          }
        }
      },
      callbacks: {
        onExport: 'download'
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    await instance.addDefaultAssetSources();
    await instance.addDemoAssetSources({ sceneMode: 'Design' });
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/content-moderation/example.scene`
    );
  }, []);

  const normalizedResults = useMemo(
    () =>
      validationResults.map(
        ({ blockId, state, blockType, blockName, name, description }) => ({
          state,
          blockType,
          blockName,
          validationName: name,
          validationDescription: description,
          id: blockId + name,
          onClick: () => selectAllBlocks(cesdk.engine, [blockId])
        })
      ),
    [validationResults, cesdk]
  );

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
      <div style={sidebarStyle}>
        <ValidationBox
          checkStatus={checkRan ? 'performed' : 'pending'}
          results={normalizedResults}
          emptyComponent={<>No check has been performed yet.</>}
          headerComponent={
            <button
              onClick={() => runImageModerationCheck()}
              className={'button button--primary button--small'}
            >
              <RefreshIcon />
              <span>Validate Content</span>
            </button>
          }
          successComponent={
            <>
              No content violations found. <br />
              Add possibly offensive content and run it again.
            </>
          }
        />
      </div>
    </div>
  );
};

const wrapperStyle = {
  flex: '1',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem'
};
const sidebarStyle = {
  flexBasis: '280px',
  flexShrink: 0
};

export default ImageComplianceCESDK;
