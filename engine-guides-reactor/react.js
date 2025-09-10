import {
  useEngineSelector,
  withEngine
} from '@cesdk/engine/integrations/react';

const DisplaySelectedBlocks = withEngine(function DisplaySelectedBlocks({
  engine
}) {
  return <div>{engine.block.findAllSelected()}</div>;
});

function useSelectedBlocks() {
  const engine = useContext(EngineContext);

  return useEngineSelector(engine, (e) => {
    return e.block.findAllSelected();
  });
}
