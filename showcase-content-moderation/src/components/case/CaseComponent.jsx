import CreativeEditorSDK from '@cesdk/cesdk-js';
import ValidationBox from 'components/ui/ValidationBox/ValidationBox';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { ReactComponent as RefreshIcon } from './refresh.svg';
import { checkImageContent, selectAllBlocks } from './restrictionsUtility';

const ImageComplianceCESDK = () => {
  const cesdkContainer = useRef(null);
  const cesdkRef = useRef(null);

  const [validationResults, setValidationResults] = useState([]);
  const [checkRan, setCheckRan] = useState(false);

  const runImageModerationCheck = useCallback(async () => {
    if (!cesdkRef.current) {
      return;
    }
    setCheckRan(false);
    const validationResults = await checkImageContent(cesdkRef.current);
    setValidationResults(validationResults);
    setCheckRan(true);
  }, [setValidationResults]);

  const onSave = useCallback(
    (blobs, options) => {
      runImageModerationCheck();
      return Promise.resolve();
    },
    [runImageModerationCheck]
  );
  useEffect(() => {
    let config = {
      role: 'Adopter',
      license: process.env.REACT_APP_LICENSE,
      theme: 'light',
      initialSceneURL: `${window.location.protocol + "//" + window.location.host}/cases/content-moderation/example.scene`,
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
    if (cesdkContainer.current && !cesdkRef.current) {
      CreativeEditorSDK.init(cesdkContainer.current, config).then(
        (instance) => {
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources();
          cesdkRef.current = instance;
        }
      );
    }
    return () => {
      if (cesdkRef.current) {
        cesdkRef.current.dispose();
      }
    };
  }, [cesdkContainer, onSave]);

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
          onClick: () => selectAllBlocks(cesdkRef.current, [blockId])
        })
      ),
    [validationResults]
  );

  return (
    <div style={wrapperStyle}>
      <div style={cesdkWrapperStyle}>
        <div ref={cesdkContainer} style={cesdkStyle}></div>
      </div>
      <div style={sidebarStyle}>
        <ValidationBox
          checkStatus={checkRan ? 'performed' : 'pending'}
          results={normalizedResults}
          emptyComponent={<>No check has been performed yet.</>}
          headerComponent={
            <button
              onClick={() => runImageModerationCheck()}
              className={'button button--primary space-x-2'}
            >
              <span>Validate Content</span>
              <RefreshIcon />
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
