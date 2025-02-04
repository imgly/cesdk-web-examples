import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import ColorSelect from '../ColorSelect/ColorSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

const ChangeShapeColorSecondary = () => {
  const [fillColor, setFillColor] = useSelectedProperty('fill/solid/color');

  return (
    <>
      <SlideUpPanelHeader headline="Color"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ColorSelect
          onClick={({ r, g, b }) => setFillColor(r, g, b)}
          activeColor={fillColor}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeShapeColorSecondary;
