import CreativeEngineSDK, { Configuration } from '@cesdk/engine';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface CreativeEngineProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: Partial<Configuration>;
  configure?: (instance: CreativeEngineSDK) => Promise<void>;
  onInstanceChange?: (instance: CreativeEngineSDK | undefined) => void;
}

export default function CreativeEngine({
  config = undefined,
  configure = undefined,
  onInstanceChange = undefined,
  ...rest
}: CreativeEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let container = containerRef.current;
    let instance: CreativeEngineSDK | null = null;
    let removed = false;
    CreativeEngineSDK.init(config ?? {}).then(async (_instance) => {
      // If component was unmounted before initialization finished, cleanup again
      if (removed) {
        _instance.dispose();
        return;
      }

      instance = _instance;
      if (configure) {
        await configure(instance);
      }

      if (!instance.element) return;
      container.append(instance.element);

      if (onInstanceChange) {
        onInstanceChange(instance);
      }
    });

    const cleanup = () => {
      removed = true;
      instance?.element?.remove();
      instance?.dispose();
      instance = null;
      if (onInstanceChange) {
        onInstanceChange(undefined);
      }
    };
    return cleanup;
  }, [containerRef, config, configure, onInstanceChange]);

  return <div ref={containerRef} {...rest}></div>;
}

// These typed hooks allow for autocomplete inside jsx files
export const useConfig = useMemo<Partial<Configuration>>;
export const useConfigure = useCallback<
  (instance: CreativeEngineSDK) => Promise<void>
>;
export const useCreativeEngine = useState<CreativeEngineSDK | undefined>;
export const useCreativeEngineRef = useRef<CreativeEngineSDK | undefined>;
