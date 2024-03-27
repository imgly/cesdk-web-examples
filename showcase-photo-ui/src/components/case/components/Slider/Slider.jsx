import Draggable from 'react-draggable';
import { useState, useRef, useEffect, useMemo } from 'react';
import classes from './Slider.module.css';
import TickMarkSvg from './TickMarkSvg';

function getPositon(x, min, max) {
  const dist = max - min;
  const middle = min + dist / 2;
  const pos = x - middle;
  return pos;
}

export default function Slider({
  current,
  onChange,
  onStart,
  onStop,
  onDrag,
  formatCurrentValue,
  min = 0,
  max = 100,
  distanceBetweenMarkers = 10
}) {
  const [_current, setCurrent] = useState(current ?? (max - min) / 2);
  const controlled = current !== undefined;
  const nodeRef = useRef(null);
  useEffect(() => {
    if (controlled) {
      if (current > max) {
        setCurrent(max);
      } else if (current < min) {
        setCurrent(min);
      } else {
        setCurrent(current);
      }
    }
  }, [current, controlled, min, max]);
  // Position needs to be flipped and then multiplied by the distance between markers
  // because of the way react draggable works.
  const position = -getPositon(_current, min, max) * distanceBetweenMarkers;
  const numberText =
    Math.round(current) <= max
      ? Math.round(current) >= min
        ? Math.round(current)
        : `<${min}`
      : `>${max}`;

  const label = useMemo(
    () => formatCurrentValue?.(current) ?? numberText,
    [formatCurrentValue, current, numberText]
  );

  return (
    <button className={classes.sliderWrapper}>
      <div className={classes.label}>{label}</div>
      <Draggable
        nodeRef={nodeRef}
        axis="x"
        min={min}
        max={max}
        position={{ x: position, y: 0 }}
        grid={[distanceBetweenMarkers, 1]}
        bounds={{
          left: -(distanceBetweenMarkers / 2) * (max - min),
          right: (distanceBetweenMarkers / 2) * (max - min)
        }}
        onStart={(event) => {
          onStart?.(event);
        }}
        onDrag={(event, data) => {
          const newCurrent = -data.x / distanceBetweenMarkers + (max + min) / 2;
          const deltaCurrent = newCurrent - current;
          onDrag?.(event, deltaCurrent);
          setCurrent(newCurrent);
          onChange?.(newCurrent);
        }}
        onStop={(event) => {
          onStop?.(event, current);
          if (_current !== current && controlled) {
            setCurrent(current);
          }
        }}
      >
        <span ref={nodeRef}>
          <TickMarkSvg
            min={min}
            max={max}
            current={_current}
            deadzone={label.toString().length}
            distanceBetweenMarkers={distanceBetweenMarkers}
          />
        </span>
      </Draggable>
    </button>
  );
}
