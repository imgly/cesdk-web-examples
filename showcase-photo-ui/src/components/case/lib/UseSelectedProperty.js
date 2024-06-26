import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '../EditorContext';

export const useProperty = (
  block,
  propertyName,
  options = { shouldAddUndoStep: true }
) => {
  const { engine } = useEditor();

  const getSelectedProperty = useCallback(() => {
    try {
      return getProperty(engine, block, propertyName);
    } catch (error) {
      console.log(error);
    }
  }, [block, engine, propertyName]);

  const [propertyValue, setPropertyValue] = useState(getSelectedProperty());

  const setEnginePropertyValue = useCallback(
    (...value) => {
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
    let unsubscribe = engine.event.subscribe([block], (events) => {
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
  }, [engine, block, getSelectedProperty]);

  return [propertyValue, setEnginePropertyValue];
};

export const useSelectedProperty = (
  propertyName,
  options = { shouldAddUndoStep: true }
) => {
  const { engine } = useEditor();
  // Store the initially selected block and stop getting updating properties when the block changed
  const [initialSelectedBlocks] = useState(engine.block.findAllSelected());
  const [propertyValue, setEnginePropertyValue] = useProperty(
    initialSelectedBlocks[0],
    propertyName,
    options
  );
  return [propertyValue, setEnginePropertyValue];
};

const BLOCK_PROPERTY_METHODS = () => ({
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
    get: 'getColorRGBA',
    set: 'setColorRGBA'
  },
  Enum: {
    get: 'getEnum',
    set: 'setEnum'
  }
});

export function setProperty(engine, blockId, propertyName, ...values) {
  const blockType = engine.block.getPropertyType(propertyName);
  const typeDependentMethodName = BLOCK_PROPERTY_METHODS(engine)[blockType];
  if (typeDependentMethodName.set) {
    if (Array.isArray(values)) {
      return engine.block[typeDependentMethodName.set](
        blockId,
        propertyName,
        ...values
      );
    } else {
      return engine.block[typeDependentMethodName.set](
        blockId,
        propertyName,
        values
      );
    }
  }
}
export function getProperty(engine, blockId, propertyName) {
  const blockType = engine.block.getPropertyType(propertyName);
  const typeDependentMethodName = BLOCK_PROPERTY_METHODS(engine)[blockType];
  if (typeDependentMethodName.get) {
    return engine.block[typeDependentMethodName.get](blockId, propertyName);
  }
}
