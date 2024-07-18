export const checkImageContent = async (engine) => {
  const imageBlocksData = engine.block
    .findByKind('image')
    .map((blockId) => ({
      blockId,
      url: getImageUrl(engine, blockId),
      blockType: engine.block.getType(blockId),
      blockName: engine.block.getName(blockId)
    }))
    .filter(({ url }) => url);

  const imagesWithValidity = await Promise.all(
    imageBlocksData.flatMap(async (imageBlockData) => {
      const imageContentCategories = await checkImageContentAPI(
        imageBlockData.url
      );

      return imageContentCategories.flatMap((checkResult) => ({
        ...checkResult,
        ...imageBlockData
      }));
    })
  );
  return imagesWithValidity.flat();
};

export const selectAllBlocks = (engine, blockIds) => {
  engine.block
    .findAllSelected()
    .forEach((block) => engine.block.setSelected(block, false));
  blockIds.forEach((block) => engine.block.setSelected(block, true));
  return blockIds;
};

const percentageToState = (percentage) => {
  if (percentage > 0.8) {
    return 'failed';
  } else if (percentage > 0.4) {
    return 'warning';
  } else {
    return 'success';
  }
};

export const checkImageContentAPI = async (url) => {
  if (complianceCache[url]) {
    return complianceCache[url];
  }
  const response = await fetch(
    'https://europe-west3-img-ly.cloudfunctions.net/sightengineApiProxy?url=' +
      encodeURIComponent(url),
    {
      method: 'get',
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': 'multipart/form-data;'
      }
    }
  );
  const results = await response.json();

  const checksResult = [
    {
      name: 'Weapons',
      description: 'Handguns, rifles, machine guns, threatening knives...',
      state: percentageToState(results.weapon)
    },
    {
      name: 'Alcohol',
      description: 'Wine, beer, cocktails, champagne...',
      state: percentageToState(results.alcohol)
    },
    {
      name: 'Drugs',
      description: 'Cannabis, syringes, glass pipes, bongs, pills...',
      state: percentageToState(results.drugs)
    },
    {
      name: 'Nudity',
      description: 'Images that contain either raw nudity or partial nudity.',
      state: percentageToState(1 - results.nudity.safe)
    }
  ];
  complianceCache[url] = checksResult;
  return checksResult;
};

const getImageUrl = (engine, blockId) => {
  const imageFill = engine.block.getFill(blockId);
  const fillImageURI = engine.block.getString(
    imageFill,
    'fill/image/imageFileURI'
  );
  if (fillImageURI) {
    return fillImageURI;
  }

  // check source set
  const sourceSet = engine.block.getSourceSet(
    imageFill,
    'fill/image/sourceSet'
  );
  if (sourceSet && sourceSet.length) {
    return sourceSet[0].uri;
  }
  return null;
};

// Poor Man's cache, prefilled with images in the scene
const complianceCache = {
  'https://firebasestorage.googleapis.com/v0/b/cesdk-ab4f3.appspot.com/o/dashboard%2Fuploads%2Fdesign%2FVbuqnLvzB76KFLFUCyg2%2F9ca60cda-5b57-4ce3-b605-067d95ca9329?alt=media&token=10d1fabd-698b-4560-988a-727eaff3d19f':
    [
      {
        name: 'Weapons',
        description: 'Handguns, rifles, machine guns, threatening knives...',
        state: 'success'
      },
      {
        name: 'Alcohol',
        description: 'Wine, beer, cocktails, champagne...',
        state: 'success'
      },
      {
        name: 'Drugs',
        description: 'Cannabis, syringes, glass pipes, bongs, pills...',
        state: 'success'
      },
      {
        name: 'Nudity',
        description: 'Images that contain either raw nudity or partial nudity.',
        state: 'success'
      }
    ],
  'https://firebasestorage.googleapis.com/v0/b/cesdk-ab4f3.appspot.com/o/dashboard%2Fuploads%2Fdesign%2FVbuqnLvzB76KFLFUCyg2%2F7b31dd51-d5e5-4c49-b857-adadb17fefa2?alt=media&token=f866d5c0-9170-4612-b137-dd9a19ccc216':
    [
      {
        name: 'Weapons',
        description: 'Handguns, rifles, machine guns, threatening knives...',
        state: 'success'
      },
      {
        name: 'Alcohol',
        description: 'Wine, beer, cocktails, champagne...',
        state: 'success'
      },
      {
        name: 'Drugs',
        description: 'Cannabis, syringes, glass pipes, bongs, pills...',
        state: 'warning'
      },
      {
        name: 'Nudity',
        description: 'Images that contain either raw nudity or partial nudity.',
        state: 'success'
      }
    ],
  'https://firebasestorage.googleapis.com/v0/b/cesdk-ab4f3.appspot.com/o/dashboard%2Fuploads%2Fdesign%2FVbuqnLvzB76KFLFUCyg2%2Fb1dcb35d-f7e8-4eb7-9c4a-b3f80d11f16a?alt=media&token=0c15a83d-402f-4bc9-92a4-719c69234315':
    [
      {
        name: 'Weapons',
        description: 'Handguns, rifles, machine guns, threatening knives...',
        state: 'success'
      },
      {
        name: 'Alcohol',
        description: 'Wine, beer, cocktails, champagne...',
        state: 'success'
      },
      {
        name: 'Drugs',
        description: 'Cannabis, syringes, glass pipes, bongs, pills...',
        state: 'success'
      },
      {
        name: 'Nudity',
        description: 'Images that contain either raw nudity or partial nudity.',
        state: 'success'
      }
    ],
  'https://firebasestorage.googleapis.com/v0/b/cesdk-ab4f3.appspot.com/o/dashboard%2Fuploads%2Fdesign%2FVbuqnLvzB76KFLFUCyg2%2F3d940c11-1264-40d1-a6e5-677254b11e26?alt=media&token=f6d24425-37e2-4deb-a39c-166a67dfb11f':
    [
      {
        name: 'Weapons',
        description: 'Handguns, rifles, machine guns, threatening knives...',
        state: 'failed'
      },
      {
        name: 'Alcohol',
        description: 'Wine, beer, cocktails, champagne...',
        state: 'success'
      },
      {
        name: 'Drugs',
        description: 'Cannabis, syringes, glass pipes, bongs, pills...',
        state: 'success'
      },
      {
        name: 'Nudity',
        description: 'Images that contain either raw nudity or partial nudity.',
        state: 'success'
      }
    ]
};
