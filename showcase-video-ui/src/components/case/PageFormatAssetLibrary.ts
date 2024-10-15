import {
  AssetDefinition,
  AssetResult,
  Configuration,
  DesignUnit
} from '@cesdk/cesdk-js';
import { ContentJSON } from './lib/loadAssetSourceFromContentJSON';
import { caseAssetPath } from './util';

export const pageFormatI18n = (formats: PageFormatAsset[]) => {
  return Object.fromEntries([
    ['libraries.pageFormats.label', 'Formats'],
    ...formats.map((format) => [`document.${format.id}`, format.label])
  ]);
};

export const PAGE_FORMATS_INSERT_ENTRY_DOCK = {
  id: 'ly.img.assetLibrary.dock',
  key: 'pageFormats',
  label: 'libraries.pageFormats.label',
  icon: () => caseAssetPath('/page-sizes-large-icon.svg'),
  entries: ['pageFormats']
};

export const PAGE_FORMATS_INSERT_ENTRY_ASSET = {
  id: 'pageFormats',
  sourceIds: ['pageFormats'],
  previewLength: 3,
  previewBackgroundType: 'contain',
  gridBackgroundType: 'cover',
  gridColumns: 3,
  gridItemHeight: 'square',

  cardLabel: (assetResult: AssetResult) => assetResult.label,
  cardLabelPosition: () => 'below',
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
