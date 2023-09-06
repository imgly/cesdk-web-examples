import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { HelperText } from '../HelperText/HelperText';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import { ResolutionInput } from '../ResolutionInput/ResolutionInput';
import classes from './Resolution.module.css';

interface IResolutionOption {
  id: string;
  name: string;
  description: string;
  value: IResolution;
}
interface IResolution {
  width: number;
  height: number;
}

interface Props {
  onChange: (value: IResolution) => void;
  resolutions: {
    [key: string]: IResolutionOption;
  };
  value: IResolution;

  className?: string;
}
const CUSTOM_RESOLUTION_ID = 'custom';

const MAX_RESOLUTION = {
  width: 3840,
  height: 2160
};

const isValidResolution = (resolution: IResolution) => {
  return {
    width: resolution.width <= MAX_RESOLUTION.width,
    height: resolution.height <= MAX_RESOLUTION.height
  };
};

export const Resolution: React.FC<Props> = ({
  resolutions,
  onChange,
  value,
  className
}) => {
  const [resolutionType, setResolutionType] = useState<string>(
    Object.values(resolutions).find(
      (resolution) =>
        resolution.value.width === value.width &&
        resolution.value.height === value.height
    )?.id || CUSTOM_RESOLUTION_ID
  );
  // assuming that the aspect ratio of all resolutions is the same
  const aspectRatio = useMemo(() => {
    const res = Object.values(resolutions)[0];
    return res.value.width / res.value.height;
  }, [resolutions]);

  const [showResolutionInput, setShowResolutionInput] = useState(false);
  const handleSetResolutionType = useCallback(
    (value: string) => {
      if (value === CUSTOM_RESOLUTION_ID) {
        setShowResolutionInput(true);
      } else {
        setShowResolutionInput(false);
        const resolution = Object.values(resolutions).find(
          (resolution) => resolution.id === value
        );
        if (resolution) {
          onChange({
            width: resolution.value.width,
            height: resolution.value.height
          });
        }
      }

      setResolutionType(value);
    },
    [setShowResolutionInput, setResolutionType]
  );

  const options = useMemo(
    () => [
      ...Object.values(resolutions).map((resolution) => ({
        label: resolution.name,
        value: resolution.id,
        description: resolution.description
      })),
      {
        label: 'Custom',
        value: CUSTOM_RESOLUTION_ID,
        description: <i>up to 4K</i>
      }
    ],
    [resolutions]
  );

  return (
    <div className={classNames(classes.root, className)}>
      <RadioGroup
        name="Resolution-Radio-Group"
        value={resolutionType}
        options={options}
        onChange={handleSetResolutionType}
      />
      {showResolutionInput && (
        <>
          <ResolutionInput
            className={classes.input}
            errorWidth={!isValidResolution(value).width}
            errorHeight={!isValidResolution(value).height}
            width={value.width}
            setWidth={(newWidth) => {
              onChange({
                width: newWidth,
                height: Math.round(newWidth / aspectRatio)
              });
            }}
            height={value.height}
            setHeight={(newHeight) => {
              onChange({
                width: Math.round(newHeight * aspectRatio),
                height: newHeight
              });
            }}
          />
          <HelperText
            className={classes.input}
            error={
              !isValidResolution(value).width ||
              !isValidResolution(value).height
            }
          >
            Recommended maximum resolution is 3840 × 2160 px. Performance
            depends on your device as videos are rendered locally.
          </HelperText>
        </>
      )}
    </div>
  );
};
