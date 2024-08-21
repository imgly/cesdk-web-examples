import classes from './Slider.module.css';
import classNames from 'classnames';

import ReactSlider from 'react-slider';

const Slider = (props) => {
  return (
    <ReactSlider
      className={classes.slider}
      thumbClassName={classes.thumb}
      trackClassName={classes.track}
      renderThumb={(props, state) => (
        <div {...props}>
          <span className={classes.innerThumb} />
        </div>
      )}
      renderTrack={(props, state) => (
        <div
          {...props}
          className={classNames(
            props.className,
            classes[`track--part-${state.index}`]
          )}
        />
      )}
      {...props}
    />
  );
};
export default Slider;
