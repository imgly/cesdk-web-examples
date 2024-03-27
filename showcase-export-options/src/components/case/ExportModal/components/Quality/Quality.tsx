import classNames from 'classnames';

import InfoIcon from '../../icons/Info.svg';
import { QualityType } from '../../types';
import { Select } from '../Select/Select';

import StyledPopover from '@/components/ui/StyledPopover/StyledPopover';
import classes from './Quality.module.css';

const QualityItems = [
  {
    label: 'Low',
    value: QualityType.Low
  },
  {
    label: 'Medium',
    value: QualityType.Medium
  },
  {
    label: 'High',
    value: QualityType.High
  },
  {
    label: 'Very High',
    value: QualityType.VeryHigh
  },
  {
    label: 'Maximum',
    value: QualityType.Maximum
  }
];

interface Props {
  name: string;
  value: QualityType;
  onChange: (value: QualityType) => void;
  className?: string;
}

export const Quality = ({ name, value, onChange, className }: Props) => {
  return (
    <label className={classNames(classes.root, className)}>
      <div className={classes.labelWrapper}>
        <span className={classes.label}>Quality</span>
        <StyledPopover
          content={
            <span>
              Higher image quality results in longer export duration and larger
              file size.
            </span>
          }
        >
          <span>
            <InfoIcon className={classes.icon} />
          </span>
        </StyledPopover>
      </div>
      <Select<QualityType>
        name={name}
        value={value}
        options={QualityItems}
        onChange={onChange}
      />
    </label>
  );
};
