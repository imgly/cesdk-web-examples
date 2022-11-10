import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import ColorSelect from '../ColorSelect/ColorSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const ChangeTextColorSecondary = () => {
  const [fillColor, setFillColor] = useSelectedProperty('fill/solid/color');

  return (
    <>
      <SlideUpPanelHeader headline="Color"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ColorSelect
          onClick={(color) => setFillColor(color.r, color.g, color.b)}
          activeColor={fillColor}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeTextColorSecondary;
