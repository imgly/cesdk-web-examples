import { RGBAColor, Typeface } from '@cesdk/engine';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useEditor } from './EditorContext';
import { hexToRgba } from './lib/ColorUtilities';
import { useEngine } from './lib/EngineContext';

interface PageSettingsContextType {
  frontBackgroundColor: RGBAColor;
  setFrontBackgroundColor: (color: RGBAColor) => void;
  frontAccentColor: RGBAColor;
  setFrontAccentColor: (color: RGBAColor) => void;

  backGreetingsTextTypeface: Typeface | null;
  setBackGreetingsTextTypeface: (typeface: Typeface) => void;
  backGreetingsTextColor: RGBAColor;
  setBackGreetingsTextColor: (color: RGBAColor) => void;
  backGreetingsTextSize: number;
  setBackGreetingsTextSize: (size: number) => void;
}

const PageSettingsContext = createContext<PageSettingsContextType | undefined>(
  undefined
);

const DEFAULT_COLOR = {
  r: 0,
  g: 0,
  b: 0,
  a: 1
};

export const PageSettingsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { engine } = useEngine();
  const { postcardTemplate, sceneIsLoaded } = useEditor();

  const [frontBackgroundColor, setFrontBackgroundColor] =
    useState<RGBAColor>(DEFAULT_COLOR);
  const [frontAccentColor, setFrontAccentColor] =
    useState<RGBAColor>(DEFAULT_COLOR);
  const [backGreetingsTextTypeface, setBackGreetingsTextTypeface] =
    useState<Typeface | null>(null);

  const [backGreetingsTextColor, setBackGreetingsTextColor] =
    useState<RGBAColor>(hexToRgba('#263BAA'));
  const [backGreetingsTextSize, setBackGreetingsTextSize] =
    useState<number>(22);

  useEffect(() => {
    if (!engine || !sceneIsLoaded) {
      return;
    }
    const [block] = engine.block.findByName('Greeting');
    if (!block) {
      return;
    }
    setBackGreetingsTextTypeface(engine.block.getTypeface(block));
  }, [engine, sceneIsLoaded]);

  const setColorByBlockName = useCallback(
    (blockName: string, color: RGBAColor | null) => {
      if (!sceneIsLoaded || !color) {
        return;
      }
      const { r, g, b } = color;
      engine.block.findByName(blockName).forEach((blockId) => {
        if (engine.block.hasStroke(blockId)) {
          engine.block.setStrokeColor(blockId, { r, g, b, a: 1.0 });
        }
        engine.block.setColor(blockId, 'fill/solid/color', { r, g, b, a: 1.0 });
      });
      engine.editor.addUndoStep();
    },
    [engine, sceneIsLoaded]
  );

  const setTextSizeByBlockName = useCallback(
    (blockName: string, size: number | null) => {
      if (!sceneIsLoaded || !size) {
        return;
      }
      engine.block.findByName(blockName).forEach((blockId) => {
        engine.block.setFloat(blockId, 'text/fontSize', size);
      });
      engine.editor.addUndoStep();
    },
    [sceneIsLoaded, engine]
  );

  const setTextFontByBlockName = useCallback(
    (blockName: string, typeface: Typeface | null) => {
      if (!sceneIsLoaded || !typeface) {
        return;
      }
      const font =
        typeface.fonts.find(
          (font) => font.style === 'normal' && font.weight === 'normal'
        ) ?? typeface.fonts[0];
      engine.editor.setEditMode('Transform');
      engine.block.findByName(blockName).forEach((blockId) => {
        engine.block.setFont(blockId, font.uri, typeface);
      });
      engine.editor.addUndoStep();
    },
    [sceneIsLoaded, engine]
  );

  useEffect(
    () => setColorByBlockName('Accent', frontAccentColor),
    [setColorByBlockName, frontAccentColor]
  );
  useEffect(
    () => setColorByBlockName('Background', frontBackgroundColor),
    [setColorByBlockName, frontBackgroundColor]
  );

  useEffect(
    () => setTextFontByBlockName('Greeting', backGreetingsTextTypeface),
    [setTextFontByBlockName, backGreetingsTextTypeface]
  );
  useEffect(
    () => setColorByBlockName('Greeting', backGreetingsTextColor),
    [setColorByBlockName, backGreetingsTextColor]
  );
  useEffect(
    () => setTextSizeByBlockName('Greeting', backGreetingsTextSize),
    [setTextSizeByBlockName, backGreetingsTextSize]
  );

  useEffect(() => {
    if (postcardTemplate) {
      setFrontAccentColor(hexToRgba(postcardTemplate.colors[0]));
      setFrontBackgroundColor(hexToRgba(postcardTemplate.colors[1]));
    }
  }, [postcardTemplate]);

  const value = {
    frontBackgroundColor,
    setFrontBackgroundColor,
    frontAccentColor,
    setFrontAccentColor,

    backGreetingsTextTypeface,
    setBackGreetingsTextTypeface,
    backGreetingsTextColor,
    setBackGreetingsTextColor,
    backGreetingsTextSize,
    setBackGreetingsTextSize
  };
  return (
    <PageSettingsContext.Provider value={value}>
      {children}
    </PageSettingsContext.Provider>
  );
};

export const usePageSettings = () => {
  const context = useContext(PageSettingsContext);
  if (context === undefined) {
    throw new Error(
      'usePageSettings must be used within a PageSettingsProvider'
    );
  }
  return context;
};
