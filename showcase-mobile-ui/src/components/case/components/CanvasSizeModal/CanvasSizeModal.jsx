import { useEditor } from '../../EditorContext';
import { resizeCanvas } from '../../lib/CreativeEngineUtils';
import Modal from '../Modal/Modal';
import classes from './CanvasSizeModal.module.css';

const ALL_SIZES = [
  {
    name: 'IG Post',
    width: 1200,
    height: 1200
  },
  {
    name: 'IG Story',
    width: 1080,
    height: 1920
  },
  {
    name: 'Full HD',
    width: 1920,
    height: 1080
  },
  {
    name: '4K',
    width: 3140,
    height: 2160
  }
];

const CanvasSizeModal = ({ onClose }) => {
  const { creativeEngine, currentPageBlockId, refocus } = useEditor();
  return (
    <Modal title="Size" onClose={onClose}>
      <div className={classes.grid}>
        {ALL_SIZES.map(({ name, width, height }) => (
          <button
            key={name}
            className={classes.sizeWrapper}
            onClick={async () => {
              resizeCanvas(creativeEngine, currentPageBlockId, width, height);
              refocus();
              onClose();
            }}
          >
            <div
              className={classes.sizePreview}
              style={{
                aspectRatio: `${width} / ${height}`
              }}
            />
            <h4 className={classes.sizeTitle}>{name}</h4>
            <span className={classes.sizeDimensions}>
              {width}x{height}
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
};
export default CanvasSizeModal;
