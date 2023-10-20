import { AssetDefinition, AssetResult, Configuration } from '@cesdk/cesdk-js';
import { ContentJSON } from './loadAssetSourceFromContentJSON';
import { caseAssetPath } from './util';

export const pageFormatI18n = (formats: PageFormatAsset[]) => {
  return Object.fromEntries([
    ['libraries.pageFormats.label', 'Formats'],
    ...formats.map((format) => [`preset.document.${format.id}`, format.label])
  ]);
};

export const PAGE_FORMATS_INSERT_ENTRY = {
  id: 'pageFormats',
  sourceIds: ['pageFormats'],

  previewLength: 3,
  gridColumns: 3,
  gridItemHeight: 'auto',

  previewBackgroundType: 'contain',
  gridBackgroundType: 'cover',
  cardLabel: (assetResult: AssetResult) => assetResult.label,
  cardLabelStyle: () => ({
    height: '24px',
    width: '72px',
    left: '4px',
    right: '4px',
    bottom: '-32px',
    padding: '0',
    background: 'transparent',
    overflow: 'hidden',
    textOverflow: 'unset',
    whiteSpace: 'unset',
    fontSize: '10px',
    lineHeight: '12px',
    letterSpacing: '0.02em',
    textAlign: 'center',
    pointerEvents: 'none',
    pointer: 'default'
  }),
  cardStyle: () => ({
    height: '80px',
    width: '80px',
    marginBottom: '40px',
    overflow: 'visible'
  }),
  icon: () => caseAssetPath('/page-sizes-large-icon.svg'),
  title: ({ group }: { group: string }) => {
    if (group) {
      return `libraries.pageSizes.${group}.label`;
    }
    return undefined;
  }
};

export const formatAssetsToPresets = (
  contentJSON: ContentJSON
): PageFormatsDefinition => {
  const formatPresets = Object.entries(contentJSON.assets).map(
    ([_key, asset]) => {
      const { id } = asset;
      const { width, height, unit } = (asset as PageFormatAsset).meta;

      const pageFormat: PageFormatsDefinition[string] = {
        width,
        height,
        unit,
        meta: { default: !!asset.meta!.default }
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
    unit: 'px' | 'mm' | 'in';
    thumbUri: string;
  };
}
type PageFormatsDefinition = NonNullable<
  NonNullable<Configuration['presets']>['pageFormats']
>;
