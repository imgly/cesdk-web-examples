import {
  hexToRgb,
  normalizeColors,
  replaceImage
} from '../../lib/CreativeEngineUtils';
import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import ThemeBar from '../ThemeBar/ThemeBar';

const ChangeThemeSecondary = () => {
  const { engine } = useEngine();
  const { currentPageBlockId } = useSinglePageMode();

  const changeTheme = (asset) => {
    const findByNameOnCurrentPage = (name) =>
      engine.block
        .findByName(name)
        .find((block) => engine.block.getParent(block) === currentPageBlockId);
    const { r, g, b } = normalizeColors(hexToRgb(asset.defaultBGColor));
    engine.block.setColorRGBA(
      currentPageBlockId,
      'fill/solid/color',
      r,
      g,
      b,
      1
    );
    engine.block
      .findByType('text')
      .filter((block) => engine.block.getParent(block) === currentPageBlockId)
      .forEach((block) =>
        engine.block.setString(
          block,
          'text/fontFileUri',
          asset.defaultFontFileUri
        )
      );

    replaceImage(engine, findByNameOnCurrentPage('BG Dark'), asset.dark);
    replaceImage(engine, findByNameOnCurrentPage('BG Light'), asset.light);
  };

  return <ThemeBar onClick={(asset) => changeTheme(asset)} />;
};
export default ChangeThemeSecondary;
