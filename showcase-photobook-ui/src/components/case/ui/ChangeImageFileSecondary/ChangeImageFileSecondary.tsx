import { useEngine } from '../../lib/EngineContext';
import { useSelection } from '../../lib/UseSelection';
import ImagesBar from '../ImageBar/ImageBar';

const ChangeImageFileSecondary = () => {
  const { engine } = useEngine();
  const { selection } = useSelection({ engine });
  return (
    <ImagesBar
      onClick={(asset) =>
        engine.asset.applyToBlock(asset.context.sourceId, asset, selection[0])
      }
    />
  );
};
export default ChangeImageFileSecondary;
