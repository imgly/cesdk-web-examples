import classNames from 'classnames';
import { ReactComponent as RedoIcon } from '../../icons/Redo.svg';
import { ReactComponent as UndoIcon } from '../../icons/Undo.svg';
import { useEngine } from '../../lib/EngineContext';
import { useHistory } from '../../lib/UseHistory';
import classes from './UndoRedoButtons.module.css';

const UndoRedoButtons = () => {
  const { engine } = useEngine();
  const { canRedo, canUndo } = useHistory({ engine });

  return (
    <div className={classes.container}>
      <button
        onClick={() => engine.editor.undo()}
        className={classNames(classes.button, {
          [classes['button--disabled']]: !canUndo
        })}
        disabled={!canUndo}
      >
        <UndoIcon />
      </button>
      <button
        onClick={() => engine.editor.redo()}
        className={classNames(classes.button, {
          [classes['button--disabled']]: !canRedo
        })}
        disabled={!canRedo}
      >
        <RedoIcon />
      </button>
    </div>
  );
};
export default UndoRedoButtons;
