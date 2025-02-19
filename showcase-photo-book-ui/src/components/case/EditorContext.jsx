import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CreateCustomLayoutAssetSource } from './components/ChangeLayoutSecondary/CustomLayoutAssetSource';
import { findUnsplashAssets } from './components/ImageBar/UnsplashAssetLibrary';
import { CustomStickerAssetLibrary } from './components/StickerBar/CustomStickerAssetLibrary';
import { getSortedPageIds } from './lib/CreativeEngineUtils';
import { useEngine } from './lib/EngineContext';
import { usePagePreview } from './lib/PagePreviewContext';
import { useSinglePageMode } from './lib/SinglePageModeContext';
import { caseAssetPath } from './util';

const qualifyAssetUris = ({ meta, ...rest }) => ({
  ...rest,
  meta: {
    ...meta,
    sceneUri: caseAssetPath(`/${meta.sceneUri}`),
    thumbUri: caseAssetPath(`/${meta.thumbUri}`)
  }
});

const EditorContext = createContext();

const template = {
  name: 'Example Photobook',
  colors: ['#DC1876', '#0027BC', '#E2701D', '#008625', '#7E18CE', '#5BB1A7'],
  preview: '/templates/example.png',
  scene: '/photobook.scene',
  keyword: 'family kids parents amusement'
};

export const EditorProvider = ({ children }) => {
  const [sceneIsLoaded, setSceneIsLoaded] = useState(false);
  const { engine: creativeEngine, isLoaded: engineIsLoaded } = useEngine();

  const [localUploads, setLocalUploads] = useState([]);
  const [libraryImages, setLibraryImages] = useState([]);
  const images = useMemo(
    () => [...localUploads, ...libraryImages],
    [localUploads, libraryImages]
  );

  const { setEnabled: setFocusEnabled, setCurrentPageBlockId } =
    useSinglePageMode();

  const { setEnabled: setPagePreviewsEnabled } = usePagePreview();

  useEffect(() => {
    const loadLibraryImages = async () => {
      const UNSPLASH_ASSET_LIBRARY_ID = 'unsplash';
      const queryParameters = {
        page: 1,
        perPage: 15,
        query: template.keyword
      };
      const newLibraryImages = await creativeEngine.asset.findAssets(
        UNSPLASH_ASSET_LIBRARY_ID,
        queryParameters
      );
      setLibraryImages(newLibraryImages.assets);
    };
    if (sceneIsLoaded && template) {
      loadLibraryImages();
    }
  }, [sceneIsLoaded, creativeEngine]);

  useEffect(() => {
    const loadTemplate = async () => {
      if (engineIsLoaded && template) {
        setSceneIsLoaded(false);
        await creativeEngine.scene.loadFromURL(caseAssetPath(template.scene));
        // This is a workaround and currently still needed to allow the scene to render.
        // Otherwise the scene may not have been layouted yet.
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await setCurrentPageBlockId(getSortedPageIds(creativeEngine)[0]);
        setFocusEnabled(true);
        setPagePreviewsEnabled(true);
        setSceneIsLoaded(true);
        creativeEngine.editor.addUndoStep();
      }
    };
    loadTemplate();
  }, [
    creativeEngine,
    engineIsLoaded,
    setCurrentPageBlockId,
    setFocusEnabled,
    setPagePreviewsEnabled
  ]);

  useEffect(() => {
    creativeEngine.asset.addSource(CustomStickerAssetLibrary);
  }, [creativeEngine]);

  useEffect(() => {
    if (creativeEngine) {
      creativeEngine.asset.addSource({
        id: 'unsplash',
        findAssets: findUnsplashAssets
      });
      creativeEngine.asset.addSource(
        CreateCustomLayoutAssetSource(creativeEngine, qualifyAssetUris)
      );
    }
  }, [creativeEngine]);

  const value = {
    sceneIsLoaded,
    template,
    setLocalUploads,
    images
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
