import CreativeEngine from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSinglePageFocus } from './lib/UseSinglePageFocus';
import { caseAssetPath } from './util';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [engineIsLoaded, setEngineIsLoaded] = useState(false);

  const [engine, setEngine] = useState(null);

  const [localUploads, setLocalUploads] = useState([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [editMode, setEditMode] = useState('Transform');
  const editorUpdateCallbackRef = useRef(() => {});
  const engineEventCallbackRef = useRef(() => {});
  const [selectedBlocks, setSelectedBlocks] = useState(null);

  const {
    setEnabled: setFocusEnabled,
    setEngine: setFocusEngine,
    setZoomPaddingBottom,
    currentPageBlockId,
    refocus
  } = useSinglePageFocus({
    zoomPaddingBottomDefault: 8,
    zoomPaddingLeftDefault: 8,
    zoomPaddingRightDefault: 8,
    zoomPaddingTopDefault: 8
  });

  editorUpdateCallbackRef.current = () => {
    if (!engine) return;
    const newEditMode = engine.editor.getEditMode();
    if (!isEqual(newEditMode, editMode)) {
      setEditMode(newEditMode);
    }
  };
  engineEventCallbackRef.current = (events) => {
    if (engine && events.length > 0) {
      // Extract and store the currently selected block
      const newSelectedBlocks = engine.block.findAllSelected().map((id) => ({
        id,
        type: engine.block.getKind(id)
      }));
      if (!isEqual(newSelectedBlocks, selectedBlocks)) {
        setSelectedBlocks(newSelectedBlocks);
      }

      // Extract and store canUndo
      const newCanUndo = engine.editor.canUndo();
      if (newCanUndo !== canUndo) {
        setCanUndo(newCanUndo);
      }
      // Extract and store canRedo
      const newCanRedo = engine.editor.canRedo();
      if (newCanRedo !== canRedo) {
        setCanRedo(newCanRedo);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadEditor = async () => {
      const config = {
        featureFlags: {
          preventScrolling: true
        },
        role: 'Adopter',
        license: process.env.NEXT_PUBLIC_LICENSE
      };

      const engine = await CreativeEngine.init(config);
      if (!mounted) {
        engine.dispose();
        return;
      }
      engine.editor.setSettingBool('mouse/enableScroll', false);
      engine.editor.setSettingBool('mouse/enableZoom', false);

      engine.addDefaultAssetSources();
      engine.addDemoAssetSources({
        sceneMode: 'Design'
      });
      engine.editor.setSettingBool('page/title/show', false);
      engine.editor.onStateChanged(() => editorUpdateCallbackRef.current());
      engine.event.subscribe([], (events) =>
        engineEventCallbackRef.current(events)
      );
      await engine.scene.loadFromURL(caseAssetPath('/social-media.scene'));

      setFocusEngine(engine);
      setFocusEnabled(true);
      setEngine(engine);
      setEngineIsLoaded(true);
    };
    loadEditor();

    return () => {
      mounted = false;
      if (engine) {
        engine.dispose();
      }
      setEngineIsLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    engine,
    engineIsLoaded,
    editMode,
    localUploads,
    setLocalUploads,
    selectedBlocks,
    canUndo,
    canRedo,
    currentPageBlockId,
    setFocusEnabled,
    refocus,
    setZoomPaddingBottom
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
