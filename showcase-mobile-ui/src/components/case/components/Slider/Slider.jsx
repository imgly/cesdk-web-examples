import classes from './Slider.module.css';
import classNames from 'classnames';

// This specific import path is needed for Codesandbox to avoid th following error:
// ModuleNotFoundError
// Could not find module in path: 'react-slider/dist/cjs/dev/node_modules/@babel/runtime/helpers/esm/extends.js' relative to '/node_modules/react-slider/dist/cjs/dev/components/ReactSlider/ReactSlider.js
// This is a Codesandbox Bug and can be shortend in a normal development environment
import ReactSlider from 'react-slider/dist/es/prod/index.js';

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
