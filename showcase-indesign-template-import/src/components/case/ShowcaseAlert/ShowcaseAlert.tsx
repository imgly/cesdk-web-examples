import AlertTriangle from './AlertTriangle.svg';
import classes from './ShowcaseAlert.module.css';

interface ShowcaseAlertProps {
  title: string;
  children: React.ReactNode;
}

export function ShowcaseAlert({ title, children }: ShowcaseAlertProps) {
  return (
    <div className={classes.wrapper}>
      <AlertTriangle className={classes.icon} />
      <div>
        <h4 className={classes.headline}>{title}</h4>
        <p className={classes.text}>{children}</p>
      </div>
    </div>
  );
}
