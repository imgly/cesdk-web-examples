import { useMemo, useRef } from 'react';
import { useEditor } from '../../EditorContext';

import { ReactComponent as ResetIcon } from '../../icons/Reset.svg';
import { useSelectedProperty } from '../../lib/UseSelectedProperty';
import IconButton from '../IconButton/IconButton';
import Slider from '../Slider/Slider';
import SliderLabel from '../SliderLabel/SliderLabel';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import classes from './ChangeCropSecondary.module.css';

const ChangeCropSecondary = () => {
  const { creativeEngine, selectedBlocks } = useEditor();
  const selectedImage = useMemo(() => selectedBlocks[0], [selectedBlocks]);
  const [cropScaleRatio] = useSelectedProperty('crop/scaleRatio');
  const [cropRotation] = useSelectedProperty('crop/rotation');
  const currentCropRotationDegrees = useMemo(
    () => cropRotation * (180 / Math.PI),
    [cropRotation]
  );
  const initialCropScaleRatio = useRef(0);

  const resetCurrentCrop = () => {
    selectedBlocks.forEach(({ id }) => {
      creativeEngine.block.resetCrop(id);
    });
  };

  const scale = (newScale) => {
    selectedBlocks.forEach(({ id }) => {
      creativeEngine.block.setCropScaleRatio(id, newScale);
      const currentRatio = creativeEngine.block.getCropScaleRatio(id);
      creativeEngine.block.adjustCropToFillFrame(id, currentRatio);
    });
  };

  const straighten = (degree) => {
    selectedBlocks.forEach(({ id }) => {
      const rotationInRadians = (degree * Math.PI) / 180;
      creativeEngine.block.setCropRotation(id, rotationInRadians);
      // Scale crop back to the cropScaleRatio before we started straightening
      creativeEngine.block.adjustCropToFillFrame(
        id,
        initialCropScaleRatio.current
      );
    });
  };

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
              value={cropScaleRatio * 100}
              trackStartValue={100}
              max={400}
              onChange={(value) => scale(value / 100)}
            />
          </SliderLabel>
          <SliderLabel label={'Straighten'}>
            <Slider
              min={-45}
              value={currentCropRotationDegrees}
              trackStartValue={0}
              max={45}
              onAfterChange={() => {
                creativeEngine.element.style['pointer-events'] = 'initial';
              }}
              onBeforeChange={() => {
                creativeEngine.element.style['pointer-events'] = 'none';
                initialCropScaleRatio.current =
                  creativeEngine.block.getCropScaleRatio(selectedImage.id);
              }}
              onChange={(value) => straighten(value)}
            />
          </SliderLabel>
        </div>
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeCropSecondary;
