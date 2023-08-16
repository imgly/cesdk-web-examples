import CreativeEngine from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { unsplashImageAssetSource } from './components/ImageBar/UnsplashAssetLibrary';
import { useSinglePageFocus } from './lib/UseSinglePageFocus';
import POSTCARD_TEMPLATES from './PostcardTemplates.json';
import { caseAssetPath } from './util';

const EditorContext = createContext();

export const ALL_STEPS = ['Style', 'Design', 'Write'];

export const EditorProvider = ({ children }) => {
  /**
   * @type {[import("@cesdk/engine").default, Function]} CreativeEngine
   */
  const [creativeEngine, setCreativeEngine] = useState(null);
  const [engineIsLoaded, setEngineIsLoaded] = useState(false);
  const [sceneIsLoaded, setSceneIsLoaded] = useState(false);

  const [postcardTemplateId, setPostcardTemplateId] = useState();
  const postcardTemplate = useMemo(
    () => POSTCARD_TEMPLATES[postcardTemplateId],
    [postcardTemplateId]
  );
  const [currentStep, setCurrentStep] = useState(ALL_STEPS[0]);

  const [editMode, setEditMode] = useState('Transform');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [localUploads, setLocalUploads] = useState([]);
  const [libraryImages, setLibraryImages] = useState([]);
  const images = useMemo(
    () => [...localUploads, ...libraryImages],
    [localUploads, libraryImages]
  );

  const {
    setEnabled: setFocusEnabled,
    setEngine: setFocusEngine,
    currentPageBlockId,
    setCurrentPageIndex
  } = useSinglePageFocus({
    verticalTextScrollEnabledDefault: true,
    refocusCropModeEnabledDefault: true,
    zoomPaddingBottomDefault: 40,
    zoomPaddingLeftDefault: 40,
    zoomPaddingRightDefault: 40,
    zoomPaddingTopDefault: 40
  });

  useEffect(() => {
    setCurrentPageIndex(currentStep === 'Write' ? 1 : 0);
  }, [setCurrentPageIndex, currentStep]);

  useEffect(() => {
    const loadLibraryImages = async () => {
      const UNSPLASH_ASSET_LIBRARY_ID = 'unsplash';
      const queryParameters = {
        page: 1,
        perPage: 15,
        query: postcardTemplate.keyword
      };
      const newLibraryImages = await creativeEngine.asset.findAssets(
        UNSPLASH_ASSET_LIBRARY_ID,
        queryParameters
      );
      setLibraryImages(newLibraryImages.assets);
    };
    if (sceneIsLoaded && postcardTemplate) {
      loadLibraryImages();
    }
  }, [sceneIsLoaded, creativeEngine, postcardTemplate]);

  const editorUpdateCallbackRef = useRef(() => {});
  useEffect(() => {
    const loadPostcardTemplate = async () => {
      if (engineIsLoaded && postcardTemplate) {
        setSceneIsLoaded(false);
        await creativeEngine.scene.loadFromURL(
          caseAssetPath(postcardTemplate.scene)
        );
        // This is a workaround and currently still needed to allow the scene to render.
        // Otherwise the scene may not have been layouted yet.
        await new Promise((resolve) => requestAnimationFrame(resolve));
        setCurrentPageIndex(0);
        setSceneIsLoaded(true);
      }
    };
    loadPostcardTemplate();
  }, [setCurrentPageIndex, engineIsLoaded, creativeEngine, postcardTemplate]);

  const engineEventCallbackRef = useRef(() => {});
  const [selectedBlocks, setSelectedBlocks] = useState(null);

  editorUpdateCallbackRef.current = () => {
    const newEditMode = creativeEngine.editor.getEditMode();
    if (newEditMode !== editMode) {
      setEditMode(newEditMode);
    }
  };
  engineEventCallbackRef.current = (events) => {
    if (events.length > 0) {
      // Extract and store the currently selected block
      const newSelectedBlocks = creativeEngine.block
        .findAllSelected()
        .map((id) => ({
          id,
          type: creativeEngine.block.getType(id)
        }));
      if (!isEqual(newSelectedBlocks, selectedBlocks)) {
        setSelectedBlocks(newSelectedBlocks);
      }
      // Extract and store canUndo
      const newCanUndo = creativeEngine.editor.canUndo();
      if (newCanUndo !== canUndo) {
        setCanUndo(newCanUndo);
      }
      // Extract and store canRedo
      const newCanRedo = creativeEngine.editor.canRedo();
      if (newCanRedo !== canRedo) {
        setCanRedo(newCanRedo);
      }
    }
  };

  useEffect(() => {
    const loadEditor = async () => {

      const config = {
        role: 'Adopter',
        featureFlags: {
          preventScrolling: true
        },
        license: process.env.REACT_APP_LICENSE
      };
      const creativeEngine = await CreativeEngine.init(config);
      creativeEngine.editor.setSettingBool('page/title/show', false);
      setCreativeEngine(creativeEngine);
      creativeEngine.asset.addSource(unsplashImageAssetSource);
      creativeEngine.editor.onStateChanged(() =>
        editorUpdateCallbackRef.current()
      );
      creativeEngine.event.subscribe([], (events) =>
        engineEventCallbackRef.current(events)
      );
      setEngineIsLoaded(true);
      setFocusEngine(creativeEngine);
      setFocusEnabled(true);
    };
    loadEditor();

    return () => {
      if (creativeEngine) {
        creativeEngine.dispose();
      }
      setEngineIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    creativeEngine,
    engineIsLoaded,
    sceneIsLoaded,
    postcardTemplate,
    postcardTemplateId,
    setPostcardTemplateId,
    currentStep,
    setCurrentStep,
    currentPageBlockId,
    editMode,
    selectedBlocks,
    setLocalUploads,
    images,
    canUndo,
    canRedo
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
