import { DesignBlockType } from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { zoomToSelectedText } from './CreativeEngineUtils';
import { useEngine } from './EngineContext';
import { useEditMode } from './useEditMode';

interface SinglePageModeContextType {
  // The sorted page ids of the scene.
  sortedPageIds: number[] | null;
  // Forces zooming to the currently focused element
  refocus: () => void;
  // Whether the single page mode is enabled.
  setEnabled: (enabled: boolean) => void;
  currentPageBlockId: number | null | undefined;
  setCurrentPageBlockId: (value: number) => Promise<void>;
  setPaddingTop: (value: number) => void;
  setPaddingBottom: (value: number) => void;
  setPaddingRight: (value: number) => void;
  setPaddingLeft: (value: number) => void;
  setVerticalTextScrollEnabled: (value: boolean) => void;
  setRefocusCropModeEnabled: (value: boolean) => void;
  setTextScrollTopPadding: (value: number) => void;
  setTextScrollBottomPadding: (value: number) => void;
}

const SinglePageModeContext = createContext<
  SinglePageModeContextType | undefined
>(undefined);

interface SinglePageModeProviderProps {
  /** The children to render. */
  children: React.ReactNode;
  /** The default page padding top in pixels. */
  defaultPaddingTop: number;
  /** The default page padding bottom in pixels. */
  defaultPaddingBottom: number;
  /** The default page padding right in pixels. */
  defaultPaddingRight: number;
  /** The default page padding left in pixels. */
  defaultPaddingLeft: number;
  /**
   * Whether refocus crop mode is enabled by default.
   * When it this mode is enabled and a user enters crop mode,
   * the canvas will zoom to the currently selected image block.
   */
  defaultRefocusCropModeEnabled: boolean;
  /**
   * Whether vertical text scrolling is enabled by default.
   * When enabled, the canvas scrolls to the cursor, when the cursor would leave the canvas.
   * Takes defaultTextScrollTopPadding and defaultTextScrollBottomPadding into account to determine whether
   * the scrolling should happen.
   * Default: true
   * */
  defaultVerticalTextScrollEnabled: boolean;
  /** The default text scroll top padding in pixels. Defaults to defaultPaddingBottom. */
  defaultTextScrollTopPadding: number | null;
  /** The default text scroll bottom padding in pixels. Defaults to defaultPaddingTop. */
  defaultTextScrollBottomPadding: number | null;
}

/**
 * Handles everything to keep a single page of the scene in view on canvas.
 */
