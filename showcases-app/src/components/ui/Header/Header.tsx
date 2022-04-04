import classNames from 'classnames';
import { EXTERNAL_PATHS } from 'lib/paths';
import classes from './Header.module.css';
import { ReactComponent as Logo } from './logo.svg';

export const Header = () => (
  <header
    className={classNames('flex items-center justify-between', classes.wrapper)}
  >
    <a href={EXTERNAL_PATHS.logoLink} target="_blank" rel="noreferrer">
      <Logo />
    </a>
    <h1 className={classNames(classes.tagline, 'h5')}>CE.SDK Demo</h1>
  </header>
);
