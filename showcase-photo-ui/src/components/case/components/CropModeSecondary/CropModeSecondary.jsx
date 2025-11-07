import Slider from '../Slider/Slider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CANVAS_COLOR,
  DEFAULT_HIGHLIGHT_COLOR,
  useEditor
} from '../../EditorContext';
import FlipHorizontalIcon from '../../icons/FlipHorizontal.svg';
import RotateCCWIcon from '../../icons/RotateCCW.svg';
import { useProperty } from '../../lib/UseSelectedProperty';
import { getImageSize } from '../../lib/utils';
import AdjustmentButton from '../AdjustmentButton/AdjustmentButton';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import ResetButton from '../ResetButton/ResetButton';
import SmallButton from '../SmallButton/SmallButton';
import classes from './CropModeSecondary.module.css';
import classNames from 'classnames';

export const ALL_CROP_MODES = [
  { id: 'straighten', label: 'Straighten' },
  { id: 'scale', label: 'Scale' }
];

const CropModeSecondary = () => {
  const { engine, refocus, selectedImageUrl, currentPageBlockId } = useEditor();

  const [cropScaleRatio] = useProperty(currentPageBlockId, 'crop/scaleRatio');
  const cropZoomPercentage = useMemo(
    () => cropScaleRatioToZoomPercentage(cropScaleRatio),
    [cropScaleRatio]
  );

  const [cropRotation, setCropRotation] = useProperty(
    currentPageBlockId,
    'crop/rotation'
  );

  const cropRotationDegrees = useMemo(
    () => radiansToDegree(cropRotation),
    [cropRotation]
  );

  // We need to divide the cropRotationDegrees into rotation degrees (90degree increments) and straighten degrees (-44 to 45)
  const [rotationDegrees, straightenDegrees] = useMemo(() => {
    const rotationsCounts = Math.trunc((cropRotationDegrees - 45) / 90);
    const rotationDegrees = rotationsCounts * 90;
    return [rotationDegrees, cropRotationDegrees - rotationDegrees];
  }, [cropRotationDegrees]);

  const [activeCropModeId, setActiveCropModeId] = useState(
    ALL_CROP_MODES[0].id
  );

  const disableCanvasInteraction = () => {
    engine.element.style.pointerEvents = 'none';
  };
  const enableCanvasInteraction = () => {
    engine.element.style.pointerEvents = 'auto';
  };

  const initialCropScale = useRef();

  const flip = () => {
    engine.block.flipCropHorizontal(currentPageBlockId);
    engine.editor.addUndoStep();
  };

  const scaleImage = (value) => {
    engine.block.setCropScaleRatio(currentPageBlockId, value);
    const currentRatio = engine.block.getCropScaleRatio(currentPageBlockId);
    engine.block.adjustCropToFillFrame(currentPageBlockId, currentRatio);
  };

  const resetCrop = useCallback(async () => {
    const { height, width } = await getImageSize(selectedImageUrl);
    engine.block.setWidth(currentPageBlockId, width);
    engine.block.setHeight(currentPageBlockId, height);
    engine.block.resetCrop(currentPageBlockId);
    // Force layout
    engine.block.setRotation(currentPageBlockId, 0);
    refocus();
  }, [engine, currentPageBlockId, refocus, selectedImageUrl]);

  useEffect(function setupCropHandles() {
    const { r, g, b } = DEFAULT_HIGHLIGHT_COLOR;

    engine.editor.setSettingColorRGBA(
      'highlightColor',
      r / 255,
      g / 255,
      b / 255,
      1
    );
    engine.block.setSelected(currentPageBlockId, true);
    engine.editor.setGlobalScope('design/arrange', 'Allow');
    engine.editor.setEditMode('Crop');
    return () => {
      const { r, g, b } = CANVAS_COLOR;
      engine.editor?.setSettingColorRGBA(
        'highlightColor',
        r / 255,
        g / 255,
        b / 255,
        1
      );
      engine.editor?.setGlobalScope('design/arrange', 'Deny');
      engine.editor?.setEditMode('Transform');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {activeCropModeId && (
        <div className={classes.bar}>
          <div className={classes.wrapper}>
            <div
              className={classNames(
                classes.sliderBarButtons,
                classes['sliderBarButtons--right-orientated']
              )}
            >
              <ResetButton onClick={() => resetCrop()} />
            </div>
            <div className={classes.sliderWrapper}>
              {activeCropModeId === 'straighten' ? (
                <Slider
                  key="straighten"
                  current={straightenDegrees}
                  onChange={(value) => {
                    setCropRotation(degreesToRadians(rotationDegrees + value));
                    engine.block.adjustCropToFillFrame(
                      currentPageBlockId,
                      initialCropScale.current
                    );
                  }}
                  min={-44}
                  onStart={() => {
                    initialCropScale.current = cropScaleRatio;
                    disableCanvasInteraction();
                  }}
                  onStop={() => {
                    engine.editor.addUndoStep();
                    enableCanvasInteraction();
                  }}
                  max={45}
                />
              ) : null}
              {activeCropModeId === 'scale' ? (
                <Slider
                  key="scale"
                  current={cropZoomPercentage}
                  onChange={(value) =>
                    scaleImage(zoomPercentageToCropScaleRatio(value))
                  }
                  onStart={() => {
                    disableCanvasInteraction();
                  }}
                  onStop={() => {
                    engine.editor.addUndoStep();
                    enableCanvasInteraction();
                  }}
                  min={0}
                  max={100}
                  formatCurrentValue={(value) => `${value}%`}
                />
              ) : null}
            </div>
            <div
              className={classNames(
                classes.sliderBarButtons,
                classes['sliderBarButtons--left-orientated']
              )}
            >
              <SmallButton title="Flip the image" onClick={() => flip()}>
                <FlipHorizontalIcon />
              </SmallButton>
              <SmallButton
                title="Rotate the image counterclockwise"
                onClick={() => {
                  setCropRotation(
                    degreesToRadians((cropRotationDegrees - 90) % 360)
                  );
                  const currentRatio =
                    engine.block.getCropScaleRatio(currentPageBlockId);
                  engine.block.adjustCropToFillFrame(
                    currentPageBlockId,
                    currentRatio
                  );
                }}
              >
                <RotateCCWIcon />
              </SmallButton>
            </div>
          </div>
        </div>
      )}
      <AdjustmentsBar gap="md">
        {ALL_CROP_MODES.map((cropMode) => (
          <AdjustmentButton
            key={cropMode.id}
            isActive={activeCropModeId === cropMode.id}
            onClick={() => setActiveCropModeId(cropMode.id)}
            {...cropMode}
          />
        ))}
      </AdjustmentsBar>
    </>
  );
};
export default CropModeSecondary;

/**
 * Transforms a cropScaleRatio into a percentage based zoom value
 * @param {Number} cropScaleRatio The CropScaleRatio of an image
 * @returns {Number} Percentage of the current zoom. 0% equals when no zoom applied. 100% when 'fully' zoomed in.
 */
const cropScaleRatioToZoomPercentage = (cropScaleRatio) =>
  Math.round((1 - 1 / cropScaleRatio) * 100);
const zoomPercentageToCropScaleRatio = (zoomPercentage) =>
  -(100 / (Math.min(99.9, zoomPercentage) - 100));

const radiansToDegree = (radians) => Math.round(radians * (180 / Math.PI));
const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;
