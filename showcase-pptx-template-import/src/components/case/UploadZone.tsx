import classNames from 'classnames';
import { useState } from 'react';
import UploadIcon from './icons/Upload.svg';
import classes from './UploadZone.module.css';

interface UploadZoneProps {
  onUpload: (file: File) => void;
  accept?: string[];
  filetypeNotice?: string;
  children: React.ReactNode;
}

function UploadZone({
  children,
  onUpload,
  accept = ['.png', '.jpg', '.jpeg'],
  filetypeNotice = 'PNG or JPEG'
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <label
      htmlFor="file-input"
      className={classNames(classes.preview, classes.uploadControls, {
        [classes.dragging]: isDragging
      })}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        let draggedData = e.dataTransfer;
        // @ts-ignore
        let [file] = draggedData.files;
        if (!file) return;
        const fileExtension = file.name.split('.').pop();
        if (!fileExtension) return;
        if (!accept.includes(`.${fileExtension}`)) return;

        onUpload(file);
      }}
    >
      <UploadIcon />
      <span className="button button--primary">{children}</span>
      <input
        className={classes.hidden}
        type="file"
        id="file-input"
        onChange={(event) => {
          const files = event.target.files;
          if (!files || files.length === 0) return;
          // @ts-ignore
          const [file] = files;
          if (!file) return;

          onUpload(file);
        }}
        accept={accept.join(',')}
      />
      <small className={classes.filetypeNotice}>{filetypeNotice}</small>
    </label>
  );
}

export default UploadZone;
