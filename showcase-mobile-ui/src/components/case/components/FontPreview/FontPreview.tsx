import { FontStyle, FontWeight, Typeface } from '@cesdk/engine';
import classes from './FontPreview.module.css';

interface FontPreviewProps {
  typeface: Typeface;
  style?: FontStyle;
  weight?: FontWeight;
  text?: string;
  fontSize?: string;
}

const FontPreview = ({
  weight = 'normal',
  style = 'normal',
  text,
  typeface,
  fontSize = '18px'
}: FontPreviewProps) => {
  const font =
    typeface.fonts.find(
      (font) => font.weight === weight && font.style === style
    ) ?? typeface.fonts[0];
  return (
    <>
      <style>{`
        @font-face {
          src: url('${font.uri}');
          font-family: '${typeface.name}';
          font-weight: ${font.weight};
          font-style: ${font.style};
        }
      `}</style>
      <span
        className={classes.text}
        style={{
          fontSize,
          fontWeight: font.weight,
          fontFamily: typeface.name,
          fontStyle: font.style
        }}
      >
        {text ?? typeface.name}
      </span>
    </>
  );
};
export default FontPreview;
