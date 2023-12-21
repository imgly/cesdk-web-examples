import CreativeEngine from '@cesdk/engine';
import { useEffect, useState } from 'react';

export const useEditMode = ({ engine }: { engine: CreativeEngine }) => {
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
