import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '../EditorContext';

export const useSelectedProperty = (
  propertyName,
  options = { shouldAddUndoStep: true }
) => {
  const { creativeEngine } = useEditor();
  // Store the initially selected block and stop getting updating properties when the block changed
  const [initialSelectedBlocks] = useState(
    creativeEngine.block.findAllSelected()
  );
  // We currently only support a single block selection
  const firstSelectedBlock = initialSelectedBlocks[0];

  const getSelectedProperty = useCallback(() => {
    try {
      return getProperty(creativeEngine, firstSelectedBlock, propertyName);
    } catch (error) {
      console.log(error);
    }
  }, [firstSelectedBlock, creativeEngine, propertyName]);

  const [propertyValue, setPropertyValue] = useState(getSelectedProperty());

  const setEnginePropertyValue = useCallback(
    (...value) => {
      try {
        if (Array.isArray(value)) {
          setProperty(
            creativeEngine,
            firstSelectedBlock,
            propertyName,
            ...value
          );
        } else {
          setProperty(creativeEngine, firstSelectedBlock, propertyName, value);
        }
        // TODO: This is a workaround for a bug where updating fill colors do not create an updated event.
        // Setting the rotation creates an event for this block
        if (propertyName === 'fill/solid/color') {
          creativeEngine.block.setRotation(
            firstSelectedBlock,
            creativeEngine.block.getRotation(firstSelectedBlock)
          );
        }
        if (options.shouldAddUndoStep) {
          creativeEngine.editor.addUndoStep();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [firstSelectedBlock, creativeEngine, propertyName, options]
  );

  useEffect(() => {
    let stillMounted = true;
    let unsubscribe = creativeEngine.event.subscribe(
      [firstSelectedBlock],
      (events) => {
        if (
          stillMounted &&
          events.length > 0 &&
          // Block might have been destroyed
          creativeEngine.block.isValid(firstSelectedBlock)
        ) {
          const newProperty = getSelectedProperty();
          if (newProperty !== undefined) {
            setPropertyValue(newProperty);
          }
        }
      }
    );
    return () => {
      stillMounted = false;
      unsubscribe();
    };
  }, [creativeEngine, firstSelectedBlock, getSelectedProperty]);

  return [propertyValue, setEnginePropertyValue];
};

const BLOCK_PROPERTY_METHODS = (engine) => ({
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
