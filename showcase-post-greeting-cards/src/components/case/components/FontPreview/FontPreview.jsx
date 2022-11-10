import { useEditor } from '../../EditorContext';
import classes from './FontPreview.module.css';

const FontPreview = ({ font, text, fontSize = '18px' }) => {
  const { creativeEngine } = useEditor();
  return (
    <>
      <style>{`
        @font-face {
          src: url('${creativeEngine.editor.defaultURIResolver(
            font.fontPath
          )}');
          font-family: '${font.fontFamily}';
          font-weight: ${font.fontWeight};
        }
      `}</style>
      <span
        className={classes.text}
        /* @ts-ignore */
        style={{
          fontSize,
          fontWeight: font.fontWeight,
          fontFamily: font.fontFamily
        }}
      >
        {text ?? font.fontFamily}
      </span>
    </>
  );
};
export default FontPreview;
