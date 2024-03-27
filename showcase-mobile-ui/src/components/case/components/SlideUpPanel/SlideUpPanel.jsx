import classNames from 'classnames';
import { createContext, useContext, useEffect, useRef } from 'react';
import { useEditor } from '../../EditorContext';
import CaretDownIcon from '../../icons/CaretDown.svg';
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
  const containerRef = useRef();
  const { engine, setZoomPaddingBottom } = useEditor();
  useEffect(() => {
    const containerNode = containerRef.current;
    const defaultZoomPaddingBottom = 8;

    var ro = new ResizeObserver(() => {
      const containerBB = containerNode.getBoundingClientRect();
      const canvasBB = engine.element.getBoundingClientRect();
      const paddingNeeded = canvasBB.height - (containerBB.top - canvasBB.top);
      if (isExpanded) {
        setZoomPaddingBottom(paddingNeeded + defaultZoomPaddingBottom);
      } else {
        setZoomPaddingBottom(defaultZoomPaddingBottom);
      }
    });

    ro.observe(containerNode);

    return () => {
      ro.unobserve(containerNode);
      setZoomPaddingBottom(defaultZoomPaddingBottom);
    };
  }, [isExpanded, engine.element, setZoomPaddingBottom]);

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
        ref={containerRef}
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
