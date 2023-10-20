import CreativeEngine from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { CustomEngine } from './CustomEngine';
import { caseAssetPath } from './util';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState('edit');
  const [isLoaded, setIsLoaded] = useState(false);
  const [canvas, setCanvas] = useState(null);

  const [customEngine, setCustomEngine] = useState(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [editorState, setEditorState] = useState({
    editMode: 'Transform'
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

  const syncUndoRedoState = () => {
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
  };

  editorUpdateCallbackRef.current = () => {
    const newEditorState = customEngine.getEditorState();
    if (newEditorState['editMode'] === 'Text') {
      checkZoom();
    }
    if (!isEqual(newEditorState, editorState)) {
      setEditorState(newEditorState);
    }
    syncUndoRedoState();
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
      syncUndoRedoState();
    }
  };

  useEffect(() => {
    let newCustomEngine;
    const loadEditor = async () => {

      if (!canvas) {
        return;
      }
      const config = {
        page: {
          title: {
            show: false
          }
        },
        featureFlags: {
          preventScrolling: true
        },
        license: process.env.REACT_APP_LICENSE
      };

      const creativeEngine = await CreativeEngine.init(config, canvas);
      // Hotfix for a race-condition in <=1.7.0
      await new Promise((resolve) => requestAnimationFrame(resolve));
      newCustomEngine = new CustomEngine(creativeEngine);
      setCustomEngine(newCustomEngine);
      creativeEngine.editor.onStateChanged(() =>
        editorUpdateCallbackRef.current()
      );
      creativeEngine.event.subscribe([], (events) =>
        engineEventCallbackRef.current(events)
      );
      await newCustomEngine.loadScene(caseAssetPath(`/kiosk.scene`));
      setIsLoaded(true);
    };
    loadEditor();

    return () => {
      if (newCustomEngine) {
        newCustomEngine.dispose();
      }
      setCustomEngine(null);
      setIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  useEffect(() => {
    if (!isLoaded || !canvas) {
      return;
    }
    if (viewMode === 'edit') {
      customEngine.enableEditMode();
    } else {
      customEngine.enablePreviewMode();
    }
    // eslint-disable-next-line
  }, [isLoaded, canvas, viewMode]);

  const editMode = useMemo(() => editorState['editMode'], [editorState]);

  useEffect(() => {
    if (!isLoaded || !canvas) {
      return;
    }
    if (editMode === 'Transform') {
      if (viewMode === 'edit') {
        customEngine.zoomToPage();
      } else {
        customEngine.zoomToBackdrop();
      }
    }
  }, [isLoaded, canvas, viewMode, customEngine, editMode]);

  const isEditable = isLoaded && viewMode === 'edit';

  const value = {
    customEngine,
    isLoaded,
    isEditable,
    viewMode,
    canvas,
    setCanvas,
    setViewMode,
    editorState,
    selectedBlocks,
    selectedTextProperties,
    selectedShapeProperties,
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
