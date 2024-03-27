import CreativeEngine from '@cesdk/engine';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { zoomToSelectedText } from './CreativeEngineUtils';

export const useSinglePageFocus = ({
  zoomPaddingTopDefault = 0,
  zoomPaddingBottomDefault = 0,
  zoomPaddingRightDefault = 0,
  zoomPaddingLeftDefault = 0,
  verticalTextScrollEnabledDefault = true,
  refocusCropModeEnabledDefault = false,
  textScrollTopPaddingDefault = null,
  textScrollBottomPaddingDefault = null
}) => {
  const [enabled, setEnabled] = useState(false);
  const [engine, setEngine] = useState<CreativeEngine | null>(null);
  const [verticalTextScrollEnabled, setVerticalTextScrollEnabled] = useState(
    verticalTextScrollEnabledDefault
  );
  const [refocusCropModeEnabled, setRefocusCropModeEnabled] = useState(
    refocusCropModeEnabledDefault
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

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
    textScrollTopPaddingDefault ?? zoomPaddingBottomDefault
  );
  const [textScrollBottomPadding, setTextScrollBottomPadding] = useState(
    textScrollBottomPaddingDefault ?? zoomPaddingTopDefault
  );

  const [textCursorPositionX, setTextCursorPositionX] = useState<number | null>(
    null
  );
  const [textCursorPositionY, setTextCursorPositionY] = useState<number | null>(
    null
  );

  const [sortedPageIds, setSortedPageIds] = useState<number[] | null>(null);
  // We need to react on editMode changes
  const [editMode, setEditMode] = useState<string | null>(null);
  useEffect(
    function syncSortedPageIds() {
      if (!enabled || !engine) {
        return;
      }
      // BlockID 1 is always the scene
      const unsubscribe = engine.event.subscribe([1], (events) => {
        if (events.length > 0) {
          setSortedPageIds(engine.scene.getPages());
        }
      });
      setSortedPageIds(engine.scene.getPages());
      return () => unsubscribe();
    },
    [engine, enabled, setSortedPageIds]
  );

  useEffect(
    function syncTextCursorPos() {
      if (!enabled || !engine || editMode !== 'Text') {
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
      // BlockID 1 is always the scene
      const unsubscribe = engine.editor.onStateChanged(() => {
        updateTextCursorPosition();
      });
      updateTextCursorPosition();
      return () => unsubscribe();
    },
    [engine, enabled, editMode, textCursorPositionX, textCursorPositionY]
  );

  useEffect(
    function syncEditModeState() {
      if (!enabled || !engine) {
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
    if (!enabled || !engine) {
      return;
    }
    const isValid =
      currentPageBlockId && engine.block.isValid(currentPageBlockId);
    if (isValid) {
      return engine.scene.zoomToBlock(
        currentPageBlockId,
        zoomPaddingLeft,
        zoomPaddingTop,
        zoomPaddingRight,
        zoomPaddingBottom
      );
    }
  }, [
    enabled,
    currentPageBlockId,
    engine,
    zoomPaddingLeft,
    zoomPaddingTop,
    zoomPaddingRight,
    zoomPaddingBottom
  ]);

  const zoomToSelectedBlock = useCallback(() => {
    if (!enabled || !engine) {
      return;
    }
    const selectedBlock = engine.block.findAllSelected()[0];
    const isValid = selectedBlock && engine.block.isValid(selectedBlock);
    if (isValid) {
      return engine.scene.zoomToBlock(
        selectedBlock,
        zoomPaddingLeft,
        zoomPaddingTop,
        zoomPaddingRight,
        zoomPaddingBottom
      );
    }
  }, [
    enabled,
    engine,
    zoomPaddingLeft,
    zoomPaddingTop,
    zoomPaddingRight,
    zoomPaddingBottom
  ]);

  const scrollToCursor = useCallback(() => {
    if (!enabled || !textCursorPositionY || !engine) {
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
    if (!enabled || !engine) {
      return;
    }
    const editMode = engine.editor.getEditMode();
    if (verticalTextScrollEnabled && editMode === 'Text') {
      scrollToCursor();
    } else if (refocusCropModeEnabled && editMode === 'Crop') {
      zoomToSelectedBlock();
    } else {
      zoomToPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (!enabled || !visualViewport) {
        return;
      }
      const zoomToPageOnResize = () => {
        refocus();
      };
      visualViewport.addEventListener('resize', zoomToPageOnResize);
      return () =>
        visualViewport?.removeEventListener('resize', zoomToPageOnResize);
    },
    [enabled, refocus]
  );

  // With multiple pages in a scene we need to
  useEffect(
    function hideOtherPages() {
      if (
        !enabled ||
        !engine ||
        sortedPageIds === null ||
        sortedPageIds.length === 1 ||
        currentPageIndex === null
      ) {
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
