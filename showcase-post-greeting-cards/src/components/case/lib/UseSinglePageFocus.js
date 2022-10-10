import { useCallback, useEffect, useMemo, useState } from 'react';
import { zoomToSelectedText } from './CreativeEngineUtils';

export const useSinglePageFocus = ({
  zoomPaddingTopDefault = 0,
  zoomPaddingBottomDefault = 0,
  zoomPaddingRightDefault = 0,
  zoomPaddingLeftDefault = 0,
  verticalTextScrollEnabledDefault = false,
  refocusCropModeEnabledDefault = false,
  textScrollTopPaddingDefault = 0,
  textScrollBottomPaddingDefault = 0
}) => {
  const [enabled, setEnabled] = useState(false);
  const [engine, setEngine] = useState(null);
  const [verticalTextScrollEnabled, setVerticalTextScrollEnabled] = useState(
    verticalTextScrollEnabledDefault
  );
  const [refocusCropModeEnabled, setRefocusCropModeEnabled] = useState(
    refocusCropModeEnabledDefault
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(null);

  const [zoomPaddingTop, setZoomPaddingTop] = useState(zoomPaddingTopDefault);
  const [zoomPaddingBottom, setZoomPaddingBottom] = useState(
    zoomPaddingBottomDefault
  );
  const [zoomPaddingRight, setZoomPaddingRight] = useState(
    zoomPaddingRightDefault
  );
  const [zoomPaddingLeft, setZoomPaddingLeft] = useState(
    zoomPaddingLeftDefault
  );

  const [textScrollTopPadding, setTextScrollTopPadding] = useState(
    textScrollTopPaddingDefault
  );
  const [textScrollBottomPadding, setTextScrollBottomPadding] = useState(
    textScrollBottomPaddingDefault
  );

  const [sortedPageIds, setSortedPageIds] = useState(null);
  // We need to react on editMode changes
  const [editMode, setEditMode] = useState(null);
  useEffect(
    function syncSortedPageIds() {
      if (!enabled) {
        return;
      }
      // BlockID 1 is always the scene
      const unsubscribe = engine.event.subscribe([1], (events) => {
        if (events.length > 0) {
          const stack = engine.block.findByType('stack')[0];
          const sortedPageIds = stack ? engine.block.getChildren(stack) : [];
          setSortedPageIds(sortedPageIds);
        }
      });
      return () => unsubscribe();
    },
    [engine, enabled, setSortedPageIds]
  );

  useEffect(
    function syncEditModeState() {
      if (!enabled) {
        return;
      }
      const unsubscribe = engine.editor.onStateChanged(() => {
        const newEditMode = engine.editor.getEditMode();
        if (newEditMode !== editMode) {
          setEditMode(newEditMode);
        }
      });
      return () => unsubscribe();
    },
    [editMode, engine, enabled, setSortedPageIds]
  );

  const currentPageBlockId = useMemo(() => {
    if (enabled && sortedPageIds !== null) {
      return sortedPageIds[currentPageIndex];
    }
  }, [enabled, sortedPageIds, currentPageIndex]);

  const zoomToPage = useCallback(() => {
    if (!enabled) {
      return;
    }
    const isValid =
      currentPageBlockId && engine.block.isValid(currentPageBlockId);
    if (isValid) {
      return engine.scene.zoomToBlock(
        currentPageBlockId,
        zoomPaddingTop,
        zoomPaddingBottom,
        zoomPaddingRight,
        zoomPaddingLeft
      );
    }
  }, [
    enabled,
    currentPageBlockId,
    engine,
    zoomPaddingTop,
    zoomPaddingBottom,
    zoomPaddingRight,
    zoomPaddingLeft
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
        zoomPaddingTop,
        zoomPaddingBottom,
        zoomPaddingRight,
        zoomPaddingLeft
      );
    }
  }, [
    enabled,
    engine,
    zoomPaddingTop,
    zoomPaddingBottom,
    zoomPaddingRight,
    zoomPaddingLeft
  ]);

  const scrollToCursor = useCallback(() => {
    if (!enabled) {
      return;
    }
    zoomToSelectedText(engine, textScrollTopPadding, textScrollBottomPadding);
  }, [enabled, engine, textScrollBottomPadding, textScrollTopPadding]);

  const refocus = useCallback(() => {
    const editMode = engine.editor.getEditMode();
    if (editMode === 'Transform') {
      zoomToPage();
    } else if (verticalTextScrollEnabled && editMode === 'Text') {
      scrollToCursor();
    } else if (refocusCropModeEnabled && editMode === 'Crop') {
      zoomToSelectedBlock();
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
      if (!enabled || !engine || !engine.element) {
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
      visualViewport.addEventListener('resize', zoomToPageOnResize);
      return () =>
        visualViewport.removeEventListener('resize', zoomToPageOnResize);
    },
    [enabled, refocus]
  );

  // With multiple pages in a scene we need to
  useEffect(
    function hideOtherPages() {
      if (!enabled || sortedPageIds === null || currentPageIndex === null) {
        return;
      }
      for (let i = 0; i < sortedPageIds.length; i++) {
        const pageId = sortedPageIds[i];
        engine.block
          .findAllSelected()
          .forEach((blockId) => engine.block.setSelected(blockId, false));
        engine.block.setVisible(pageId, i === currentPageIndex);
      }
      zoomToPage();
    },
    [zoomToPage, engine, sortedPageIds, enabled, currentPageIndex]
  );

  return {
    refocus,
    setEngine,
    setEnabled,
    currentPageIndex,
    setCurrentPageIndex,
    currentPageBlockId,
    setZoomPaddingTop,
    setZoomPaddingBottom,
    setZoomPaddingRight,
    setZoomPaddingLeft,
    setVerticalTextScrollEnabled,
    setRefocusCropModeEnabled,
    setTextScrollTopPadding,
    setTextScrollBottomPadding
  };
};
