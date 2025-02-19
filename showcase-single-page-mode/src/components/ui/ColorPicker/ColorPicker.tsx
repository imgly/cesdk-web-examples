import classNames from 'classnames';
import useOnClickOutside from 'lib/useOnClickOutside';
import { cloneElement, ReactElement, useRef, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { ReactComponent as CaretBottom } from './CaretBottom.svg';
import classes from './ColorPicker.module.css';
import useDebounceCallback from './UseDebounceCallback';

interface IColorPicker {
  presetColors: string[];
  name: string;
  label: string;
  defaultValue: string;
  value: string;
  theme: 'light' | 'dark';
  size: 'sm' | 'lg';
  positionX: 'right' | 'left';
  positionY: 'top' | 'bottom';
  children: ReactElement;
  onChange: (value: string) => void;
  onChangeDebounced?: () => void;
}

export const ColorPicker = ({
  value,
  label,
  name,
  children,
  onChange,
  onChangeDebounced = () => {},
  positionX = 'right',
  positionY = 'bottom',
  theme = 'dark',
  size = 'sm',
  defaultValue = '#000',
  presetColors = []
}: IColorPicker) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(pickerRef, () => pickerOpen && setPickerOpen(false));

  const TriggerComponent = children ? (
    children
  ) : (
    <label
      htmlFor={name}
      className={classNames(
        classes.inputWrapper,
        'space-x-2',
        classes['inputWrapper--' + theme]
      )}
    >
      <span
        className={classes.colorPreviewSpan}
        style={{ backgroundColor: value }}
      ></span>
      <span className={classes.input} id={name} />
      <CaretBottom />
    </label>
  );

  const debouncedChangeHandler = useDebounceCallback(onChangeDebounced, 500);
  const handleChange = (color: string) => {
    onChange(color);
    debouncedChangeHandler();
  };

  return (
    <div
      className={classNames(
        'flex items-center justify-between',
        classes.wrapper,
        classes['wrapper--' + theme],
        classes['wrapper--' + size]
      )}
    >
      {label && (
        <label htmlFor={name} className={classes.label}>
          {label}
        </label>
      )}
      <div className={classNames('space-x-2', classes.selectionWrapper)}>
        {cloneElement(TriggerComponent, { onClick: () => setPickerOpen(true) })}

        <div
          style={{
            display: pickerOpen ? 'block' : 'none'
          }}
          className={classNames(
            classes.pickerModal,
            'space-y-1',
            classes[`pickerModal--${positionX}`],
            classes[`pickerModal--${positionY}`]
          )}
          ref={pickerRef}
        >
          <HexColorPicker color={value} onChange={handleChange} />
          <div className={'flex space-x-2'}>
            <span>#</span>
            <HexColorInput color={value} onChange={handleChange} />
          </div>
        </div>
        {presetColors.length > 0 && (
          <div className="flex space-x-1">
            {presetColors.map((color, i) => (
              <button
                key={color + i}
                style={{ backgroundColor: color }}
                onClick={() => {
                  handleChange(color);
                }}
                className={classes.colorPreset}
              ></button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
