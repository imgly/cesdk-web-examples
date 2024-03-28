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
import { caseAssetPath } from './util';

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
  const [engine, setEngine] = useState(null);
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
  editorUpdateCallbackRef.current = () => {
    const newEditMode = engine.editor.getEditMode();
    if (editMode !== newEditMode) {
      setEditMode(newEditMode);
    }
  };

  const changeImage = useCallback(
    async (src, keepChanges) => {
      engine.editor.setEditMode('Transform');
      setEditMode('Transform');
      setSceneIsLoaded(false);
      setSelectedImageUrl(src);
      setFocusEnabled(false);
      // Let react render
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (keepChanges) {
        await setImageSource(engine, engine.block.findByType('page')[0], src);
      } else {
        await setupPhotoScene(engine, src);
      }
      setSceneIsLoaded(true);
      setFocusEnabled(true);
      await new Promise((resolve) => setTimeout(resolve, 0));
      engine.block.setVisible(engine.block.findByType('page')[0], true);
    },
    [engine, setFocusEnabled]
  );

  useEffect(() => {
    let engine;
    const loadEditor = async () => {
      const config = {
        featureFlags: {
          preventScrolling: true
        },
        license: process.env.REACT_APP_LICENSE
      };

      engine = await CreativeEngine.init(config);
      engine.editor.setSettingBool('mouse/enableScroll', false);
      engine.editor.setSettingBool('mouse/enableZoom', false);
      engine.editor.setSettingBool('page/title/show', false);
      setEngine(engine);
    };
    loadEditor();

    return () => {
      engine?.dispose();
      setEngineIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (engine) {
      const setupEngine = async () => {
        engine.editor.onStateChanged(() => editorUpdateCallbackRef.current());
        const initialImageUrl = caseAssetPath(INITIAL_IMAGE_PATH);
        await setupPhotoScene(engine, initialImageUrl);
        setFocusEngine(engine);
        setFocusEnabled(true);
        await new Promise((resolve) => setTimeout(resolve, 0));
        const page = engine.block.findByType('page')[0];
        engine.block.setVisible(page, true);
        setEngineIsLoaded(true);
        setSceneIsLoaded(true);
      };
      setupEngine();
    }
  }, [engine, setFocusEnabled, setFocusEngine]);

  const value = {
    sceneIsLoaded,
    enableAutoRecenter,
    canRecenter,
    setCanRecenter,
    editMode,
    changeImage,
    engine,
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
  engine.editor.setSettingBool('page/dimOutOfPageAreas', false);
  engine.editor.setSettingColorRGBA('highlightColor', 1, 1, 1, 1);
  engine.editor.setSettingColorRGBA('cropOverlayColor', 1, 1, 1, 0.55);
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

  engine.editor.setSettingBool('doubleClickToCropEnabled', false);
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
