import CreativeEngine from '@cesdk/engine';
import { isEqual } from 'lodash';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CustomEngine } from './CustomEngine';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState('edit');
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [canvas, setCanvas] = useState(null);

  const [customEngine, setCustomEngine] = useState(null);

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
  const engineEventCallbackRef = useRef(() => {});
  const [selectedBlocks, setSelectedBlocks] = useState(null);
  editorUpdateCallbackRef.current = () => {
    const newEditorState = customEngine.getEditorState();
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
      creativeEngine.editor.onStateChanged(editorUpdateCallbackRef.current);
      creativeEngine.event.subscribe([], engineEventCallbackRef.current);
      await newCustomEngine.loadScene(
        `${window.location.protocol + "//" + window.location.host}/cases/custom-ui/kiosk.scene`
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
    setViewMode,
    editorState,
    selectedBlocks,
    selectedTextProperties,
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
