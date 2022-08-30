import { useEditor } from '../../EditorContext';

import { ReactComponent as ResetIcon } from '../../icons/Reset.svg';
import IconButton from '../IconButton/IconButton';
import Slider from '../Slider/Slider';
import SliderLabel from '../SliderLabel/SliderLabel';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import classes from './ChangeCropSecondary.module.css';

const ChangeCropSecondary = () => {
  const {
    selectedImageProperties,
    customEngine: { resetCurrentCrop, straighten, scale }
  } = useEditor();

  return (
    <>
      <SlideUpPanelHeader headline="Crop" closeComponent={<>Done</>}>
        <IconButton icon={<ResetIcon />} onClick={() => resetCurrentCrop()} />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <div className={classes.inputWrapper}>
          <SliderLabel label={'Scale'}>
            <Slider
              min={100}
              value={selectedImageProperties['crop/scaleRatio'] * 100}
              trackStartValue={100}
              max={400}
              onChange={(value) => scale(value / 100)}
            />
          </SliderLabel>
          <SliderLabel label={'Straighten'}>
            <Slider
              min={-45}
              value={selectedImageProperties['crop/rotation']}
              trackStartValue={0}
              max={45}
              onChange={(value) => straighten(value)}
            />
          </SliderLabel>
        </div>
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeCropSecondary;
