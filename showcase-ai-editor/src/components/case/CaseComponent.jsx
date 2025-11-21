'use client';


// import { supportsVideo, supportsVideoExport } from '@cesdk/cesdk-js';
import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';

import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import AiProviderPanel from './components/AiProviderPanel';
import { MODE_OPTIONS } from './modes';
import { createAIProviders } from './providers';

const CaseComponent = () => {
  const [cesdk, setCesdk] = useCreativeEditor();
  const [modeContext, setModeContext] = useState();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (modeContext != null) {
      return;
    }

    // Read scene mode from URL query parameter
    const urlSceneMode = searchParams.get('mode');

    // Validate that the URL parameter is a valid scene mode
    const validSceneModes = MODE_OPTIONS.map((option) => option.name);

    if (urlSceneMode && validSceneModes.includes(urlSceneMode)) {
      // URL parameter takes precedence
      setModeContext({
        providers: createAIProviders(urlSceneMode),
        sceneMode: urlSceneMode
      });
    } else {
      // No valid URL parameter, check video support
      (async function checkSupport() {
        // const supportVideo = supportsVideo();
        // const supportVideoExport = await supportsVideoExport();
        // const defaultMode = supportVideo && supportVideoExport ? 'Video' : 'Design';
        const defaultMode = 'Design';
        setModeContext({
          providers: createAIProviders(defaultMode),
          sceneMode: defaultMode
        });

        // Set the query parameter to match the auto-detected mode
        const params = new URLSearchParams(searchParams);
        params.set('mode', defaultMode);
        router.replace(`?${params.toString()}`, { scroll: false });
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]);

  const config = useConfig(
    () => ({
      license: process.env.NEXT_PUBLIC_LICENSE,
      ...MODE_OPTIONS.find(
        ({ name }) => name === (modeContext?.sceneMode ?? 'Design')
      ).cesdkConfig
    }),
    [modeContext]
  );

  const configure = useConfigure(
    async (instance) => {

      const currentMode = MODE_OPTIONS.find(
        ({ name }) => name === (modeContext?.sceneMode ?? 'Design')
      );

      await currentMode.initialize(
        instance,
        modeContext,
      );
    },
    [modeContext]
  );

  const onSceneModeChange = useCallback(
    async (value) => {
      setModeContext({
        providers: createAIProviders(value),
        sceneMode: value
      });

      // Update URL query parameter
      const params = new URLSearchParams(searchParams);
      params.set('mode', value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cesdk, searchParams, router]
  );

  const handleApplyChanges = useCallback((newProviders) => {
    // Apply new providers to live configuration
    setModeContext((prev) => ({
      ...prev,
      providers: newProviders
    }));
  }, []);

  if (modeContext?.sceneMode == null) {
    return null;
  }

  return (
    <div className="gap-sm flex flex-grow flex-col">
      <div className="flex  w-full flex-col items-center">
        <SegmentedControl
          options={MODE_OPTIONS.map(({ name }) => ({
            value: name,
            label: name
          }))}
          value={modeContext?.sceneMode}
          name="currentRole"
          onChange={onSceneModeChange}
          size="md"
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          height: '740px'
        }}
      >
        <div
          className="cesdkWrapperStyle"
          key={modeContext?.sceneMode}
          style={{ flex: 1 }}
        >
          <CreativeEditor
            className="cesdkStyle"
            config={config}
            configure={configure}
            onInstanceChange={setCesdk}
          />
        </div>
        {modeContext?.providers && (
          <AiProviderPanel
            providers={modeContext.providers}
            onApplyChanges={handleApplyChanges}
          />
        )}
      </div>
    </div>
  );
};


export default CaseComponent;
