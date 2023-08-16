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
      },
      // Begin standard template presets
      presets: {
        templates: {
          postcard_1: {
            label: 'Postcard Design',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.png`
          },
          postcard_2: {
            label: 'Postcard Tropical',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.png`
          },
          business_card_1: {
            label: 'Business card',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_business_card_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_business_card_1.png`
          },
          instagram_photo_1: {
            label: 'Instagram photo',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_photo_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_photo_1.png`
          },
          instagram_story_1: {
            label: 'Instagram story',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_story_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_story_1.png`
          },
          poster_1: {
            label: 'Poster',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_poster_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_poster_1.png`
          },
          presentation_4: {
            label: 'Presentation',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_presentation_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_presentation_1.png`
          },
          collage_1: {
            label: 'Collage',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_collage_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_collage_1.png`
          }
        }
      }
      // End standard template presets
    };
    if (cesdk_container.current && !cesdkRef.current) {
      CreativeEditorSDK.init(cesdk_container.current, config).then(
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
    <div style={wrapperStyle}>
      <div style={headerStyle}>
        <div
          className="gap-sm flex flex-col items-start"
          style={caseHeaderStyle}
        >
          <div>
            <div className="caseHeader caseHeader--no-margin">
              <h3>Content Moderation</h3>
              <p>
                Check images for compliance with your content guidelines before
                further processing and provide user feedback.
              </p>
            </div>
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
          emptyComponent={<>No check has been performed yet.</>}
          successComponent={
            <>
              No content violations found. <br />
              Add possibly offensive content and run it again.
            </>
          }
        />
      </div>

      <div style={cesdkWrapperStyle}>
        <div ref={cesdk_container} style={cesdkStyle}></div>
      </div>
    </div>
  );
};

const caseHeaderStyle = {
  maxWidth: '50%',
  marginBottom: 0
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  color: 'white',
  gap: '2rem'
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
  gap: '1rem',
  width: '100%'
};
export default ImageComplianceCESDK;
