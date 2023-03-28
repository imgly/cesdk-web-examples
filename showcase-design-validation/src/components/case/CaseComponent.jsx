import CreativeEditorSDK from '@cesdk/cesdk-js';
import ValidationBox from 'components/ui/ValidationBox/ValidationBox';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  getImageBlockQuality,
  getOutsideBlocks,
  getProtrudingBlocks,
  getPartiallyHiddenTexts,
  getImageLayerName,
  selectAllBlocks
} from './restrictionsUtility';

const VALIDATIONS = [
  {
    name: 'Outside of page',
    description: 'Some elements are outside of the visible area.',
    check: (cesdk) => {
      return getOutsideBlocks(cesdk).map((blockId) => ({
        blockId,
        state: 'failed',
        blockType: cesdk.engine.block.getType(blockId),
        blockName: getImageLayerName(cesdk, blockId)
      }));
    }
  },
  {
    name: 'Protrudes from page ',
    description: 'Some elements are protruding the visible area.',
    check: (cesdk) => {
      return getProtrudingBlocks(cesdk).map((blockId) => ({
        blockId,
        state: 'warning',
        blockType: cesdk.engine.block.getType(blockId),
        blockName: getImageLayerName(cesdk, blockId)
      }));
    }
  },
  {
    name: 'Text partially hidden ',
    description:
      'Some text elements are partially obstructed by other elements.',
    check: (cesdk) => {
      return getPartiallyHiddenTexts(cesdk).map((blockId) => ({
        blockId,
        state: 'warning',
        blockType: cesdk.engine.block.getType(blockId),
        blockName: getImageLayerName(cesdk, blockId)
      }));
    }
  },
  {
    name: 'Low resolution ',
    description:
      'Some elements are having a low resolution. This will lead to suboptimal results.',
    check: async (cesdk) => {
      const allImageBlocks = cesdk.engine.block.findByType('image');
      const results = await Promise.all(
        allImageBlocks.map(async (blockId) => {
          const quality = await getImageBlockQuality(cesdk, blockId);
          let state;
          if (quality < 0.7) {
            state = 'failed';
          } else if (quality >= 0.7 && quality < 1) {
            state = 'warning';
          } else {
            state = 'success';
          }
          return {
            blockId,
            state,
            quality,
            blockType: cesdk.engine.block.getType(blockId),
            blockName: getImageLayerName(cesdk, blockId)
          };
        })
      );
      return results;
    }
  }
];

const CaseComponent = () => {
  const cesdk_container = useRef(null);
  const cesdkRef = useRef(null);

  const [validationResults, setValidationResults] = useState([]);
  const [checkRan, setCheckRan] = useState(false);
  const [isDirty, setIsDirty] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const runChecks = useCallback(async () => {
    const validationResults = await Promise.all(
      VALIDATIONS.map(async ({ check, name, description }) => ({
        name,
        description,
        results: await check(cesdkRef.current)
      }))
    );
    setValidationResults(validationResults);
    setIsDirty(false);
    setCheckRan(true);
  }, [setValidationResults]);

  useEffect(() => {
    setInterval(() => setIsDirty(true), 2000);
  }, [setIsDirty]);
  useEffect(() => {
    if (isDirty && isInitialized) {
      runChecks();
    }
  }, [isDirty, isInitialized, runChecks]);

  useEffect(() => {
    let config = {
      role: 'Adopter',
      theme: 'light',
      initialSceneURL: `${window.location.protocol + "//" + window.location.host}/cases/design-validation/example.scene`,
      license: process.env.REACT_APP_LICENSE,
      ui: {
        elements: {
          panels: {
            settings: true
          },
          libraries: {
            template: false
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
          setIsInitialized(true);
        }
      );
    }
    return () => {
      if (cesdkRef.current) {
        cesdkRef.current.dispose();
      }
    };
  }, [cesdk_container]);

  const normalizedResults = useMemo(
    () =>
      validationResults.flatMap(({ name, description, results }) =>
        results.map(({ blockId, state, blockType, blockName }) => ({
          state,
          blockType,
          blockName,
          validationName: name,
          validationDescription: description,
          id: blockId + name,
          onClick: () => selectAllBlocks(cesdkRef.current, [blockId])
        }))
      ),
    [validationResults]
  );

  return (
    <div style={wrapperStyle}>
      <div style={headerStyle}>
        <div
          className="caseHeader caseHeader--no-margin"
          style={caseHeaderStyle}
        >
          <h3>Design Validation</h3>
          <p>
            Set validation rules to provide design and layout feedback. For
            example, check if elements protrude the page or enforce a minimum
            image resolution.
          </p>
        </div>
        <ValidationBox
          checkStatus={checkRan ? 'performed' : 'pending'}
          results={normalizedResults}
          emptyComponent={<>No check has been performed yet.</>}
          successComponent={
            <>
              No design errors found. <br />
              Move elements around to see a different result.
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

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '2rem',
  color: 'white'
};

const caseHeaderStyle = {
  maxWidth: '50%'
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
  width: '100%',
  gap: '1rem'
};

export default CaseComponent;
