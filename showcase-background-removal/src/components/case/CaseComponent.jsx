import { useState } from 'react';
import CreativeEditor from './CreativeEditor';
import ImageMatting from './ImageMatting';
import { ImageMattingContextProvider } from './utils/matting';

import classes from './CaseComponent.module.css';

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
