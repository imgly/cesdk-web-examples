import { useState } from 'react';
import classes from './CaseComponent.module.css';
import CreativeEditor from './CreativeEditor';
import ImageMatting from './ImageMatting';
import { ImageMattingContextProvider } from './ImageMattingContext';

const CaseComponent = () => {
  const [isEditorOpen, setEditorOpen] = useState(false);

  return (
    <ImageMattingContextProvider>
      <div className={classes.wrapper}>
        {!isEditorOpen && (
          <ImageMatting
            openEditor={() => {
              setEditorOpen(true);
            }}
          />
        )}
        {isEditorOpen && (
          <CreativeEditor
            closeEditor={() => {
              setEditorOpen(false);
            }}
          />
        )}
      </div>
    </ImageMattingContextProvider>
  );
};
export default CaseComponent;
