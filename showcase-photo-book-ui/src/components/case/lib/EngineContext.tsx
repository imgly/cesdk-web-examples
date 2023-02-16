import CreativeEngine, { Configuration } from '@cesdk/engine';
import { createContext, useContext, useEffect, useState } from 'react';

interface EngineContextType {
  engine: CreativeEngine;
  isLoaded: boolean;
}
const EngineContext = createContext<EngineContextType | undefined>(undefined);

interface EngineProviderProps {
  children: React.ReactNode;
  config: Partial<Configuration>;
  LoadingComponent: React.ReactNode;
}

export const EngineProvider = ({
  children,
  config,
  LoadingComponent = null
}: EngineProviderProps): React.ReactNode => {
  const [engine, setEngine] = useState<CreativeEngine | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let localEngine: CreativeEngine;
    const loadEngine = async () => {

      localEngine = await CreativeEngine.init(config);
      setEngine(localEngine);
      setIsLoaded(true);
    };
    loadEngine();

    return () => {
      if (localEngine) {
        localEngine.dispose();
      }
      setIsLoaded(false);
    };
    // We do not want to rerender when the config changes. Config should never change!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!engine) {
    return LoadingComponent;
  }
  const value = {
    engine,
    isLoaded
  };

  return (
    <EngineContext.Provider value={value}>
      {engine && children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => {
  const context = useContext(EngineContext);
  if (context === undefined) {
    throw new Error('useEngine must be used within a EngineProvider');
  }
  return context;
};
