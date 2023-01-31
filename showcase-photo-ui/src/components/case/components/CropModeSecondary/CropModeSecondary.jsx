import Slider from '../Slider/Slider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CANVAS_COLOR,
  DEFAULT_HIGHLIGHT_COLOR,
  useEditor
} from '../../EditorContext';
import { ReactComponent as FlipHorizontalIcon } from '../../icons/FlipHorizontal.svg';
import { ReactComponent as RotateCCWIcon } from '../../icons/RotateCCW.svg';
import { forceRerender } from '../../lib/CreativeEngineUtils';
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
  const { creativeEngine, refocus, selectedImageUrl, currentPageBlockId } =
    useEditor();

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
    creativeEngine.element.style.pointerEvents = 'none';
  };
  const enableCanvasInteraction = () => {
    creativeEngine.element.style.pointerEvents = 'auto';
  };

  const initialCropScale = useRef();

  const flip = () => {
    creativeEngine.block.flipCropHorizontal(currentPageBlockId);
    creativeEngine.editor.addUndoStep();
  };

  const scaleImage = (value) => {
    creativeEngine.block.setCropScaleRatio(currentPageBlockId, value);
    const currentRatio =
      creativeEngine.block.getCropScaleRatio(currentPageBlockId);
    creativeEngine.block.adjustCropToFillFrame(
      currentPageBlockId,
      currentRatio
    );
  };

  const resetCrop = useCallback(async () => {
    const { height, width } = await getImageSize(selectedImageUrl);
    creativeEngine.block.setWidth(currentPageBlockId, width);
    creativeEngine.block.setHeight(currentPageBlockId, height);
    creativeEngine.block.resetCrop(currentPageBlockId);
    // Force layout
    creativeEngine.block.setRotation(currentPageBlockId, 0);
    refocus();
  }, [creativeEngine, currentPageBlockId, refocus, selectedImageUrl]);

  useEffect(function setupCropHandles() {
    const { r, g, b } = DEFAULT_HIGHLIGHT_COLOR;

    creativeEngine.editor.setSettingColorRGBA(
      'ubq://highlightColor',
      r / 255,
      g / 255,
      b / 255,
      1
    );
    creativeEngine.block.setSelected(currentPageBlockId, true);
    creativeEngine.editor.setGlobalScope('design/arrange', 'Allow');
    creativeEngine.editor.setEditMode('Crop');
    // Workaround a bug where setGlobalScope does not force a rerender.
    forceRerender(creativeEngine);
    return () => {
      const { r, g, b } = CANVAS_COLOR;
      creativeEngine.editor.setSettingColorRGBA(
        'ubq://highlightColor',
        r / 255,
        g / 255,
        b / 255,
        1
      );
      creativeEngine.editor.setGlobalScope('design/arrange', 'Deny');
      creativeEngine.editor.setEditMode('Transform');
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
                    creativeEngine.block.adjustCropToFillFrame(
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
                    creativeEngine.editor.addUndoStep();
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
                    creativeEngine.editor.addUndoStep();
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
                    creativeEngine.block.getCropScaleRatio(currentPageBlockId);
                  creativeEngine.block.adjustCropToFillFrame(
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
