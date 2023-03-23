import CreativeEngine from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { findCustomStickerAssets } from './components/StickerSelect/CustomStickerAssetLibrary';
import { useSinglePageFocus } from './lib/UseSinglePageFocus';
import { caseAssetPath } from './util';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [engineIsLoaded, setEngineIsLoaded] = useState(false);

  const [creativeEngine, setCreativeEngine] = useState(null);

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
    const newEditMode = creativeEngine.editor.getEditMode();
    if (!isEqual(newEditMode, editMode)) {
      setEditMode(newEditMode);
    }
  };
  engineEventCallbackRef.current = (events) => {
    if (creativeEngine && events.length > 0) {
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
      const assetSources = {
        stickers: {
          findAssets: findCustomStickerAssets
        }
      };
      const config = {
        page: {
          title: {
            show: false
          }
        },
        featureFlags: {
          preventScrolling: true
        },
        assetSources,
        license: process.env.REACT_APP_LICENSE
      };

      const creativeEngine = await CreativeEngine.init(config);
      creativeEngine.editor.onStateChanged(() =>
        editorUpdateCallbackRef.current()
      );
      creativeEngine.event.subscribe([], (events) =>
        engineEventCallbackRef.current(events)
      );
      await creativeEngine.scene.loadFromURL(
        caseAssetPath('/social-media.scene')
      );
      creativeEngine.editor.addUndoStep();

      setFocusEngine(creativeEngine);
      setFocusEnabled(true);
      setCreativeEngine(creativeEngine);
      setEngineIsLoaded(true);
      // HOTFIX: Fixes initial rendering, 1.10.1 will solve this issue
      Array.from(Array(20).keys()).forEach((i) => {
        setTimeout(() => {
          const page = creativeEngine.block.findByType('page')[0];
          creativeEngine.block.setRotation(page, 0);
        }, i * 100);
      });
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
