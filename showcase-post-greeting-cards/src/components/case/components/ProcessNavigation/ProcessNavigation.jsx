import classNames from 'classnames';
import React, { Fragment } from 'react';
import { useEditor } from '../../EditorContext';
import { ReactComponent as ChevronRightIcon } from '../../icons/ChevronRight.svg';
import { ReactComponent as DesignIcon } from '../../icons/Design.svg';
import { ReactComponent as StyleIcon } from '../../icons/Style.svg';
import { ReactComponent as WriteIcon } from '../../icons/Write.svg';

import classes from './ProcessNavigation.module.css';

const STEPS = [
  {
    id: 'Style',
    label: 'Style',
    Icon: <StyleIcon />
  },
  {
    id: 'Design',
    label: 'Design',
    Icon: <DesignIcon />
  },
  {
    id: 'Write',
    label: 'Write',
    Icon: <WriteIcon />
  }
];

const ProcessNavigation = ({ disabled }) => {
  const { currentStep, setCurrentStep, postcardTemplate } = useEditor();
  return (
    <nav className={classes.wrapper}>
      {STEPS.map(({ id, label, Icon }, index) => (
        <Fragment key={id}>
          <button
            className={classNames(classes.button, {
              [classes['button--active']]: id === currentStep
            })}
            disabled={disabled || (index >= 1 && !postcardTemplate)}
            onClick={() => setCurrentStep(id)}
          >
            {Icon} <span className={classes.buttonText}>{label}</span>
          </button>
          {index < STEPS.length - 1 && <ChevronRightIcon />}
        </Fragment>
      ))}
    </nav>
  );
};
export default ProcessNavigation;
