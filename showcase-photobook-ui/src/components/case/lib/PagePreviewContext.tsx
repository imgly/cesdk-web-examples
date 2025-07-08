import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useEngine } from './EngineContext';
import { useSinglePageMode } from './SinglePageModeContext';

interface PagePreviewContextType {
  pagePreviews: PagePreviews;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const PagePreviewContext = createContext<PagePreviewContextType | undefined>(
  undefined
);

interface PagePreviewProviderProps {
  children: React.ReactNode;
}

interface PagePreview {
  isDirty: boolean;
  path: string | null;
  isLoading: boolean;
}
type PagePreviews = Record<number, PagePreview>;

export const PagePreviewProvider = ({
  children
}: PagePreviewProviderProps): React.ReactNode => {
  const { engine } = useEngine();
  const { currentPageBlockId, sortedPageIds } = useSinglePageMode();
  const [pagePreviews, setPagePreviews] = useState<PagePreviews>({});
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!currentPageBlockId) {
      return;
    }
    const unsubscribe = engine.editor.onHistoryUpdated(() => {
      setPagePreviews((pagePreviews) => ({
        ...pagePreviews,
        [currentPageBlockId]: {
          ...pagePreviews[currentPageBlockId],
          isDirty: true,
          isLoading: false
        }
      }));
    });
    return () => {
      unsubscribe?.();
    };
  }, [engine, currentPageBlockId]);

  useEffect(
    function generatePreviewForNewPages() {
      if (!sortedPageIds) {
        return;
      }
      setPagePreviews((pagePreviews) => {
        const newPagePreviews: PagePreviews = {};
        Object.entries(pagePreviews).forEach(([pageIdStr, pagePreview]) => {
          const pageId = parseInt(pageIdStr, 10);
          const pageWasDeleted = !sortedPageIds.includes(pageId);
          if (pageWasDeleted) {
            if (pagePreview.path) {
              URL.revokeObjectURL(pagePreview.path);
            }
          } else {
            newPagePreviews[pageId] = pagePreview;
          }
        });
        sortedPageIds.forEach((pageId) => {
          const previewExists = pagePreviews[pageId];
          if (!previewExists) {
            newPagePreviews[pageId] = {
              isDirty: true,
              path: null,
              isLoading: false
            };
          }
        });
        return newPagePreviews;
      });
    },
    [sortedPageIds]
  );

  const pageIdPreviewsToGenerate = useMemo(
    () =>
      sortedPageIds?.filter(
        (id) =>
          pagePreviews[id] &&
          pagePreviews[id].isDirty &&
          !pagePreviews[id].isLoading
      ) || [],
    [sortedPageIds, pagePreviews]
  );

  useEffect(() => {
    const renderDirtyPreviews = async () => {
      pageIdPreviewsToGenerate.forEach((pageId) =>
        setPagePreviews((before) => ({
          ...before,
          [pageId]: { ...before[pageId], isLoading: true }
        }))
      );

      for (let index = 0; index < pageIdPreviewsToGenerate.length; index++) {
        const pageId = pageIdPreviewsToGenerate[index];
        await new Promise((resolve) => requestAnimationFrame(resolve));
        if (engine.block.isValid(pageId)) {
          // @ts-ignore
          const blob = await engine.block.export(pageId, {
            mimeType: 'image/jpeg',
            jpegQuality: 0.5
          });
          setPagePreviews((before) => {
            if (before[pageId]?.path) {
              try {
                URL.revokeObjectURL(before[pageId].path!);
              } catch {}
            }
            return {
              ...before,
              [pageId]: {
                ...before[pageId],
                path: URL.createObjectURL(blob),
                isLoading: false,
                isDirty: false
              }
            };
          });
        } else {
          console.error('PageId', pageId, 'not valid');
        }
      }
    };
    if (enabled && pageIdPreviewsToGenerate.length > 0) {
      renderDirtyPreviews();
    }
  }, [enabled, pageIdPreviewsToGenerate, sortedPageIds, engine]);

  const value = { pagePreviews, enabled, setEnabled };
  return (
    <PagePreviewContext.Provider value={value}>
      {children}
    </PagePreviewContext.Provider>
  );
};

export const usePagePreview = () => {
  const context = useContext(PagePreviewContext);
  if (context === undefined) {
    throw new Error('usePagePreview must be used within a PagePreviewProvider');
  }
  return context;
};
