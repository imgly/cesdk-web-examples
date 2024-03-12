import { AssetDefinition, AssetResult, CreativeEngine } from '@cesdk/cesdk-js';

async function loadAssetSourceFromContentJSON(
  engine: CreativeEngine,
  content: ContentJSON,
  baseURL = '',
  applyAsset?: ((asset: AssetResult) => Promise<number | undefined>) | undefined
) {
  const { assets, id: sourceId } = content;

  engine.asset.addLocalSource(sourceId, undefined, applyAsset);
  assets.forEach((asset) => {
    if (asset.meta) {
      Object.entries(asset.meta).forEach(([key, value]: [any, any]) => {
        const stringValue: string = value.toString();
        if (stringValue.includes('{{base_url}}')) {
          const updated = stringValue.replace('{{base_url}}', baseURL);
          if (asset.meta) {
            asset.meta[key] = updated;
          }
        }
      });
    }

    if (asset.payload?.sourceSet) {
      asset.payload.sourceSet.forEach((sourceSet) => {
        sourceSet.uri = sourceSet.uri.replace('{{base_url}}', baseURL);
      });
    }

    engine.asset.addAssetToSource(sourceId, asset);
  });
}
export type ContentJSON = {
  version: string;
  id: string;
  assets: AssetDefinition[];
};

export default loadAssetSourceFromContentJSON;
