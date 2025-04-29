'use client';

import AiApps from '@imgly/plugin-ai-apps-web';
import Elevenlabs from '@imgly/plugin-ai-audio-generation-web/elevenlabs';
import FalAiImage from '@imgly/plugin-ai-image-generation-web/fal-ai';
import Anthropic from '@imgly/plugin-ai-text-generation-web/anthropic';
import FalAiVideo from '@imgly/plugin-ai-video-generation-web/fal-ai';

import { supportsVideo, supportsVideoExport } from '@cesdk/cesdk-js';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';

import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import { useCallback, useEffect, useState } from 'react';

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

// Insert your proxys for your provider here
let FAL_AI_PROXY_URL = '';
let ANTHROPIC_PROXY_URL = '';
let ELEVENLABS_PROXY_URL = '';


const CaseComponent = () => {
  const [cesdk, setCesdk] = useCreativeEditor();

  const [currentSceneMode, setCurrentSceneMode] = useState(undefined);

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


      instance.addPlugin(
        AiApps({
          providers: {
            text2text: Anthropic.AnthropicProvider({
              proxyUrl: ANTHROPIC_PROXY_URL
            }),
            text2image: FalAiImage.RecraftV3({
              proxyUrl: FAL_AI_PROXY_URL
            }),
            image2image: FalAiImage.GeminiFlashEdit({
              proxyUrl: FAL_AI_PROXY_URL
            }),
            text2video: FalAiVideo.MinimaxVideo01Live({
              proxyUrl: FAL_AI_PROXY_URL
            }),
            image2video: FalAiVideo.MinimaxVideo01LiveImageToVideo({
              proxyUrl: FAL_AI_PROXY_URL
            }),
            text2speech: Elevenlabs.ElevenMultilingualV2({
              proxyUrl: ELEVENLABS_PROXY_URL
            }),
            text2sound: Elevenlabs.ElevenSoundEffects({
              proxyUrl: ELEVENLABS_PROXY_URL
            })
          }
        })
      );
    },
    [currentSceneMode]
  );

  const onSceneModeChange = useCallback(
    async (value) => {
      setCurrentSceneMode(value);
    },
    [cesdk]
  );

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
      <div
        className="cesdkWrapperStyle"
        key={currentSceneMode}
        style={{ minHeight: '820px' }}
      >
        <CreativeEditor
          className="cesdkStyle"
          config={config}
          configure={configure}
          onInstanceChange={setCesdk}
        />
      </div>
    </div>
  );
};

export default CaseComponent;
