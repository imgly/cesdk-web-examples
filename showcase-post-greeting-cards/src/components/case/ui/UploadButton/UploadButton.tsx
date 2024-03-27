import { CompleteAssetResult } from '@cesdk/engine';
import classNames from 'classnames';
import UploadIcon from '../../icons/Upload.svg';
import { useImageUpload } from '../../lib/UseImageUpload';
import classes from './UploadButton.module.css';

interface UploadButtonProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isActive?: boolean;
  iconColor?: string;
  onUpload: (asset: CompleteAssetResult) => Promise<void>;
}

const UploadButton = ({ iconColor, onUpload, ...rest }: UploadButtonProps) => {
  const { triggerFileUpload } = useImageUpload({
    onUpload
  });
  return (
    <button
      className={classNames(classes.button)}
      onClick={async () => {
        triggerFileUpload();
      }}
      {...rest}
    >
      <span className={classes.iconWrapper} style={{ color: iconColor }}>
        <UploadIcon />
      </span>
      <span className={classes.label}>Upload</span>
    </button>
  );
};
export default UploadButton;
