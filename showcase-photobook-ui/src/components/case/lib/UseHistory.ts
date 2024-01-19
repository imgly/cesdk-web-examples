import CreativeEngine from '@cesdk/engine';
import { useEffect, useState } from 'react';

export const useHistory = ({ engine }: { engine: CreativeEngine }) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(
    function syncHistory() {
      const unsubscribe = engine.editor.onHistoryUpdated(() => {
        setCanUndo(engine.editor.canUndo());
        setCanRedo(engine.editor.canRedo());
      });
      return () => {
        unsubscribe();
      };
    },
    [engine]
  );

  return {
    canRedo,
    canUndo
  };
};
