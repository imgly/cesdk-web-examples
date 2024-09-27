import {
  useEngineSelector,
  withEngine
} from '@cesdk/engine/integrations/react';

// highlight-withEngine
const DisplaySelectedBlocks = withEngine(function DisplaySelectedBlocks({
  engine
}) {
  return <div>{engine.block.findAllSelected()}</div>;
});
// highlight-withEngine

// highlight-useEngineSelector
function useSelectedBlocks() {
  const engine = useContext(EngineContext);

  return useEngineSelector(engine, (e) => {
    return e.block.findAllSelected();
  });
}
// highlight-useEngineSelector
