import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';

import { ResolutionItemValue } from '../../types';
import { RadioGroup } from '../RadioGroup/RadioGroup';

import classes from './Resolution.module.css';
import { ResolutionInput } from '../ResolutionInput/ResolutionInput';
import { CreativeEngine } from '@cesdk/cesdk-js';
import { HelperText } from '../HelperText/HelperText';

interface Props {
  engine: CreativeEngine;
  setScale: (value: number) => void;
  className?: string;
}

type ResolutionScaleValue = Exclude<
  ResolutionItemValue,
  ResolutionItemValue.Custom
>;

const ResolutionScale: Record<ResolutionScaleValue, number> = {
  [ResolutionItemValue.Small]: 0.5,
  [ResolutionItemValue.Original]: 1,
  [ResolutionItemValue.Large]: 1.5,
  [ResolutionItemValue.Huge]: 2
};

const MAX_RESOLUTION = 4000;

const createDescription = (
  engine: CreativeEngine,
  scene: number | null,
  scale: number,
  pageWidth: number,
  pageHeight: number
) => {
  const designUnit = scene
    ? engine.block.getEnum(scene, 'scene/designUnit')
    : 'Pixel';
  const defaultDPI = scene ? engine.block.getFloat(scene, 'scene/dpi') : 300;

  const dpi = defaultDPI * scale;

  let width = pageWidth * scale;
  let height = pageHeight * scale;

  if (designUnit === 'Millimeter') {
    width = Math.round((pageWidth * dpi) / 25.4);
    height = Math.round((pageHeight * dpi) / 25.4);
  }

  if (designUnit === 'Inch') {
    width = Math.round(pageWidth * dpi);
    height = Math.round(pageHeight * dpi);
  }

  return `${width} x ${height} px`;
};

export const Resolution: React.FC<Props> = ({
  engine,
  setScale,
  className
}) => {
  const scene = useMemo(() => engine?.scene.get(), [engine]);

  const pageWidth = scene
    ? engine.block.getFloat(scene, 'scene/pageDimensions/width')
    : 0;
  const pageHeight = scene
    ? engine.block.getFloat(scene, 'scene/pageDimensions/height')
    : 0;

  const getDescription = useCallback(
    (scale: number) =>
      createDescription(engine, scene, scale, pageWidth, pageHeight),
    [engine, scene, pageWidth, pageHeight]
  );

  // display the expected width and height based on the page size
  const ResolutionItems = useMemo(
    () => [
      {
        label: 'Small',
        value: ResolutionItemValue.Small,
        description: getDescription(ResolutionScale[ResolutionItemValue.Small])
      },
      {
        label: 'Original',
        value: ResolutionItemValue.Original,
        description: getDescription(
          ResolutionScale[ResolutionItemValue.Original]
        )
      },
      {
        label: 'Large',
        value: ResolutionItemValue.Large,
        description: getDescription(ResolutionScale[ResolutionItemValue.Large])
      },
      {
        label: 'Huge',
        value: ResolutionItemValue.Huge,
        description: getDescription(ResolutionScale[ResolutionItemValue.Huge])
      },
      {
        label: 'Custom',
        value: ResolutionItemValue.Custom,
        description: <i>up to 4k</i>
      }
    ],
    [getDescription]
  );

  const [width, setWidth] = useState<number>(pageWidth);
  const [height, setHeight] = useState<number>(pageHeight);
  const [resolutionType, setResolutionType] = useState<ResolutionItemValue>(
    ResolutionItemValue.Original
  );
  const [showResolutionInput, setShowResolutionInput] = useState(false);
  const [errorWidth, setErrorWidth] = useState(false);
  const [errorHeight, setErrorHeight] = useState(false);

  const handleSetWidth = useCallback(
    (value: number) => {
      // set the width and keep the aspect ratio for height
      setWidth(value);
      const nextHeight = (pageHeight * value) / pageWidth;
      setHeight(nextHeight);
      // set the pixel scale value for the export
      setScale(value / pageWidth);

      setErrorWidth(value > MAX_RESOLUTION);
      setErrorHeight(nextHeight > MAX_RESOLUTION);
    },
    [setWidth, pageWidth, pageHeight, setScale, setErrorWidth, setErrorHeight]
  );

  const handleSetHeight = useCallback(
    (value: number) => {
      // set the height and keep the aspect ratio for the width
      setHeight(value);
      const nextWidth = (pageWidth * value) / pageHeight;
      setWidth(nextWidth);
      // set the pixel scale for the export
      setScale(value / pageHeight);

      setErrorWidth(nextWidth > MAX_RESOLUTION);
      setErrorHeight(value > MAX_RESOLUTION);
    },
    [setHeight, pageWidth, pageHeight, setScale, setErrorWidth, setErrorHeight]
  );

  const handleSetResolutionType = useCallback(
    (value: ResolutionItemValue) => {
      if (value === ResolutionItemValue.Custom) {
        setShowResolutionInput(true);
      } else {
        setShowResolutionInput(false);
        setScale(ResolutionScale[value]);
      }

      setResolutionType(value);
    },
    [setShowResolutionInput, setResolutionType, setScale]
  );

  return (
    <div className={classNames(classes.root, className)}>
      <RadioGroup<ResolutionItemValue>
        name="Resolution-Radio-Group"
        value={resolutionType}
        options={ResolutionItems}
        onChange={handleSetResolutionType}
      />
      {showResolutionInput && (
        <>
          <ResolutionInput
            className={classes.input}
            errorWidth={errorWidth}
            errorHeight={errorHeight}
            width={width}
            height={height}
            setWidth={handleSetWidth}
            setHeight={handleSetHeight}
          />
          <HelperText
            className={classes.input}
            error={errorWidth || errorHeight}
          >
            {`Maximum resolution is ${MAX_RESOLUTION}px.`}
          </HelperText>
        </>
      )}
    </div>
  );
};
