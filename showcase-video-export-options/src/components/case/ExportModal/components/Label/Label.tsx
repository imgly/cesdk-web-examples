import classNames from 'classnames';

import InfoIcon from '../../icons/Info.svg';

import StyledPopover from '@/components/ui/StyledPopover/StyledPopover';
import classes from './Label.module.css';

interface Props {
  label: string;
  infoText?: string;
  className?: string;
  children: React.ReactNode;
}

export const Label = ({ label, infoText, className, children }: Props) => {
  return (
    <label className={classNames(classes.root, className)}>
      <div className={classes.labelWrapper}>
        <span className={classes.label}>{label}</span>
        {infoText && (
          <StyledPopover content={<span>{infoText}</span>}>
            <span>
              <InfoIcon className={classes.icon} />
            </span>
          </StyledPopover>
        )}
      </div>
      {children}
    </label>
  );
};
