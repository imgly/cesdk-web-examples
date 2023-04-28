import { useEffect, useState } from 'react';
import { useEngine } from './EngineContext';

export const useEditMode = () => {
  const { engine } = useEngine();
  const [editMode, setEditMode] = useState(engine.editor.getEditMode());

  useEffect(
    function syncHistory() {
      const unsubscribe = engine.editor.onStateChanged(() => {
        setEditMode(engine.editor.getEditMode());
      });
      return () => {
        unsubscribe();
      };
    },
    [engine]
  );

  return {
    editMode
  };
};
