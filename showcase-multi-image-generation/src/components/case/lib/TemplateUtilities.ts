import CreativeEngine from '@cesdk/engine';
import { hexToRgba } from './ColorUtilities';
import { RgbColor } from 'react-colorful';

interface Restaurant {
  name: string;
  photoPath: string;
  price: string;
  reviewCount: number;
  rating: number;
  cardPath: string;
  logoPath: string;
  primaryColor: string;
  secondaryColor: string;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const replaceImage = (
  engine: CreativeEngine,
  imageName: string,
  newUrl: string
) => {
  const imgBlock = engine.block.findByName(imageName)[0];
  if (!imgBlock) {
    return;
  }
  const img = engine.block.getFill(imgBlock);
  engine.block.setString(img, 'fill/image/imageFileURI', newUrl);
  engine.block.resetCrop(img);
};

export const caseAssetPath = (
  path: string,
  caseId = 'multi-image-generation'
) =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

export const fillTemplate = async (
  engine: CreativeEngine,
  sceneString: string,
  restaurantData: Restaurant
) => {
  if (!restaurantData) {
    return false;
  }
  await engine.scene.loadFromString(sceneString);
  replaceImage(
    engine,
    'RestaurantPhoto',
    caseAssetPath(restaurantData.photoPath)
  );
  const photoBlock = engine.block.findByName('RestaurantPhoto')[0];
  engine.block.setContentFillMode(photoBlock, 'Cover');
  replaceImage(
    engine,
    'RestaurantLogo',
    caseAssetPath(restaurantData.logoPath)
  );
  engine.variable.setString('Name', restaurantData.name || '');
  engine.variable.setString('$$', restaurantData.price || '');
  engine.variable.setString(
    'Count',
    restaurantData.reviewCount.toString() || ''
  );
  // Apply colors based on black/white-ness of the previous color
  const primaryColor = hexToRgba(restaurantData.primaryColor);
  const secondaryColor = hexToRgba(restaurantData.secondaryColor);
  engine.block.findAll().forEach((block) => {
    // handle text blocks differently
    if (engine.block.getType(block) === '//ly.img.ubq/text') {
      const preColor = engine.block.getTextColors(block)[0] as RGBColor;
      if (preColor.r === 1 && preColor.g === 1 && preColor.b === 1) {
        //white
        engine.block.setTextColor(block, secondaryColor);
      } else if (preColor.r === 0 && preColor.g === 0 && preColor.b === 0) {
        //black
        engine.block.setTextColor(block, primaryColor);
      }
    } else {
      if (engine.block.supportsFill(block) && engine.block.hasFill(block)) {
        const fillBlock = engine.block.getFill(block);
        if (engine.block.getType(fillBlock) === '//ly.img.ubq/fill/color') {
          const preColor = engine.block.getColor(
            fillBlock,
            'fill/color/value'
          ) as RgbColor;
          if (preColor.r === 1 && preColor.g === 1 && preColor.b === 1) {
            //white
            engine.block.setColor(
              fillBlock,
              'fill/color/value',
              secondaryColor
            );
          } else if (preColor.r === 0 && preColor.g === 0 && preColor.b === 0) {
            //black
            engine.block.setColor(fillBlock, 'fill/color/value', primaryColor);
          }
        }
      }
    }
  });
  // Fill rating stars' color
  const onColor = engine.block.getColor(
    engine.block.findByName('Rating1')[0],
    'fill/solid/color'
  );
  const offColor = engine.block.getColor(
    engine.block.findByName('Rating5')[0],
    'fill/solid/color'
  );
  for (let i = 1; i < 6; i++) {
    engine.block.setColor(
      engine.block.findByName(`Rating${i}`)[0],
      'fill/solid/color',
      restaurantData.rating >= i ? onColor : offColor
    );
  }
};

export const removeInstanceVariables = (engine: CreativeEngine) => {
  engine.variable.findAll().forEach((variable) => {
    engine.variable.remove(variable);
  });
};
