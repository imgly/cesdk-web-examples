import CreativeEngine from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSinglePageFocus } from './lib/UseSinglePageFocus';
import { caseAssetPath } from './util';
import { SelectionProvider } from './lib/UseSelection';
import {
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource,
  BlurAssetSource
} from '@cesdk/cesdk-js/plugins';

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
      engine.editor.setSetting('mouse/enableScroll', false);
      engine.editor.setSetting('mouse/enableZoom', false);

      await engine.addPlugin(new ColorPaletteAssetSource());
      await engine.addPlugin(new TypefaceAssetSource());
      await engine.addPlugin(new TextAssetSource());
      await engine.addPlugin(new TextComponentAssetSource());
      await engine.addPlugin(new VectorShapeAssetSource());
      await engine.addPlugin(new StickerAssetSource());
      await engine.addPlugin(new EffectsAssetSource());
      await engine.addPlugin(new FiltersAssetSource());
      await engine.addPlugin(new BlurAssetSource());
      await engine.addPlugin(
        new PagePresetsAssetSource({
          include: [
            'ly.img.page.presets.instagram.*',
            'ly.img.page.presets.facebook.*',
            'ly.img.page.presets.x.*',
            'ly.img.page.presets.linkedin.*',
            'ly.img.page.presets.pinterest.*',
            'ly.img.page.presets.tiktok.*',
            'ly.img.page.presets.youtube.*'
          ]
        })
      );
      await engine.addPlugin(new CropPresetsAssetSource());
      await engine.addPlugin(
        new UploadAssetSources({
          include: ['ly.img.image.upload']
        })
      );
      await engine.addPlugin(
        new DemoAssetSources({
          include: ['ly.img.image.*']
        })
      );
      engine.editor.setSetting('page/title/show', false);
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
    <EditorContext.Provider value={value}>
      <SelectionProvider engine={engine}>{children}</SelectionProvider>
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within a EditorProvider');
  }
  return context;
};
