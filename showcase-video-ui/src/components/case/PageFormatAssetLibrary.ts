import { AssetDefinition, Configuration, DesignUnit } from '@cesdk/cesdk-js';
import { ContentJSON } from './lib/loadAssetSourceFromContentJSON';

export const pageFormatI18n = (formats: PageFormatAsset[]) => {
  return Object.fromEntries([
    ['libraries.pageFormats.label', 'Formats'],
    ...formats.map((format) => [`document.${format.id}`, format.label])
  ]);
};

export const formatAssetsToPresets = (
  contentJSON: ContentJSON
): PageFormatsDefinition => {
  const formatPresets = Object.entries(contentJSON.assets).map(
    ([_key, asset]) => {
      const { id } = asset;
      const { unit, formatWidth, formatHeight } = (asset as PageFormatAsset)
        .meta;

      const pageFormat: PageFormatsDefinition[string] = {
        width: formatWidth,
        height: formatHeight,
        unit,
        default: !!asset.meta!.default
      };
      return [id, pageFormat];
    }
  );
  return Object.fromEntries(formatPresets);
};

interface PageFormatAsset extends AssetDefinition {
  meta: {
    formatWidth: number;
    formatHeight: number;
    height: number;
    width: number;
    unit: DesignUnit;
    thumbUri: string;
  };
}
type PageFormatsDefinition = NonNullable<
  NonNullable<Configuration['ui']>['pageFormats']
>;
