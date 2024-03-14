'use client';

import { useState } from 'react';
import classes from './CaseComponent.module.css';

import ImageSelection from './components/ImageSelection/ImageSelection';
import PhotoUI from './components/PhotoUI/PhotoUI';
import UnsavedChangesModal from './components/UnsavedChangesModal/UnsavedChangesModal';
import { CANVAS_COLOR, EditorProvider } from './EditorContext';

const CaseComponent = () => {
  const [confirmModalImage, setConfirmModalImage] = useState();
  const { r, g, b } = CANVAS_COLOR;

  return (
    <EditorProvider>
      <div className={classes.fullHeightWrapper} id="scroll-container">
        <div className={classes.caseWrapper}>
          <div className={classes.headerBar}>
            <ImageSelection
              images={['woman', 'mountains', 'dog']}
              onShowModal={(imageUrl) => setConfirmModalImage(imageUrl)}
            />
          </div>
          <div className={classes.wrapper}>
            <div
              className={classes.kioskWrapper}
              style={{ backgroundColor: `rgb(${r},${g},${b})` }}
            >
              {confirmModalImage && (
                <UnsavedChangesModal
                  imageUrl={confirmModalImage}
                  onClose={() => setConfirmModalImage()}
                />
              )}
              <PhotoUI />
            </div>
          </div>
        </div>
      </div>
    </EditorProvider>
  );
};

export default CaseComponent;
