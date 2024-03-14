import { CompleteAssetResult, RGBAColor } from '@cesdk/engine';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useEngine } from './lib/EngineContext';
import { hexToRgba } from './lib/ColorUtilities';
import { useSinglePageMode } from './lib/SinglePageModeContext';
import { caseAssetPath } from './util';
import { usePagePreview } from './lib/PagePreviewContext';

const template = {
  name: 'Example Photobook',
  colors: ['#DC1876', '#0027BC', '#E2701D', '#008625', '#7E18CE', '#5BB1A7'],
  preview: '/templates/example.png',
  scene: '/photobook.scene',
  keyword: 'family kids parents amusement'
};

interface EditorContextType {
  sceneIsLoaded: boolean;
  findImageAssets: () => Promise<CompleteAssetResult[]>;
  getColorPalette: () => RGBAColor[];
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const { engine, isLoaded: engineIsLoaded } = useEngine();
  const [sceneIsLoaded, setSceneIsLoaded] = useState(false);
  const { setCurrentPageBlockId, setEnabled } = useSinglePageMode();
  const { setEnabled: setPagePreviewsEnabled } = usePagePreview();

  useEffect(() => {
    const loadTemplate = async () => {
      if (engineIsLoaded) {
        setEnabled(false);
        setSceneIsLoaded(false);
        await engine.scene.loadFromURL(caseAssetPath(template.scene));
        // Simulate that a user has replaced the placeholder images
        engine.block
          .findByKind('image')
          .filter((image) => {
            return !engine.block.isPlaceholderControlsOverlayEnabled(image);
          })
          .forEach((image) => {
            engine.block.setPlaceholderEnabled(image, false);
          });
        setPagePreviewsEnabled(true);
        const pages = engine.scene.getPages();
        setCurrentPageBlockId(pages[0]);
        setEnabled(true);
        // Wait for zoom to finish
        await new Promise((resolve) => setTimeout(resolve, 100));
        setSceneIsLoaded(true);
      }
    };
    loadTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineIsLoaded, engine]);

  const findImageAssets = useCallback(async () => {
    const UPLOAD_ASSET_LIBRARY_ID = 'ly.img.image.upload';
    const UNSPLASH_ASSET_LIBRARY_ID = 'unsplash';

    const uploadResults = await engine.asset.findAssets(
      UPLOAD_ASSET_LIBRARY_ID,
      {
        page: 0,
        perPage: 9999
      }
    );
    const unsplashResults = await engine.asset.findAssets(
      UNSPLASH_ASSET_LIBRARY_ID,
      {
        page: 0,
        perPage: 10,
        query: 'Disneyland'
      }
    );
    return [...uploadResults.assets.reverse(), ...unsplashResults.assets];
  }, [engine]);

  const getColorPalette = useCallback(
    () => [...template.colors].map((color) => hexToRgba(color)),
    []
  );

  const value = {
    setPagePreviewsEnabled,
    sceneIsLoaded,
    template,
    getColorPalette,
    findImageAssets
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
