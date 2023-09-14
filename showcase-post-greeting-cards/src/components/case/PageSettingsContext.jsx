import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useEditor } from './EditorContext';

import { hexToRgb, normalizeColors } from './lib/CreativeEngineUtils';

const PageSettingsContext = createContext();

export const PageSettingsProvider = ({ children }) => {
  const { creativeEngine, postcardTemplate, sceneIsLoaded } = useEditor();

  const [frontBackgroundColor, setFrontBackgroundColor] = useState(null);
  const [frontAccentColor, setFrontAccentColor] = useState(null);
  const [backGreetingsTextFont, setBackGreetingsTextFont] = useState(
    'extensions/ly.img.cesdk.fonts/fonts/Caveat/Caveat-Regular.ttf'
  );
  const [backGreetingsTextColor, setBackGreetingsTextColor] = useState(
    normalizeColors(hexToRgb('#263BAA'))
  );
  const [backGreetingsTextSize, setBackGreetingsTextSize] = useState(22);

  const setColorByBlockName = useCallback(
    (blockName, color) => {
      if (!sceneIsLoaded || !color) {
        return;
      }
      const { r, g, b } = color;
      creativeEngine.block.findByName(blockName).forEach((blockId) => {
        if (creativeEngine.block.hasStroke(blockId)) {
          creativeEngine.block.setStrokeColor(blockId, {r, g, b, a: 1.0});
        }
        creativeEngine.block.setColorRGBA(
          blockId,
          'fill/solid/color',
          r,
          g,
          b,
          1.0
        );
      });
      creativeEngine.editor.addUndoStep();
    },
    [creativeEngine, sceneIsLoaded]
  );

  const setTextSizeByBlockName = useCallback(
    (blockName, size) => {
      if (!sceneIsLoaded || !size) {
        return;
      }
      creativeEngine.block.findByName(blockName).forEach((blockId) => {
        creativeEngine.block.setFloat(blockId, 'text/fontSize', size);
      });
      creativeEngine.editor.addUndoStep();
    },
    [sceneIsLoaded, creativeEngine]
  );

  const setTextFontByBlockName = useCallback(
    (blockName, fontFileUri) => {
      if (!sceneIsLoaded || !fontFileUri) {
        return;
      }
      creativeEngine.block.findByName(blockName).forEach((blockId) => {
        creativeEngine.block.setString(
          blockId,
          'text/fontFileUri',
          fontFileUri
        );
      });
      creativeEngine.editor.addUndoStep();
    },
    [sceneIsLoaded, creativeEngine]
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
      setFrontAccentColor(
        normalizeColors(hexToRgb(postcardTemplate.colors[0]))
      );
      setFrontBackgroundColor(
        normalizeColors(hexToRgb(postcardTemplate.colors[1]))
      );
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
