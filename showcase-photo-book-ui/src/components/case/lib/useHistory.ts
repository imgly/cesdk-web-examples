import { useEffect, useState } from 'react';
import { useEngine } from './EngineContext';

export const useHistory = () => {
  const { engine } = useEngine();
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
