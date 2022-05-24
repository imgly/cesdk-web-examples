import CreativeEngine from '@cesdk/engine';
import { createContext, useContext, useEffect, useState } from 'react';
import { CustomEngine } from './CustomEngine';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState('edit');
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [canvas, setCanvas] = useState(null);

  const [customEngine, setCustomEngine] = useState(null);

  useEffect(() => {
    if (canvas) {
      setShouldLoad(true);
    }
  }, [canvas]);

  useEffect(() => {
    const loadEditor = async () => {
      if (!shouldLoad) {
        return;
      }
      setShouldLoad(false);
      const config = {
        featureFlags: {
          preventScrolling: true
        },
        page: {
          title: {
            show: false
          }
        },
        defaultFont: '//ly.img.cesdk.fonts/roboto_regular',
        license: process.env.REACT_APP_LICENSE
      };

      const creativeEngine = await CreativeEngine.init(config, canvas);
      const newCustomEngine = new CustomEngine(creativeEngine);
      setCustomEngine(newCustomEngine);
      await newCustomEngine.loadScene(
        `${process.env.REACT_APP_URL_HOSTNAME}${process.env.PUBLIC_URL}/cases/custom-ui/kiosk.scene`
      );
      setIsLoaded(true);
    };
    loadEditor();

    return () => {
      customEngine?.dispose();
      setCustomEngine(null);
      setIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoad]);

  useEffect(() => {
    if (!isLoaded || !canvas) {
      return;
    }
    // Use canvas width and height attributes as it this might be double the
    // values of the bounding box due to devicePixelRatio
    const { width, height } = canvas;
    if (viewMode === 'edit') {
      customEngine.enableEditMode(width, height);
    } else {
      customEngine.enablePreviewMode(width, height);
    }
    // eslint-disable-next-line
  }, [isLoaded, canvas, viewMode]);

  const isEditable = isLoaded && viewMode === 'edit';

  const value = {
    customEngine,
    isLoaded,
    isEditable,
    viewMode,
    canvas,
    setCanvas,
    setViewMode
  };
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within a EditorProvider');
  }
  return context;
};
