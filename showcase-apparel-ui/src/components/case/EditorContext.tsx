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

export const ALL_STEPS = ['edit', 'preview'] as const;
type Step = (typeof ALL_STEPS)[number];
interface EditorContextType {
  sceneIsLoaded: boolean;
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  findImageAssets: () => Promise<CompleteAssetResult[]>;
  getColorPalette: () => RGBAColor[];
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const { engine, isLoaded: engineIsLoaded } = useEngine();
  const [sceneIsLoaded, setSceneIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState<(typeof ALL_STEPS)[number]>(
    ALL_STEPS[0]
  );
  const { currentPageBlockId, setCurrentPageBlockId, setEnabled } =
    useSinglePageMode();

  useEffect(() => {
    const loadTemplate = async () => {
      if (engineIsLoaded) {
        setEnabled(false);
        setSceneIsLoaded(false);
        await engine.scene.loadFromURL(caseAssetPath('/kiosk.scene'));
        const pages = engine.scene.getPages();
        setCurrentPageBlockId(pages[0]);
        setEnabled(true);
        // Wait for zoom to finish
        await new Promise((resolve) => setTimeout(resolve, 100));
        setSceneIsLoaded(true);
      }
    };
    loadTemplate();
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
        query: 'Skateboard'
      }
    );
    return [...uploadResults.assets.reverse(), ...unsplashResults.assets];
  }, [engine]);

  const getColorPalette = useCallback(
    () =>
      ['#ffffff', '#000000', '#ff3333', '#ffd333', '#00d8a4', '#335fff'].map(
        (color) => hexToRgba(color)
      ),
    []
  );

  useEffect(() => {
    if (!currentPageBlockId) {
      return;
    }
    // if current step changes, update the editor mode
    if (currentStep === 'edit') {
      setEnabled(true);
      engine.element!.style.pointerEvents = 'all';
      engine.editor.setSettingBool('page/dimOutOfPageAreas', true);
      engine.block.setClipped(currentPageBlockId, false);
      engine.block.setBool(currentPageBlockId, 'fill/enabled', true);
    } else if (currentStep === 'preview') {
      setEnabled(false);

      // Get backdrop image
      const scene = engine.scene.get()!;
      const childIds = engine.block.getChildren(scene);
      const backdropImageBlock = childIds.find(
        (block) => engine.block.getType(block) === '//ly.img.ubq/graphic'
      );
      if (!backdropImageBlock) {
        throw new Error('Backdrop image not found');
      }
      engine.element!.style.pointerEvents = 'none';
      // Zoom to the backdrop image
      engine.scene.zoomToBlock(backdropImageBlock, 0, 60, 0, 20);
      engine.editor.setEditMode('Transform');
      engine.block.findAllSelected().forEach((block) => {
        engine.block.setSelected(block, false);
      });
      engine.editor.setSettingBool('page/dimOutOfPageAreas', false);
      engine.block.setClipped(currentPageBlockId, true);
      engine.block.setBool(currentPageBlockId, 'fill/enabled', false);
    }
  }, [currentStep, currentPageBlockId, engine]);

  const value = {
    sceneIsLoaded,
    getColorPalette,
    findImageAssets,
    currentStep,
    setCurrentStep
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
