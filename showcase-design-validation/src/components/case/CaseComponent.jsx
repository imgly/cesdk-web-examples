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
  const cesdkContainer = useRef(null);
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
      }
    };
    if (cesdkContainer.current && !cesdkRef.current) {
      CreativeEditorSDK.init(cesdkContainer.current, config).then(
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
  }, [cesdkContainer]);

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
      <div style={cesdkWrapperStyle}>
        <div ref={cesdkContainer} style={cesdkStyle}></div>
      </div>
      <div style={sidebarStyle}>
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

export default CaseComponent;
