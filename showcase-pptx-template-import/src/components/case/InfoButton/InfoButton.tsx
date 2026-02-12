import StyledPopover from '@/components/ui/StyledPopover/StyledPopover';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import ErrorIcon from './Error.svg';
import classes from './InfoButton.module.css';
import WarningIcon from './Warning.svg';

interface Props {
  messages: string[];
  type: 'error' | 'warning';
}

const TYPE = {
  error: {
    icon: <ErrorIcon />,
    className: classes.error,
    label: 'Error'
  },
  warning: {
    icon: <WarningIcon />,
    className: classes.warning,
    label: 'Warning'
  }
};

export const InfoButton: React.FC<Props> = ({ messages, type }) => {
  const { icon, label, className } = TYPE[type];

  // group messages by message string
  const groupedMessages = useMemo(
    () =>
      messages.reduce((acc, message) => {
        const count = acc.get(message) || 0;
        acc.set(message, count + 1);
        return acc;
      }, new Map<string, number>()),
    [messages]
  );
  const messagesArray = useMemo(
    () => Array.from(groupedMessages.entries()),
    [groupedMessages]
  );

  if (messages.length === 0) return null;

  return (
    <StyledPopover
      size="lg"
      content={
        <ul className={classes.messages}>
          {messagesArray.map(([message, count], i) => (
            <li key={i}>
              {message} ({count} {count > 1 ? 'occurrences' : 'occurrence'})
            </li>
          ))}
        </ul>
      }
    >
      <button className={classNames(classes.button, className)}>
        <span>{icon}</span>
        {messages.length + ' '}
        {label}
        {messages.length > 1 ? 's' : ''}
      </button>
    </StyledPopover>
  );
};
