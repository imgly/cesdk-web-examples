import CreativeEngine from '@cesdk/engine';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useSinglePageFocus } from './lib/UseSinglePageFocus';
import { getImageSize } from './lib/utils';
import { caseAssetPath, useTimeout } from './util';

const EditorContext = createContext();

const INITIAL_PORTRAIT_IMAGE_PATH = '/images/mountains.jpg';
const INITIAL_LANDSCAPE_IMAGE_PATH = '/images/woman.jpg';
// For demonstration purposes we initially use either a portrait or a landscape image
const INITIAL_IMAGE_PATH =
  window.innerWidth / window.innerHeight > 1
    ? INITIAL_PORTRAIT_IMAGE_PATH
    : INITIAL_LANDSCAPE_IMAGE_PATH;

const ENABLE_AUTO_RECENTER = true;
export const CANVAS_COLOR = { r: 236, g: 236, b: 238 };
export const DEFAULT_HIGHLIGHT_COLOR = { r: 0, g: 0, b: 255 };

export const EditorProvider = ({ children }) => {
  const enableAutoRecenter = ENABLE_AUTO_RECENTER;
  const [engineIsLoaded, setEngineIsLoaded] = useState(false);
  const [sceneIsLoaded, setSceneIsLoaded] = useState(false);
  const [creativeEngine, setCreativeEngine] = useState(null);
  const [canRecenter, setCanRecenter] = useState(false);
  const [editMode, setEditMode] = useState('Transform');
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    caseAssetPath(INITIAL_IMAGE_PATH)
  );
  const {
    setEnabled: setFocusEnabled,
    setEngine: setFocusEngine,
    setZoomPaddingBottom,
    currentPageBlockId,
    refocus
  } = useSinglePageFocus({
    zoomPaddingBottomDefault: 80,
    zoomPaddingLeftDefault: 16,
    zoomPaddingRightDefault: 16,
    zoomPaddingTopDefault: 52
  });

  const editorUpdateCallbackRef = useRef(() => {});
  const engineEventCallbackRef = useRef(() => {});
  const { resetTimer } = useTimeout(() => {
    refocus();
    setCanRecenter(false);
  }, 400);

  engineEventCallbackRef.current = (events) => {
    if (events.length > 0) {
      const hasPageEvent = events.some((event) =>
        creativeEngine.block.getType(events[0].block).includes('page')
      );
      if (
        enableAutoRecenter &&
        creativeEngine.editor.getEditMode() === 'Crop' &&
        hasPageEvent
      ) {
        setCanRecenter(true);
        resetTimer();
      }
    }
  };
  editorUpdateCallbackRef.current = () => {
    const newEditMode = creativeEngine.editor.getEditMode();
    if (editMode !== newEditMode) {
      setEditMode(newEditMode);
    }
  };

  const changeImage = useCallback(
    async (src, keepChanges) => {
      creativeEngine.editor.setEditMode('Transform');
      setEditMode('Transform');
      setSceneIsLoaded(false);
      setSelectedImageUrl(src);
      setFocusEnabled(false);
      // Let react render
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (keepChanges) {
        await setImageSource(
          creativeEngine,
          creativeEngine.block.findByType('page')[0],
          src
        );
      } else {
        await setupPhotoScene(creativeEngine, src);
      }
      setSceneIsLoaded(true);
      setFocusEnabled(true);
      await new Promise((resolve) => setTimeout(resolve, 0));
      creativeEngine.block.setVisible(
        creativeEngine.block.findByType('page')[0],
        true
      );
    },
    [creativeEngine, setFocusEnabled]
  );

  useEffect(() => {
    let engine;
    const loadEditor = async () => {

      const config = {
        featureFlags: {
          preventScrolling: true
        },

        page: {
          title: {
            show: false
          }
        },
        license: process.env.REACT_APP_LICENSE
      };

      engine = await CreativeEngine.init(config);
      setCreativeEngine(engine);
    };
    loadEditor();

    return () => {
      engine?.dispose();
      setEngineIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (creativeEngine) {
      const setupEngine = async () => {
        creativeEngine.editor.onStateChanged(() =>
          editorUpdateCallbackRef.current()
        );
        creativeEngine.event.subscribe([], (events) =>
          engineEventCallbackRef.current(events)
        );
        const initialImageUrl = caseAssetPath(INITIAL_IMAGE_PATH);
        await setupPhotoScene(creativeEngine, initialImageUrl);
        setFocusEngine(creativeEngine);
        setFocusEnabled(true);
        await new Promise((resolve) => setTimeout(resolve, 0));
        const page = creativeEngine.block.findByType('page')[0];
        creativeEngine.block.setVisible(page, true);
        setEngineIsLoaded(true);
        setSceneIsLoaded(true);
      };
      setupEngine();
    }
  }, [creativeEngine, setFocusEnabled, setFocusEngine]);

  const value = {
    sceneIsLoaded,
    enableAutoRecenter,
    canRecenter,
    editMode,
    changeImage,
    creativeEngine,
    engineIsLoaded,
    currentPageBlockId,
    refocus,
    setFocusEnabled,
    setZoomPaddingBottom,
    selectedImageUrl
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

/**
 *
 * @param {import('@cesdk/engine').CreativeEngine} engine
 * @param {string} imageUrl
 */
async function setupPhotoScene(engine, src) {
  engine.editor.setSettingBool('ubq://page/dimOutOfPageAreas', false);
  engine.editor.setSettingColorRGBA('ubq://highlightColor', 1, 1, 1, 1);
  engine.editor.setSettingColorRGBA('ubq://cropOverlayColor', 1, 1, 1, 0.55);
  engine.editor.setGlobalScope('design/arrange', 'Allow');

  // We recreate the scene to discard all changes
  const existingScene = engine.scene.get();
  if (existingScene) await engine.block.destroy(existingScene);

  const scene = await engine.scene.create();
  engine.block.setEnum(scene, 'scene/designUnit', 'Pixel');

  const page = await engine.block.create('page');
  engine.block.setVisible(page, false);
  engine.block.setBool(page, 'page/marginEnabled', false);

  const fill = await engine.block.createFill('image');
  await engine.block.appendChild(scene, page);
  await engine.block.setFill(page, fill);

  await setImageSource(engine, page, src);
  await engine.block.setClipped(page, false);

  engine.editor.setSettingBool('ubq://doubleClickToCropEnabled', false);
  engine.editor.addUndoStep();
}

/**
 *
 * @param {import('@cesdk/engine').CreativeEngine} engine
 * @param {Number} pageBlock
 * @param {string} imageSrc
 */
const setImageSource = async (engine, pageBlock, imageSrc) => {
  engine.editor.setGlobalScope('design/arrange', 'Allow');
  const imageFill = engine.block.getFill(pageBlock);
  const { height, width } = await getImageSize(imageSrc);
  engine.block.setWidth(pageBlock, width);
  engine.block.setHeight(pageBlock, height);
  await engine.block.setString(imageFill, 'fill/image/imageFileURI', imageSrc);
  engine.block.resetCrop(pageBlock);
  engine.editor.setGlobalScope('design/arrange', 'Deny');
};
