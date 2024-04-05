import {
  Children,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo
} from 'react';
import {
  BlockBarProvider,
  BlockBarProviderProps,
  useBlockBar
} from '../BlockBarContext/BlockBarContext';
import DockMenu from '../DockMenu/DockMenu';
import DockMenuGroup from '../DockMenuGroup/DockMenuGroup';
import IconButton from '../IconButton/IconButton';

export const BlockBar = ({ items, ...props }: BlockBarProviderProps) => {
  return (
    <BlockBarProvider items={items}>
      <BlockBarUI {...props} />
    </BlockBarProvider>
  );
};

const BlockBarUI = ({ children }: { children?: ReactNode }) => {
  const { selectedId, setSelectedId, selectedItem, items } = useBlockBar();

  const childrenWithProps = useMemo(
    () =>
      Children.map(children, (child) => {
        // Only clone the element if it's a valid React element
        if (isValidElement(child)) {
          // @ts-ignore
          return cloneElement(child, { isActive: !selectedId });
        }
        return child;
      }),
    [children, selectedId]
  );

  return (
    <>
      {selectedItem?.Component}
      <DockMenu>
        <DockMenuGroup>
          {items.map(({ id, label, Icon }) => (
            <IconButton
              key={id}
              onClick={() => setSelectedId(selectedId !== id ? id : undefined)}
              icon={Icon}
              isActive={selectedId === undefined || selectedId === id}
            >
              {label}
            </IconButton>
          ))}
        </DockMenuGroup>
        {children && <DockMenuGroup>{childrenWithProps}</DockMenuGroup>}
      </DockMenu>
    </>
  );
};

export default BlockBar;
