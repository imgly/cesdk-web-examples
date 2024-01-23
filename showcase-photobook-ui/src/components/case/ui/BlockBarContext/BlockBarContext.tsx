import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

interface BlockBarContextType {
  selectedId: string | undefined;
  setSelectedId: (id: string | undefined) => void;
  selectedItem: BlockBarItem | undefined;
  items: BlockBarItem[];
}

interface BlockBarItem {
  id: string;
  label: string;
  Component: ReactNode;
  Icon: ReactNode;
}

export interface BlockBarProviderProps {
  items: BlockBarItem[];
  children?: ReactNode;
}

const BlockBarContext = createContext<BlockBarContextType | undefined>(
  undefined
);

export const BlockBarProvider = ({
  items,
  children
}: BlockBarProviderProps) => {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const selectedItem = useMemo(
    () => items.find(({ id }) => id === selectedId),
    [items, selectedId]
  );

  const value = {
    items,
    selectedItem,
    selectedId,
    setSelectedId
  };
  return (
    <BlockBarContext.Provider value={value}>
      {children}
    </BlockBarContext.Provider>
  );
};

export const useBlockBar = () => {
  const context = useContext(BlockBarContext);
  if (context === undefined) {
    throw new Error('useBlockBar must be used within a BlockBarProvider');
  }
  return context;
};
