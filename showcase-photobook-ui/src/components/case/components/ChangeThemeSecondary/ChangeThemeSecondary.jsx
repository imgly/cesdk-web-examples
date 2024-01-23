import { hexToRgba } from '../../lib/ColorUtilities';
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
    engine.block.setColor(
      currentPageBlockId,
      'fill/solid/color',
      hexToRgba(asset.defaultBGColor)
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

    const bgDarkBlock = findByNameOnCurrentPage('BG Dark');
    const bgDarkBlockFill = engine.block.getFill(bgDarkBlock);
    engine.block.setString(
      bgDarkBlockFill,
      'fill/image/imageFileURI',
      asset.dark
    );
    const bgLightBlock = findByNameOnCurrentPage('BG Light');
    const bgLightBlockFill = engine.block.getFill(bgLightBlock);
    engine.block.setString(
      bgLightBlockFill,
      'fill/image/imageFileURI',
      asset.light
    );
    engine.editor.addUndoStep();
  };

  return <ThemeBar onClick={(asset) => changeTheme(asset)} />;
};
export default ChangeThemeSecondary;
