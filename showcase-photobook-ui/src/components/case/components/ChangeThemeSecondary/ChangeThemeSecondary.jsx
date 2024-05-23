import { hexToRgba } from '../../lib/ColorUtilities';
import { useEngine } from '../../lib/EngineContext';
import { useSinglePageMode } from '../../lib/SinglePageModeContext';
import ThemeBar from '../ThemeBar/ThemeBar';

const ChangeThemeSecondary = () => {
  const { engine } = useEngine();
  const { currentPageBlockId } = useSinglePageMode();

  const changeTheme = async (asset) => {
    const findByNameOnCurrentPage = (name) =>
      engine.block
        .findByName(name)
        .find((block) => engine.block.getParent(block) === currentPageBlockId);
    engine.block.setColor(
      currentPageBlockId,
      'fill/solid/color',
      hexToRgba(asset.defaultBGColor)
    );
    const typefaceAssetQuery = await engine.asset.findAssets(
      'ly.img.typeface',
      {
        page: 0,
        perPage: 1,
        query: asset.defaultTypeface
      }
    );
    if (typefaceAssetQuery.assets.length > 0) {
      const typeface = typefaceAssetQuery.assets[0].payload.typeface;
      const font =
        typeface.fonts.find(
          (font) => font.weight === 'normal' && font.style === 'normal'
        ) ?? typeface.fonts[0];
      engine.block
        .findByType('text')
        .filter((block) => engine.block.getParent(block) === currentPageBlockId)
        .forEach((block) => engine.block.setFont(block, font.uri, typeface));
    }

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
