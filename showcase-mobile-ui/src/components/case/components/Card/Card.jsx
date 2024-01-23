import classNames from 'classnames';
import classes from './Card.module.css';

function Card({
  children,
  className,
  backgroundImage,
  ariaLabel,
  hasPadding = true,
  ...props
}) {
  return (
    <button
      type="button"
      className={classNames(classes.card, className, {
        [classes.hasPadding]: hasPadding
      })}
      {...props}
    >
      {backgroundImage && (
        <img className={classes.image} src={backgroundImage} alt={ariaLabel} />
      )}
      {children}
    </button>
  );
}

export default Card;
