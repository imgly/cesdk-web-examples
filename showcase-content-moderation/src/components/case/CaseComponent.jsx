'use client';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import ValidationBox from '@/components/ui/ValidationBox/ValidationBox';
import { useCallback, useMemo, useState } from 'react';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';
import { DesignEditorConfig } from './lib/design-editor/plugin';
import { addPremiumTemplatesAssetSource } from './lib/PremiumTemplateUtilities';
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
      role: 'Creator',
      license: process.env.NEXT_PUBLIC_LICENSE,
      theme: 'light',
      ui: {
        elements: {
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
        onExport: 'download'
      }
    }),
    []
  );
  const configure = useConfigure(async (instance) => {
    // Add the design editor configuration plugin first
    await instance.addPlugin(new DesignEditorConfig());

    // Asset Source Plugins (replaces addDefaultAssetSources)
    await instance.addPlugin(new ColorPaletteAssetSource());
    await instance.addPlugin(new TypefaceAssetSource());
    await instance.addPlugin(new TextAssetSource());
    await instance.addPlugin(new TextComponentAssetSource());
    await instance.addPlugin(new VectorShapeAssetSource());
    await instance.addPlugin(new StickerAssetSource());
    await instance.addPlugin(new EffectsAssetSource());
    await instance.addPlugin(new FiltersAssetSource());
    await instance.addPlugin(new BlurAssetSource());
    await instance.addPlugin(new PagePresetsAssetSource());
    await instance.addPlugin(new CropPresetsAssetSource());
    await instance.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload']
      })
    );

    // Demo assets (replaces addDemoAssetSources)
    await instance.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    );

    await addPremiumTemplatesAssetSource(instance);
    // Disable placeholder and preview features
    instance.feature.enable('ly.img.placeholder', false);
    instance.feature.enable('ly.img.preview', false);
    instance.ui.setDockOrder([
      ...instance.ui.getDockOrder().filter(({ key }) => key !== 'ly.img.upload')
    ]);
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
