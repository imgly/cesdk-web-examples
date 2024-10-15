'use client';

import ValidationBox from '@/components/ui/ValidationBox/ValidationBox';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';
import {
  getImageBlockQuality,
  getLayerName,
  getOutsideBlocks,
  getPartiallyHiddenTexts,
  getProtrudingBlocks,
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
        blockType: cesdk.engine.block.getKind(blockId),
        blockName: getLayerName(cesdk, blockId)
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
        blockType: cesdk.engine.block.getKind(blockId),
        blockName: getLayerName(cesdk, blockId)
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
        blockType: cesdk.engine.block.getKind(blockId),
        blockName: getLayerName(cesdk, blockId)
      }));
    }
  },
  {
    name: 'Low resolution ',
    description:
      'Some elements are having a low resolution. This will lead to suboptimal results.',
    check: async (cesdk) => {
      const allImageBlocks = cesdk.engine.block.findByKind('image');
      const results = await Promise.all(
        allImageBlocks.map(async (blockId) => {
          const quality = await getImageBlockQuality(cesdk.engine, blockId);
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
            blockType: cesdk.engine.block.getKind(blockId),
            blockName: getLayerName(cesdk, blockId)
          };
        })
      );
      return results;
    }
  }
];

const CaseComponent = () => {
  const [cesdk, setCesdk] = useCreativeEditor();
  const [validationResults, setValidationResults] = useState([]);
  const [checkRan, setCheckRan] = useState(false);
  const [isDirty, setIsDirty] = useState(true);

  const runChecks = useCallback(async () => {
    if (!cesdk) return;
    cesdk.engine.editor.setSettingBool(`checkScopesInAPIs`, false);

    const validationResults = await Promise.all(
      VALIDATIONS.map(async ({ check, name, description }) => ({
        name,
        description,
        results: await check(cesdk)
      }))
    );
    cesdk.engine.editor.setSettingBool(`checkScopesInAPIs`, true);
    setValidationResults(validationResults);
    setIsDirty(false);
    setCheckRan(true);
  }, [cesdk, setValidationResults]);

  useEffect(() => {
    let unsubscribe;
    if (cesdk) {
      unsubscribe = cesdk.engine.editor.onHistoryUpdated(() => {
        setIsDirty(true);
      });
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [cesdk, setIsDirty]);

  useEffect(() => {
    if (isDirty && cesdk) {
      runChecks();
    }
  }, [isDirty, cesdk, runChecks]);

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
          onClick: cesdk.engine.block.isAllowedByScope(blockId, 'editor/select')
            ? () => selectAllBlocks(cesdk, [blockId])
            : null
        }))
      ),
    [cesdk, validationResults]
  );

  const config = useConfig(
    () => ({
      role: 'Creator',
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
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    await instance.loadFromURL(
      `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/design-validation/example.scene`
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
