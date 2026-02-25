import type CreativeEditorSDK from '@cesdk/cesdk-js';

export const getTemplateBaseURL = (): string | null => {
  alert(
    'Premium templates CDN URL is not configured. This showcase requires access to premium templates.'
  );
  console.error('Premium templates base URL is not available');
  return null;
};

export const persistSelectedTemplateToURL = (assetId: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set('template', assetId);
  window.history.pushState({}, '', url);
};

export async function addPremiumTemplatesAssetSource(
  cesdk: CreativeEditorSDK,
  persistURL = false
) {
  const baseURL = getTemplateBaseURL();
  // Fetch and prepare asset source with replaced base URLs
  if (!baseURL) {
    return;
  }
  const response = await fetch(`${baseURL}/dist/templates/content.json`);
  const assetSourceData = await response.json();

  // Replace {{base_url}} placeholders in the JSON
  const assetSourceString = JSON.stringify(assetSourceData);
  const replacedString = assetSourceString.replace(
    /\{\{base_url\}\}/g,
    `${baseURL}/dist`
  );
  const modifiedAssetSource = JSON.parse(replacedString);

  // Extract assets and create source without them
  const { assets, id } = modifiedAssetSource;

  const engine = cesdk.engine;

  // Check if the source already exists
  const existingSources = engine.asset.findAllSources();
  const sourceAlreadyExists = existingSources.includes(id);

  if (!sourceAlreadyExists) {
    // Add local source without assets
    engine.asset.addLocalSource(id, [], async (asset) => {
      if (!asset.meta?.uri) {
        return undefined;
      }
      await engine.scene.loadFromArchiveURL(asset.meta.uri);
      // Deselect any selected blocks
      engine.block.findAllSelected().forEach((selectedBlock) => {
        engine.block.setSelected(selectedBlock, false);
      });
      const firstPage = engine.scene.getPages()[0];
      await cesdk.actions.run('zoom.toBlock', firstPage, {
        autoFit: false,
        animate: false
      });
      if (persistURL) persistSelectedTemplateToURL(asset.id);
    });

    // Add each asset individually to the source
    if (assets && Array.isArray(assets)) {
      for (const asset of assets) {
        engine.asset.addAssetToSource(id, asset);
      }
    }
  }

  cesdk.i18n.setTranslations({
    en: {
      'libraries.ly.img.templates.ly.img.template.premium1.label': 'Templates',
      'libraries.ly.img.templates.ly.img.template.premium1.e-commerce.label':
        'E-Commerce',
      'libraries.ly.img.templates.ly.img.template.premium1.event.label': 'Event',
      'libraries.ly.img.templates.ly.img.template.premium1.personal.label':
        'Personal',
      'libraries.ly.img.templates.ly.img.template.premium1.professional.label':
        'Professional',
      'libraries.ly.img.templates.ly.img.template.premium1.socials.label':
        'Socials'
    }
  });

  cesdk.ui.updateAssetLibraryEntry('ly.img.templates', {
    sourceIds: ({ currentIds }) => [...new Set([...currentIds, id])],
    previewBackgroundType: 'contain',
    cardLabel: (asset) => asset.label,
    cardLabelPosition: () => 'below',
    promptBeforeApply: false
  });

  await addFloralStickersAssetSource(cesdk);
}

export async function addFloralStickersAssetSource(
  cesdk: CreativeEditorSDK,
  assetURI = '/icons/florals'
) {
  // Ensure the base URL is absolute
  const assetPath = assetURI.startsWith('http')
    ? assetURI
    : `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/${assetURI}`;

  // Add each floral asset to the existing sticker source
  for (let i = 1; i <= 10; i++) {
    const paddedIndex = i.toString().padStart(2, '0');
    const fileName = `florals_${paddedIndex}.svg`;
    cesdk.engine.asset.addAssetToSource('ly.img.sticker', {
      id: `//ly.img.cesdk.stickers.florals/florals_${paddedIndex}`,
      groups: ['//ly.img.cesdk.stickers.florals/category/florals'],
      label: {
        en: `Floral ${i}`
      },
      tags: {},
      meta: {
        uri: `${assetPath}/${fileName}`,
        thumbUri: `${assetPath}/${fileName}`,
        filename: fileName,
        kind: 'sticker',
        fillType: '//ly.img.ubq/fill/image',
        width: 2048,
        height: 2048
      }
    });
  }
  // Set translations for the Florals group
  cesdk.i18n.setTranslations({
    en: {
      'libraries.ly.img.sticker.florals.label': 'Florals'
    }
  });
}
