import { useCallback, useEffect, useState } from 'react';
import { useEngine } from './EngineContext';
import { useSelection } from './UseSelection';
import CreativeEngine, { PropertyType } from '@cesdk/engine';

export const useProperty = (
  block: number,
  propertyName: string,
  options = { shouldAddUndoStep: true }
) => {
  const { engine } = useEngine();

  const getSelectedProperty = useCallback(() => {
    if (!block) return;
    try {
      return getProperty(engine, block, propertyName);
    } catch (error) {
      console.log(error);
    }
  }, [block, engine, propertyName]);

  const [propertyValue, setPropertyValue] = useState(getSelectedProperty());

  useEffect(() => {
    setPropertyValue(getSelectedProperty());
  }, [getSelectedProperty]);

  const setEnginePropertyValue = useCallback(
    (...value: any) => {
      if (!block) return;
      try {
        if (Array.isArray(value)) {
          setProperty(engine, block, propertyName, ...value);
        } else {
          setProperty(engine, block, propertyName, value);
        }
        if (options.shouldAddUndoStep) {
          engine.editor.addUndoStep();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [block, engine, propertyName, options]
  );

  useEffect(() => {
    if (!block) return;
    const blockToSubscribeTo = propertyName.startsWith('fill/')
      ? engine.block.getFill(block)
      : block;
    let unsubscribe = engine.event.subscribe([blockToSubscribeTo], (events) => {
      if (
        events.length > 0 &&
        !events.find(({ type }) => type === 'Destroyed')
      ) {
        const newProperty = getSelectedProperty();
        if (newProperty !== undefined) {
          setPropertyValue(newProperty);
        }
      }
    });
    return () => unsubscribe();
  }, [engine, propertyName, block, getSelectedProperty]);

  if (!block) {
    return [null, () => {}];
  }

  return [propertyValue, setEnginePropertyValue];
};

export const useSelectedProperty = (
  propertyName: string,
  options = { shouldAddUndoStep: true }
) => {
  const { engine } = useEngine();
  const { selection } = useSelection({ engine });
  const [propertyValue, setEnginePropertyValue] = useProperty(
    selection[0],
    propertyName,
    options
  );
  return [propertyValue, setEnginePropertyValue];
};

// @ts-ignore
const BLOCK_PROPERTY_METHODS: Record<
  PropertyType,
  {
    get?: string;
    set?: string;
  }
> = {
  Float: {
    get: 'getFloat',
    set: 'setFloat'
  },
  Bool: {
    get: 'getBool',
    set: 'setBool'
  },
  String: {
    get: 'getString',
    set: 'setString'
  },
  Color: {
    get: 'getColor',
    set: 'setColor'
  },
  Enum: {
    get: 'getEnum',
    set: 'setEnum'
  },
  Int: {
    get: 'getInt',
    set: 'setInt'
  },
  Double: {
    get: 'getDouble',
    set: 'setDouble'
  }
};

export function setProperty(
  engine: CreativeEngine,
  blockId: number,
  propertyName: string,
  ...values: any
) {
  const blockType = engine.block.getPropertyType(propertyName);
  const typeDependentMethodName =
    BLOCK_PROPERTY_METHODS[blockType as keyof typeof BLOCK_PROPERTY_METHODS];
  if (typeDependentMethodName.set) {
    if (Array.isArray(values)) {
      // @ts-ignore
      return engine.block[typeDependentMethodName.set](
        blockId,
        propertyName,
        ...values
      );
    } else {
      // @ts-ignore
      return engine.block[typeDependentMethodName.set](
        blockId,
        propertyName,
        values
      );
    }
  }
}
export function getProperty(
  engine: CreativeEngine,
  blockId: number,
  propertyName: string
) {
  const blockType = engine.block.getPropertyType(propertyName);
  const typeDependentMethodName = BLOCK_PROPERTY_METHODS[blockType];
  if (typeDependentMethodName.get) {
    // @ts-ignore
    return engine.block[typeDependentMethodName.get](blockId, propertyName);
  }
}
