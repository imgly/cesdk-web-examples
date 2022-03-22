import classNames from 'classnames';
import { ReactComponent as CaretBottom } from './CaretBottom.svg';
import classes from './ColorPicker.module.css';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useState, useRef } from 'react';
import useOnClickOutside from 'lib/useOnClickOutside';

interface IColorPicker {
  presetColors: string[];
  name: string;
  label: string;
  defaultValue: string;
  value: string;
  theme: 'light' | 'dark';
  size: 'sm' | 'lg';
  onChange: (value: string) => void;
}

export const ColorPicker = ({
  value,
  label,
  name,
  onChange,
  theme = 'dark',
  size = 'sm',
  defaultValue = '#000',
  presetColors = []
}: IColorPicker) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(pickerRef, () => pickerOpen && setPickerOpen(false));
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
        <label
          htmlFor={name}
          className={classNames(
            classes.inputWrapper,
            'space-x-2',
            classes['inputWrapper--' + theme]
          )}
          onClick={() => setPickerOpen(true)}
        >
          <span
            className={classes.colorPreviewSpan}
            style={{ backgroundColor: value }}
          ></span>
          <span className={classes.input} id={name} />
          <CaretBottom />
        </label>

        <div
          style={{
            display: pickerOpen ? 'block' : 'none'
          }}
          className={classNames(classes.pickerModal, 'space-y-1')}
          ref={pickerRef}
        >
          <HexColorPicker color={value} onChange={onChange} />
          <div className={'flex space-x-2'}>
            <span>#</span>
            <HexColorInput color={value} onChange={onChange} />
          </div>
        </div>

        {presetColors.map((color, i) => (
          <button
            key={color + i}
            style={{ backgroundColor: color }}
            onClick={() => {
              onChange(color);
            }}
            className={classes.colorPreset}
          ></button>
        ))}
      </div>
    </div>
  );
};
