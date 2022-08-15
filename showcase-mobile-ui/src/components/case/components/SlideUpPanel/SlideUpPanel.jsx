import classNames from 'classnames';
import { createContext, useContext } from 'react';
import { ReactComponent as CaretDownIcon } from '../../icons/CaretDown.svg';
import IconButton from '../IconButton/IconButton';
import classes from './SlideUpPanel.module.css';

const SlideUpContext = createContext();

export const useSlideUp = () => {
  const context = useContext(SlideUpContext);
  if (context === undefined) {
    throw new Error('useSlideUp must be used within a SlideUpProvider');
  }
  return context;
};

const SlideUpPanel = ({
  children,
  isExpanded,
  onExpandedChanged,
  defaultHeadline,
  InspectorBar = null
}) => {
  return (
    <SlideUpContext.Provider
      value={{
        isExpanded,
        defaultHeadline,
        setIsExpanded: (value) => {
          onExpandedChanged && onExpandedChanged(value);
        }
      }}
    >
      <div
        id="slideUpPanel"
        className={classNames(classes.wrapper, {
          [classes['wrapper--expanded']]: isExpanded
        })}
      >
        {InspectorBar && (
          <div className={classes.inspectorBar}>{InspectorBar}</div>
        )}
        {!isExpanded && <SlideUpPanelHeader headline={defaultHeadline} />}
        {children}
      </div>
    </SlideUpContext.Provider>
  );
};

const SlideUpPanelBody = ({ children }) => {
  const { isExpanded } = useSlideUp();
  return (
    <div
      className={classNames(classes.body, {
        [classes['body--visible']]: isExpanded
      })}
    >
      {children}
    </div>
  );
};

const SlideUpPanelHeader = ({
  children,
  headline,
  closeComponent = <CaretDownIcon />
}) => {
  const { setIsExpanded, isExpanded, defaultHeadline } = useSlideUp();
  return (
    <div className={classes.header}>
      <div>{children}</div>
      <span className={classes.headline}>{headline ?? defaultHeadline}</span>
      <div>
        {isExpanded && (
          <IconButton
            icon={closeComponent}
            onClick={() => setIsExpanded(false)}
            size="sm"
          ></IconButton>
        )}
      </div>
    </div>
  );
};

export { SlideUpPanelBody, SlideUpPanelHeader };

export default SlideUpPanel;
