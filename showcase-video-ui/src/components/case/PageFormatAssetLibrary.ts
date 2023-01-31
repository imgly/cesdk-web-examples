import CreativeEditorSDK, {
  API,
  AssetResult,
  AssetSource,
  DesignBlockType
} from '@cesdk/cesdk-js';
import { applyQuerySearch, paginateAssetResult } from './AssetSourceUtilities';
import { caseAssetPath } from './util';

interface PageFormat {
  label: string;
  width: number;
  thumbUri: string;
  height: number;
  unit: string;
}

const resizePage = (
  engine: API,
  pageId: number,
  size: { width: number; height: number }
) => {
  const currentPageWidth = engine.block.getWidth(pageId);
  const currentPageHeight = engine.block.getHeight(pageId);

  const scale = Math.min(
    size.width / currentPageWidth,
    size.height / currentPageHeight
  );

  const scaledWidth = currentPageWidth * scale;
  const scaledHeight = currentPageHeight * scale;

  const offsetX = 0.5 * (size.width - scaledWidth);
  const offsetY = 0.5 * (size.height - scaledHeight);

  engine.block.scale(pageId, scale, 0.5, 0.5);
  const children = engine.block.getChildren(pageId);
  children.forEach((child) => {
    const x = engine.block.getPositionX(child);
    const y = engine.block.getPositionY(child);
    engine.block.setPositionX(child, x + offsetX);
    engine.block.setPositionY(child, y + offsetY);
  });

  engine.block.setWidth(pageId, size.width);
  engine.block.setHeight(pageId, size.height);
};

export function createPageFormatAssetSource(
  cesdkRef: React.MutableRefObject<CreativeEditorSDK>,
  pageFormats: Record<string, PageFormat>
) {
  const i18nEntries = Object.fromEntries([
    ['libraries.pageFormats.label', 'Formats'],
    ...Object.entries(pageFormats).map(([pageFormatKey, pageFormat]) => [
      `preset.document.${pageFormatKey}`,
      pageFormats[pageFormatKey].label
    ])
  ]);

  const presetEntries = pageFormats;
  const insertEntry = {
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
      'text-overflow': 'unset',
      'white-space': 'unset',
      'font-size': '10px',
      'line-height': '12px',
      'letter-spacing': '0.02em',
      'text-align': 'center',
      'pointer-events': 'none',
      pointer: 'default'
    }),
    cardStyle: () => ({
      height: '80px',
      width: '80px',
      'margin-bottom': '40px',
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

  const assetSource: AssetSource = {
    id: 'pageFormats',
    findAssets(queryData) {
      const assets = Object.keys(pageFormats).map((pageFormatKey) => {
        const pageFormat = pageFormats[pageFormatKey];

        return {
          id: pageFormatKey,
          size: {
            width: 80, // this is required for the correct card dimension styles
            height: 120 // this is required for the correct card dimension styles
          },
          label: pageFormat.label,
          thumbUri: caseAssetPath('/page-formats/' + pageFormat.thumbUri),
          meta: {
            height: pageFormat.height,
            width: pageFormat.width
          },
          context: {
            sourceId: 'pageFormats'
          }
        };
      });
      const filteredAssets = applyQuerySearch(assets, queryData?.query);

      return Promise.resolve(paginateAssetResult(filteredAssets, queryData));
    },

    /**
     * Takes the page size, applies it to all pages and scales the content.
     */
    async applyAsset({ meta, id }) {
      const cesdk = cesdkRef.current;
      const engine = cesdk.engine;
      const pageIds = engine.block.findByType(DesignBlockType.Page);
      const height = parseInt(meta!['height'] as string);
      const width = parseInt(meta!['width'] as string);
      pageIds.forEach((pageId) =>
        resizePage(engine, pageId, {
          height: height,
          width: width
        })
      );
      const scene = engine.scene.get()!;
      engine.block.setString(scene, 'scene/pageFormatId', id);
      // We currently need to update pageDimensions manually.
      engine.block.setFloat(scene, 'scene/pageDimensions/height', height);
      engine.block.setFloat(scene, 'scene/pageDimensions/width', width);

      cesdk.unstable_focusPage(pageIds[0]);
    }
  };

  return {
    assetSource,
    i18nEntries,
    presetEntries,
    insertEntry
  };
}
