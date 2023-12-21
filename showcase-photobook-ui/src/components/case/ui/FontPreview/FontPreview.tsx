import { useEngine } from '../../lib/EngineContext';
import classes from './FontPreview.module.css';

interface FontPreviewProps {
  font: {
    fontFamily: string;
    fontWeight: string;
    fontPath: string;
  };
  text?: string;
  fontSize?: string;
}

const FontPreview = ({ font, text, fontSize = '18px' }: FontPreviewProps) => {
  const { engine } = useEngine();
  return (
    <>
      <style>{`
        @font-face {
          src: url('${engine.editor.defaultURIResolver(font.fontPath)}');
          font-family: '${font.fontFamily}';
          font-weight: ${font.fontWeight};
        }
      `}</style>
      <span
        className={classes.text}
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
