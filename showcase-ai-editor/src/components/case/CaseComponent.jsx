'use client';

import AiApps from '@imgly/plugin-ai-apps-web';

import { supportsVideo, supportsVideoExport } from '@cesdk/cesdk-js';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';

import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import { useCallback, useEffect, useState } from 'react';
import AiProviderPanel from './components/AiProviderPanel';
import { createAIProviders } from './providers';

const SCENE_MODE_OPTIONS = [
  {
    name: 'Design',
    cesdkConfig: {}
  },
  {
    name: 'Video',
    cesdkConfig: {}
  }
];



const CaseComponent = () => {
  const [cesdk, setCesdk] = useCreativeEditor();
  const [currentSceneMode, setCurrentSceneMode] = useState(undefined);
  const [aiProviders, setAiProviders] = useState(null);

  useEffect(() => {
    if (currentSceneMode != null) return;

    (async function checkSupport() {
      const supportVideo = supportsVideo();
      const supportVideoExport = await supportsVideoExport();

      setCurrentSceneMode(
        supportVideo && supportVideoExport ? 'Video' : 'Design'
      );
    })();
  }, [currentSceneMode]);

  const config = useConfig(
    () => ({
      ...SCENE_MODE_OPTIONS.find(
        ({ name }) => name === (currentSceneMode ?? 'Design')
      ).cesdkConfig,
      license: process.env.NEXT_PUBLIC_LICENSE,
      featureFlags: {
        archiveSceneEnabled: true,
        dangerouslyDisableVideoSupportCheck: false
      },
      callbacks: {
        onUpload: 'local',
        onExport: 'download'
      },
      ui: {
        elements: {
          navigation: {
            action: {
              export: true
            }
          }
        }
      }
    }),
    [currentSceneMode]
  );

  const configure = useConfigure(
    async (instance) => {
      await instance.addDefaultAssetSources();
      await instance.addDemoAssetSources({ sceneMode: currentSceneMode });
      
      // Initialize AI providers after instance is available
      let currentAiProviders = aiProviders;
      if (!currentAiProviders) {
        currentAiProviders = createAIProviders(instance, currentSceneMode);
        setAiProviders(currentAiProviders);
      }

      instance.ui.setDockOrder([
        'ly.img.ai/apps.dock',
        ...instance.ui.getDockOrder().filter(({ key }) => {
          return key !== 'ly.img.video.template' && key !== 'ly.img.template';
        })
      ]);

      instance.ui.setCanvasMenuOrder([
        'ly.img.ai.text.canvasMenu',
        `ly.img.ai.image.canvasMenu`,
        ...instance.ui.getCanvasMenuOrder()
      ]);

      instance.feature.enable('ly.img.preview', false);
      instance.feature.enable('ly.img.placeholder', false);

      if (currentSceneMode === 'Video') {
        // instance.createVideoScene();
        await instance.engine.scene.loadFromArchiveURL(
          `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-editor/ai_editor_video.archive`
        );
      } else {
        // instance.createDesignScene();
        await instance.engine.scene.loadFromArchiveURL(
          `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/ai-editor/ai_editor_design.archive`
        );
      }

      // Build provider configuration based on selected providers
      const providerConfig = {};
      
      const getSelectedProvider = (category) => {
        return currentAiProviders[category]?.providers.filter(p => p.selected && p.provider != null) || [];
      };
      
      // Text to text
      const text2textProvider = getSelectedProvider('text2text');
      if (text2textProvider.length > 0) {
        providerConfig.text2text = text2textProvider.map((p) => p.provider);
      }
      
      // Text to image
      const text2imageProvider = getSelectedProvider('text2image');
      if (text2imageProvider.length > 0) {
        providerConfig.text2image = text2imageProvider.map((p) => p.provider);
      }
      
      // Image to image
      const image2imageProvider = getSelectedProvider('image2image');
      if (image2imageProvider.length > 0) {
        providerConfig.image2image = image2imageProvider.map((p) => p.provider);
      }
      
      // Text to video
      const text2videoProvider = getSelectedProvider('text2video');
      if (text2videoProvider.length > 0) {
        providerConfig.text2video = text2videoProvider.map((p) => p.provider);
      }
      
      // Image to video
      const image2videoProvider = getSelectedProvider('image2video');
      if (image2videoProvider.length > 0) {
        providerConfig.image2video = image2videoProvider.map((p) => p.provider);
      }
      
      // Text to speech
      const text2speechProvider = getSelectedProvider('text2speech');
      if (text2speechProvider.length > 0) {
        providerConfig.text2speech = text2speechProvider.map((p) => p.provider);
      }
      
      // Text to sound
      const text2soundProvider = getSelectedProvider('text2sound');
      if (text2soundProvider.length > 0) {
        providerConfig.text2sound = text2soundProvider.map((p) => p.provider);
      }
      
      // Text to sticker
      const text2stickerProvider = getSelectedProvider('text2sticker');
      if (text2stickerProvider.length > 0) {
        providerConfig.text2sticker = text2stickerProvider.map((p) => p.provider);
      }
      
      instance.addPlugin(
        AiApps({
          providers: providerConfig
        })
      );

      // Add AI image history to the default image asset library
      const imageEntry = instance.ui.getAssetLibraryEntry('ly.img.image');
      if (imageEntry != null) {
        instance.ui.updateAssetLibraryEntry('ly.img.image', {
          sourceIds: [...imageEntry.sourceIds, 'ly.img.ai.image-generation.history']
        });
      }

      // Add AI video history to the default video asset library
      const videoEntry = instance.ui.getAssetLibraryEntry('ly.img.video');
      if (videoEntry != null) {
        instance.ui.updateAssetLibraryEntry('ly.img.video', {
          sourceIds: [...videoEntry.sourceIds, 'ly.img.ai.video-generation.history']
        });
      }

      // Add AI audio history to the default audio asset library
      const audioEntry = instance.ui.getAssetLibraryEntry('ly.img.audio');
      if (audioEntry != null) {
        instance.ui.updateAssetLibraryEntry('ly.img.audio', {
          sourceIds: [...audioEntry.sourceIds, 'ly.img.ai.audio-generation.history']
        });
      }

      // Add AI sticker history to the default sticker asset library
      const stickerEntry = instance.ui.getAssetLibraryEntry('ly.img.sticker');
      if (stickerEntry != null) {
        instance.ui.updateAssetLibraryEntry('ly.img.sticker', {
          sourceIds: [...stickerEntry.sourceIds, 'ly.img.ai.sticker-generation.history']
        });
      }

    },
    [currentSceneMode, aiProviders]
  );

  const onSceneModeChange = useCallback(
    async (value) => {
      setCurrentSceneMode(value);
      // Reset providers when scene mode changes
      setAiProviders(null);
    },
    [cesdk]
  );

  const handleApplyChanges = useCallback((newProviders) => {
    // Apply new providers to live configuration
    setAiProviders(newProviders);
  }, []);

  if (currentSceneMode == null) {
    return null;
  }

  return (
    <div className="gap-sm flex flex-grow flex-col">
      <div className="flex  w-full flex-col items-center">
        <SegmentedControl
          options={SCENE_MODE_OPTIONS.map(({ name }) => ({
            value: name,
            label: name
          }))}
          value={currentSceneMode}
          name="currentRole"
          onChange={onSceneModeChange}
          size="md"
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', height: '820px' }}>
        <div
          className="cesdkWrapperStyle"
          key={currentSceneMode}
          style={{ flex: 1 }}
        >
          <CreativeEditor
            className="cesdkStyle"
            config={config}
            configure={configure}
            onInstanceChange={setCesdk}
          />
        </div>
        {aiProviders && (
          <AiProviderPanel
            providers={aiProviders}
            onApplyChanges={handleApplyChanges}
          />
        )}
      </div>
    </div>
  );
};

export default CaseComponent;
