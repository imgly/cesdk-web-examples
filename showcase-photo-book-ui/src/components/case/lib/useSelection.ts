import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';
import { useEngine } from './EngineContext';

export const useSelection = () => {
  const { engine } = useEngine();
  const [selection, setSelection] = useState(engine.block.findAllSelected());

  useEffect(
    function syncHistory() {
      const unsubscribe = engine.block.onSelectionChanged(() => {
        setSelection((selection) => {
          const newSelection = engine.block.findAllSelected();
          if (isEqual(selection, newSelection)) {
            // Do not rerender by returning the same object reference
            return selection;
          }
          return newSelection;
        });
      });
      return () => {
        unsubscribe();
      };
    },
    [engine]
  );

  return {
    selection
  };
};
