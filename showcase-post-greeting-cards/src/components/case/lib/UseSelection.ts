import CreativeEngine from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';

export const useSelection = ({ engine }: { engine: CreativeEngine }) => {
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
