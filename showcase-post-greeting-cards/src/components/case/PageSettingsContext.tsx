import { RGBAColor } from '@cesdk/engine';
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

  backGreetingsTextFont: string;
  setBackGreetingsTextFont: (fontFileUri: string) => void;
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
  const [backGreetingsTextFont, setBackGreetingsTextFont] = useState<string>(
    'extensions/ly.img.cesdk.fonts/fonts/Caveat/Caveat-Regular.ttf'
  );
  const [backGreetingsTextColor, setBackGreetingsTextColor] =
    useState<RGBAColor>(hexToRgba('#263BAA'));
  const [backGreetingsTextSize, setBackGreetingsTextSize] =
    useState<number>(22);

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
    (blockName: string, fontFileUri: string | null) => {
      if (!sceneIsLoaded || !fontFileUri) {
        return;
      }
      engine.block.findByName(blockName).forEach((blockId) => {
        engine.block.setString(blockId, 'text/fontFileUri', fontFileUri);
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
    () => setTextFontByBlockName('Greeting', backGreetingsTextFont),
    [setTextFontByBlockName, backGreetingsTextFont]
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

    backGreetingsTextFont,
    setBackGreetingsTextFont,
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
