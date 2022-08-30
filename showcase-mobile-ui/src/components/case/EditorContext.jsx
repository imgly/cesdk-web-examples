import CreativeEngine from '@cesdk/engine';
import { isEqual } from 'lodash';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { findCustomStickerAssets } from './components/StickerSelect/CustomStickerAssetLibrary';
import { CustomEngine } from './CustomEngine';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [canvas, setCanvas] = useState(null);

  const [customEngine, setCustomEngine] = useState(null);

  const [localUploads, setLocalUploads] = useState([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [editorState, setEditorState] = useState({
    editMode: null,
    cursorType: null,
    cursorRotation: null
  });
  const editorUpdateCallbackRef = useRef(() => {});
  const [selectedTextProperties, setSelectedTextProperties] = useState({
    'text/horizontalAlignment': null,
    'text/fontFileUri': null,
    'fill/color': null
  });
  const [selectedShapeProperties, setSelectedShapeProperties] = useState({
    'fill/solid/color': null
  });
  const [selectedImageProperties, setSelectedImageProperties] = useState({
    'crop/rotation': null,
    'crop/scaleRatio': null,
    'crop/scaleX': null,
    'crop/scaleY': null
  });
  const engineEventCallbackRef = useRef(() => {});
  const [selectedBlocks, setSelectedBlocks] = useState(null);

  const checkZoom = useCallback(() => {
    const canvasBounding = canvas.getBoundingClientRect();
    const overlapBottom =
      canvasBounding.top + canvasBounding.height - window.visualViewport.height;
    customEngine.zoomToSelectedText(
      canvasBounding.height * window.devicePixelRatio,
      Math.max(overlapBottom * window.devicePixelRatio, 0)
    );
  }, [canvas, customEngine]);

  const checkZoomCrop = useCallback(() => {
    setTimeout(() => {
      const canvasBounding = canvas.getBoundingClientRect();
      const slideUpPanelBounding = document
        .getElementById('slideUpPanel')
        .getBoundingClientRect();

      const overlapBottom =
        canvasBounding.top + canvasBounding.height - slideUpPanelBounding.top;
      customEngine.zoomToCrop(Math.max(overlapBottom, 0));
    }, 0);
  }, [canvas, customEngine]);

  editorUpdateCallbackRef.current = () => {
    const newEditorState = customEngine.getEditorState();
    if (newEditorState['editMode'] === 'Text') {
      customEngine.filterTextEmojis();
      checkZoom();
    }
    if (newEditorState['editMode'] === 'Crop') {
      checkZoomCrop();
    }
    if (!isEqual(newEditorState, editorState)) {
      setEditorState(newEditorState);
    }
  };
  engineEventCallbackRef.current = (events) => {
    if (events.length > 0) {
      // Extract and store the currently selected block
      const newSelectedBlocks = customEngine.getSelectedBlockWithTypes();
      if (!isEqual(newSelectedBlocks, selectedBlocks)) {
        setSelectedBlocks(newSelectedBlocks);
      }
      // Extract and store the currently selected text block properties
      const newSelectedTextProperties =
        customEngine.getSelectedTextProperties();
      if (!isEqual(newSelectedTextProperties, selectedTextProperties)) {
        setSelectedTextProperties(newSelectedTextProperties);
      }
      // Extract and store the currently selected shape block properties
      const newSelectedShapeProperties =
        customEngine.getSelectedShapeProperties();
      if (!isEqual(newSelectedShapeProperties, selectedShapeProperties)) {
        setSelectedShapeProperties(newSelectedShapeProperties);
      }
      // Extract and store the currently selected image block properties
      const newSelectedImageProperties =
        customEngine.getSelectedImageProperties();
      if (!isEqual(newSelectedImageProperties, selectedImageProperties)) {
        setSelectedImageProperties(newSelectedImageProperties);
      }
      // Extract and store canUndo
      const newCanUndo = customEngine.getCanUndo();
      if (newCanUndo !== canUndo) {
        setCanUndo(newCanUndo);
      }
      // Extract and store canRedo
      const newCanRedo = customEngine.getCanRedo();
      if (newCanRedo !== canRedo) {
        setCanRedo(newCanRedo);
      }
    }
  };

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
      const assetSources = {
        stickers: {
          findAssets: findCustomStickerAssets
        }
      };
      const config = {
        featureFlags: {
          preventScrolling: true
        },
        page: {
          title: {
            show: false
          }
        },
        assetSources,
        license: process.env.REACT_APP_LICENSE
      };

      const creativeEngine = await CreativeEngine.init(config, canvas);
      const newCustomEngine = new CustomEngine(creativeEngine);
      setCustomEngine(newCustomEngine);
      creativeEngine.editor.onStateChanged(() =>
        editorUpdateCallbackRef.current()
      );
      creativeEngine.event.subscribe([], (events) =>
        engineEventCallbackRef.current(events)
      );
      await newCustomEngine.loadScene(
        `${window.location.protocol + "//" + window.location.host}/cases/mobile-ui/social-media.scene`
      );
      newCustomEngine.zoomToPage();
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

  const editMode = useMemo(() => editorState['editMode'], [editorState]);

  useEffect(() => {
    if (!isLoaded || !canvas) {
      return;
    }
    if (editMode === 'Transform') {
      customEngine.zoomToPage();
    }
  }, [isLoaded, canvas, customEngine, editMode]);

  const isEditable = isLoaded;

  const value = {
    customEngine,
    isLoaded,
    isEditable,
    canvas,
    setCanvas,
    localUploads,
    setLocalUploads,
    editorState,
    selectedBlocks,
    selectedTextProperties,
    selectedShapeProperties,
    selectedImageProperties,
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
