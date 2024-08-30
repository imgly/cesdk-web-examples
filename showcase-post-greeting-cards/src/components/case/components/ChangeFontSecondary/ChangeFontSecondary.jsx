import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import FontSelect from '../FontSelect/FontSelect';

const ChangeFontSecondary = () => {
  const [fontFileUri, setFontFileUri] = useSelectedProperty('text/fontFileUri');

  return (
    <FontSelect
      onSelect={(fontUri) => setFontFileUri(fontUri)}
      activeFontUri={fontFileUri}
    />
  );
};
export default ChangeFontSecondary;