export const SinglePageModeProvider = ({
  children,
  defaultPaddingTop = 0,
  defaultPaddingBottom = 0,
  defaultPaddingRight = 0,
  defaultPaddingLeft = 0,
  defaultVerticalTextScrollEnabled = true,
  defaultRefocusCropModeEnabled = false,
  defaultTextScrollTopPadding = null,
  defaultTextScrollBottomPadding = null
}: SinglePageModeProviderProps): React.ReactNode => {
  const { engine } = useEngine();
  const [enabled, setEnabled] = useState(false);
  const [verticalTextScrollEnabled, setVerticalTextScrollEnabled] = useState(
    defaultVerticalTextScrollEnabled
  );
  const [refocusCropModeEnabled, setRefocusCropModeEnabled] = useState(
    defaultRefocusCropModeEnabled
  );

  const [paddingTop, setPaddingTop] = useState(defaultPaddingTop);
  const [paddingBottom, setPaddingBottom] = useState(defaultPaddingBottom);
  const [paddingRight, setPaddingRight] = useState(defaultPaddingRight);
  const [paddingLeft, setPaddingLeft] = useState(defaultPaddingLeft);

  const [textScrollTopPadding, setTextScrollTopPadding] = useState(
    defaultTextScrollTopPadding ?? defaultPaddingBottom
  );
  const [textScrollBottomPadding, setTextScrollBottomPadding] = useState(
    defaultTextScrollBottomPadding ?? defaultPaddingTop
  );

  /** Keep track of the current textCursorPositionX for text scrolling */
  const [textCursorPositionX, setTextCursorPositionX] = useState<number | null>(
    null
  );
  /** Keep track of the current textCursorPositionY for text scrolling */
  const [textCursorPositionY, setTextCursorPositionY] = useState<number | null>(
    null
  );

  const [sortedPageIds, setSortedPageIds] = useState<number[] | null>(null);
  const { editMode } = useEditMode();
  useEffect(
    function syncSortedPageIds() {
      if (!enabled) {
        return;
      }
      const updateSortedPageIds = () => {
        const sortedPageIds = engine.scene.getPages();
        setSortedPageIds((prevState) => {
          if (isEqual(prevState, sortedPageIds)) {
            return prevState; // Do not rerender
          }
          return sortedPageIds;
        });
      };
      const pagesParent = engine.block.getParent(
        engine.block.findByType(DesignBlockType.Page)[0]
      )!;
      const unsubscribe = engine.event.subscribe([pagesParent], (events) => {
        if (events.length > 0) {
          updateSortedPageIds();
        }
      });
      updateSortedPageIds();
      return () => unsubscribe();
    },
    [engine, enabled, setSortedPageIds]
  );

  useEffect(
    function syncTextCursorPos() {
      if (!enabled || editMode !== 'Text') {
        return;
      }
      const updateTextCursorPosition = () => {
        const newTextCursorPositionX =
          engine.editor.getTextCursorPositionInScreenSpaceX();
        if (textCursorPositionX !== newTextCursorPositionX) {
          setTextCursorPositionX(newTextCursorPositionX);
        }
        const newTextCursorPositionY =
          engine.editor.getTextCursorPositionInScreenSpaceY();
        if (textCursorPositionY !== newTextCursorPositionY) {
          setTextCursorPositionY(newTextCursorPositionY);
        }
      };
      const unsubscribe = engine.editor.onStateChanged(() => {
        updateTextCursorPosition();
      });
      updateTextCursorPosition();
      return () => unsubscribe();
    },
    [engine, enabled, editMode, textCursorPositionX, textCursorPositionY]
  );

  const [currentPageBlockId, setCurrentPageBlockIdInternal] = useState(
    sortedPageIds?.[0]
  );
  const setCurrentPageBlockId = useCallback(
    (newPageBlockId: number) => {
      // We need to deselect all blocks before changing the page block
      engine.block
        .findAllSelected()
        .forEach((id) => engine.block.setSelected(id, false));
      // Allow deselection to propagate first, so that all components are unmounted when changing the page.
      return new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          setCurrentPageBlockIdInternal(newPageBlockId);
          resolve();
        });
      });
    },
    [engine]
  );
  const zoomToPage = useCallback(() => {
    if (!enabled) {
      return;
    }
    const isValid =
      currentPageBlockId && engine.block.isValid(currentPageBlockId);
    if (isValid) {
      return engine.scene.zoomToBlock(
        currentPageBlockId,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom
      );
    }
  }, [
    enabled,
    currentPageBlockId,
    engine,
    paddingLeft,
    paddingTop,
    paddingRight,
    paddingBottom
  ]);

  const zoomToSelectedBlock = useCallback(() => {
    if (!enabled) {
      return;
    }
    const selectedBlock = engine.block.findAllSelected()[0];
    const isValid = selectedBlock && engine.block.isValid(selectedBlock);
    if (isValid) {
      return engine.scene.zoomToBlock(
        selectedBlock,
        paddingLeft,
        paddingTop,
        paddingRight,
        paddingBottom
      );
    }
  }, [enabled, engine, paddingLeft, paddingTop, paddingRight, paddingBottom]);

  const scrollToCursor = useCallback(() => {
    if (!enabled || !textCursorPositionY) {
      return;
    }
    zoomToSelectedText(engine, textScrollTopPadding, textScrollBottomPadding);
  }, [
    enabled,
    engine,
    textCursorPositionY,
    textScrollBottomPadding,
    textScrollTopPadding
  ]);

  const refocus = useCallback(() => {
    const editMode = engine.editor.getEditMode();
    if (verticalTextScrollEnabled && editMode === 'Text') {
      scrollToCursor();
    } else if (refocusCropModeEnabled && editMode === 'Crop') {
      zoomToSelectedBlock();
    } else {
      zoomToPage();
    }
  }, [
    engine,
    verticalTextScrollEnabled,
    scrollToCursor,
    refocusCropModeEnabled,
    zoomToSelectedBlock,
    zoomToPage
  ]);

  // Refocus page when the user leaves text edit mode
  useEffect(
    function refocusAfterEditModeChange() {
      if (enabled && editMode) {
        refocus();
      }
    },
    [enabled, editMode, engine, refocus]
  );

  useEffect(
    function refocusAfterCanvasSizeChange() {
      if (!enabled || !engine.element) {
        return;
      }

      const resizeObserver = new ResizeObserver(() => {
        refocus();
      });
      resizeObserver.observe(engine.element);

      return () => {
        resizeObserver.disconnect();
      };
    },
    [enabled, editMode, engine, refocus]
  );

  // We want to refocus the canvas when the visualViewport size changes e.g when the keyboard slides up on iOS devices.
  useEffect(
    function refocusOnVisualViewportChange() {
      if (!enabled) {
        return;
      }
      const zoomToPageOnResize = () => {
        refocus();
      };
      visualViewport?.addEventListener('resize', zoomToPageOnResize);
      return () =>
        visualViewport?.removeEventListener('resize', zoomToPageOnResize);
    },
    [enabled, refocus]
  );

  useEffect(
    function hideInactivePages() {
      if (
        !enabled ||
        sortedPageIds === null ||
        sortedPageIds.length === 1 ||
        currentPageBlockId === null
      ) {
        return;
      }
      for (let i = 0; i < sortedPageIds.length; i++) {
        const pageId = sortedPageIds[i];
        const isValid = engine.block.isValid(pageId);
        if (isValid) {
          engine.block
            .findAllSelected()
            .forEach((blockId) => engine.block.setSelected(blockId, false));
          engine.block.setVisible(pageId, pageId === currentPageBlockId);
        }
      }
      zoomToPage();
    },
    [zoomToPage, engine, sortedPageIds, enabled, currentPageBlockId]
  );

  useEffect(
    function resetHistoryOnPageChange() {
      if (!enabled) return;
      if (currentPageBlockId) {
        let oldHistory = engine.editor.getActiveHistory();
        let newHistory = engine.editor.createHistory();
        engine.editor.setActiveHistory(newHistory);
        engine.editor.destroyHistory(oldHistory);
      }
    },
    [currentPageBlockId, enabled, engine]
  );

  const value = {
    sortedPageIds,
    refocus,
    setEnabled,
    setCurrentPageBlockId,
    currentPageBlockId,
    setPaddingTop,
    setPaddingBottom,
    setPaddingRight,
    setPaddingLeft,
    setVerticalTextScrollEnabled,
    setRefocusCropModeEnabled,
    setTextScrollTopPadding,
    setTextScrollBottomPadding
  };
  return (
    <SinglePageModeContext.Provider value={value}>
      {children}
    </SinglePageModeContext.Provider>
  );
};

export const useSinglePageMode = () => {
  const context = useContext(SinglePageModeContext);
  if (context === undefined) {
    throw new Error(
      'useSinglePageMode must be used within a SinglePageModeProvider'
    );
  }
  return context;
};
