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
  const cesdk_container = useRef(null);
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
      theme: 'light',
      initialSceneURL: `${window.location.protocol + "//" + window.location.host}/cases/content-moderation/example.scene`,
      ui: {
        elements: {
          panels: {
            settings: true
          },
          navigation: {
            action: {
              save: true
            }
          }
        }
      },
      callbacks: {
        onSave
      }
    };
    if (cesdk_container.current && !cesdkRef.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
        (instance) => {
          cesdkRef.current = instance;
        }
      );
    }
    return () => {
      if (cesdkRef.current) {
        cesdkRef.current.dispose();
      }
    };
  }, [cesdk_container, onSave]);

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
    <div style={wrapperStyle} className="space-y-2">
      <div style={headerStyle}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'start',
            maxWidth: 320
          }}
        >
          <div>
            <h3 className="h4" style={{ color: 'white' }}>
              Content Moderation
            </h3>
            <p
              style={{
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '20px',
                color: 'rgba(255, 255, 255, 0.65)'
              }}
            >
              Check images for compliance with your content guidelines before
              further processing and provide user feedback.
            </p>
          </div>
          <button
            onClick={() => runImageModerationCheck()}
            className={'button button--white space-x-2'}
          >
            <span>Validate Image Content</span>
            <RefreshIcon />
          </button>
        </div>
        <ValidationBox
          checkStatus={checkRan ? 'performed' : 'pending'}
          results={normalizedResults}
          emptyComponent={
            <div className="flex w-full flex-grow items-center justify-center text-center">
              No check has been performed yet.
            </div>
          }
          successComponent={
            <div className="flex w-full flex-grow items-center justify-center text-center">
              No content violations found. <br />
              Add possibly offensive content and run it again.
            </div>
          }
        />
      </div>

      <div style={cesdkWrapperStyle}>
        <div ref={cesdk_container} style={cesdkStyle}></div>
      </div>
    </div>
  );
};
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  color: 'white'
};

const cesdkStyle = {
  height: '100%',
  width: '100%',
  flexGrow: 1,
  overflow: 'hidden',
  borderRadius: '0.75rem'
};
const cesdkWrapperStyle = {
  borderRadius: '0.75rem',
  flexGrow: '1',
  display: 'flex',
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)'
};

const wrapperStyle = {
  flexGrow: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyItems: 'center',
  justifyContent: 'center'
};
export default ImageComplianceCESDK;
