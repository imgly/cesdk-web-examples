import classes from './Modal.module.css';

export default function Modal({ open, children, maxWidth, maxHeight, title }) {
  return open !== undefined && open ? (
    <div className={classes.background}>
      <div className={classes.modal} style={{ maxWidth, maxHeight }}>
        {title ? <div className={classes.title}>{title}</div> : null}
        {children}
      </div>
    </div>
  ) : null;
}
