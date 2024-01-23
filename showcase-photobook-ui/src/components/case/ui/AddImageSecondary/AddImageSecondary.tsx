import { useEngine } from '../../lib/EngineContext';
import ImagesBar from '../ImageBar/ImageBar';

const AddImageSecondary = () => {
  const { engine } = useEngine();

  return (
    <ImagesBar
      onClick={async (asset) => {
        engine.asset.apply(asset.context.sourceId, asset);
      }}
    />
  );
};
export default AddImageSecondary;
