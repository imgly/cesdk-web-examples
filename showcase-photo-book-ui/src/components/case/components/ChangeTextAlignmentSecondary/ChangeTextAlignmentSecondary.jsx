import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import AlignmentSelect from '../AlignmentSelect/AlignmentSelect';

const ChangeTextAlignmentSecondary = () => {
  const [alignment, setAlignment] = useSelectedProperty(
    'text/horizontalAlignment'
  );

  return (
    <AlignmentSelect
      onClick={(fontUri) => setAlignment(fontUri)}
      activeAlignment={alignment}
    />
  );
};
export default ChangeTextAlignmentSecondary;
