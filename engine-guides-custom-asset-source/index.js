import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.1/index.js';

import * as unsplash from './vendor/unsplash-js.esm.js';

const unsplashApi = unsplash.createApi({
  apiUrl: '...'
});

const EMPTY_RESULT = {
  assets: [],
  total: 0,
  currentPage: 0,
  nextPage: undefined
};

const findUnsplashAssets = async (queryData) => {
  /* Unsplash page indices are 1-based. */
  const unsplashPage = queryData.page + 1;

  if (queryData.query) {
    const response = await unsplashApi.search.getPhotos({
      query: queryData.query,
      page: unsplashPage,
      perPage: queryData.perPage
    });
    if (response.type === 'success') {
      const { results, total, total_pages } = response.response;

      return {
        assets: await Promise.all(results.map(translateToAssetResult)),

        total,
        currentPage: queryData.page,
        nextPage:
          queryData.page + 1 < total_pages ? queryData.page + 1 : undefined
      };
    } else if (response.type === 'error') {
      throw new Error(response.errors.join('. '));
    } else {
      return Promise.resolve(EMPTY_RESULT);
    }
  } else {
    const response = await unsplashApi.photos.list({
      orderBy: 'popular',
      page: unsplashPage,
      perPage: queryData.perPage
    });

    if (response.type === 'success') {
      const { results, total } = response.response;
      const totalFetched = queryData.page * queryData.perPage + results.length;

      const nextPage = totalFetched < total ? queryData.page + 1 : undefined;

      return {
        assets: await Promise.all(results.map(translateToAssetResult)),

        total,
        currentPage: queryData.page,
        nextPage
      };
    } else if (response.type === 'error') {
      throw new Error(response.errors.join('. '));
    } else {
      return Promise.resolve(EMPTY_RESULT);
    }
  }
};

const getUnsplashUrl = async (unsplashResult) => {
  const trackDownloadResponse = await unsplashApi.photos.trackDownload({
    downloadLocation: unsplashResult.links.download_location
  });

  if (trackDownloadResponse.type === 'error') {
    throw new Error(trackDownloadResponse.errors.join('. '));
  }
  return trackDownloadResponse.response?.url;
};

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.63.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  engine.scene.zoomToBlock(page);

  const customSource = {
    id: 'unsplash',
    findAssets: findUnsplashAssets,
    credits: {
      name: 'Unsplash',
      url: 'https://unsplash.com/'
    },
    license: {
      name: 'Unsplash license (free)',
      url: 'https://unsplash.com/license'
    }
  };

  engine.asset.addSource(customSource);

  const result = await engine.asset.findAssets(customSource.id, {
    page: 0,
    perPage: 3
  });
  const asset = result.assets[0];

  await engine.asset.apply(customSource.id, asset);

  const localSourceId = 'background-videos';
  engine.asset.addLocalSource(localSourceId);

  engine.asset.addAssetToSource(localSourceId, {
    id: 'ocean-waves-1',
    label: {
      en: 'relaxing ocean waves',
      es: 'olas del mar relajantes'
    },
    tags: {
      en: ['ocean', 'waves', 'soothing', 'slow'],
      es: ['mar', 'olas', 'calmante', 'lento']
    },
    meta: {
      uri: `https://example.com/ocean-waves-1.mp4`,
      thumbUri: `https://example.com/thumbnails/ocean-waves-1.jpg`,
      mimeType: 'video/mp4',
      width: 1920,
      height: 1080
    },
    credits: {
      name: 'John Doe',
      url: 'https://example.com/johndoe'
    }
  });
});

async function translateToAssetResult(image) {
  const artistName = image?.user?.name;
  const artistUrl = image?.user?.links?.html;

  return {
    id: image.id,
    locale: 'en',
    //
    label: image.description ?? image.alt_description ?? undefined,
    tags: image.tags ? image.tags.map((tag) => tag.title) : undefined,

    meta: {
      uri: await getUnsplashUrl(image),
      thumbUri: image.urls.thumb,
      blockType: '//ly.img.ubq/graphic',
      fillType: '//ly.img.ubq/fill/image',
      shapeType: '//ly.img.ubq/shape/rect',
      kind: 'image',
      width: image.width,
      height: image.height
    },

    context: {
      sourceId: 'unsplash'
    },

    credits: artistName
      ? {
          name: artistName,
          url: artistUrl
        }
      : undefined,

    utm: {
      source: 'CE.SDK Demo',
      medium: 'referral'
    }
  };
}
