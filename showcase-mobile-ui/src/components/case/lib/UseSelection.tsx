import CreativeEngine from '@cesdk/engine';
import isEqual from 'lodash/isEqual';
import { createContext, useContext, useEffect, useState, useRef } from 'react';

interface SelectionContextType {
  selection: number[];
}
const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

interface SelectionProviderProps {
  children: React.ReactNode;
  engine: CreativeEngine;
}

export const SelectionProvider = ({
  children,
  engine
}: SelectionProviderProps) => {
  const [selection, setSelection] = useState(engine?.block.findAllSelected());
  const isChanging = useRef(false);

  useEffect(() => {
    if (engine) {
      const unsubscribe = engine.block.onSelectionChanged(() => {
        if (!isChanging.current) {
          setSelection((selection) => {
            const newSelection = engine.block.findAllSelected();
            isChanging.current = true;
            // Prevent the immediate cancelling of this new selection
            new Promise((resolve) =>
              setTimeout(() => {
                const currentSelection = engine.block.findAllSelected();
                // Correct the selection state if differs
                if (!isEqual(currentSelection, newSelection)) {
                  if (newSelection.length === 0) {
                    engine.block.setSelected(currentSelection[0], false);
                  } else if (currentSelection.length > 0) {
                    // When multiple blocks are selected, only keep the one that was selected
                    currentSelection.forEach((block) => {
                      if (block !== newSelection[0])
                        engine.block.setSelected(currentSelection[0], false);
                    });
                    if (!engine.block.isSelected(newSelection[0]))
                      engine.block.setSelected(newSelection[0], true);
                  } else {
                    engine.block.setSelected(newSelection[0], true);
                  }
                }
                isChanging.current = false;
                resolve;
              }, 200)
            );
            if (isEqual(selection, newSelection)) {
              // Do not rerender by returning the same object reference
              return selection;
            }
            return newSelection;
          });
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [engine]);

  const value = {
    selection
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionContext');
  }
  return context;
};
