'use client';

import CreativeEngine from '@cesdk/engine';
import React, { useEffect, useRef, useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { hexToRgba } from './lib/ColorUtilities';
import classes from './CaseComponent.module.css';

const caseAssetPath = (path, caseId = 'multi-image-generation') =>
  `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/${caseId}${path}`;

const EXAMPLES = [
  {
    name: 'Bean there Bean good',
    photo_path: '/images/photo-bean.png',
    price: '$$',
    review_count: 281,
    rating: 1,
    card_path: '/images/card-bean.png',
    logo_path: '/images/logo-bean.png',
    primary_color: '#050087',
    secondary_color: '#F1E1C7'
  },
  {
    name: 'Scoop\nthere it is',
    photo_path: '/images/photo-scoop.png',
    price: '$',
    review_count: 114,
    rating: 5,
    card_path: '/images/card-scoop.png',
    logo_path: '/images/logo-scoop.png',
    primary_color: '#EB11D5',
    secondary_color: '#85EAD1'
  },
  {
    name: 'BUN intended',
    photo_path: '/images/photo-bun.png',
    price: '$$$',
    review_count: 65,
    rating: 3,
    card_path: '/images/card-bun.png',
    logo_path: '/images/logo-bun.png',
    primary_color: '#2E573E',
    secondary_color: '#E4A341'
  }
];

const TEMPLATE_PATHS = [
  {
    scenePath: '/example-1.scene',
    placeholderPath: '/images/placeholder-1.png',
    width: 480 / 2,
    height: 480 / 2
  },
  {
    scenePath: '/example-2.scene',
    placeholderPath: '/images/placeholder-2.png',
    width: 400 / 2,
    height: 560 / 2
  },
  {
    scenePath: '/example-3.scene',
    placeholderPath: '/images/placeholder-3.png',
    width: 560 / 2,
    height: 400 / 2
  }
];

const replaceImage = (cesdk, imageName, newUrl) => {
  const imgBlock = cesdk.block.findByName(imageName)[0];
  if (!imgBlock) {
    return;
  }
  const img = cesdk.block.getFill(imgBlock);
  cesdk.block.setString(img, 'fill/image/imageFileURI', newUrl);
  cesdk.block.resetCrop(img);
};

const fillTemplate = (cesdk, restaurantData) => {
  if (!restaurantData) {
    return false;
  }
  replaceImage(
    cesdk,
    'RestaurantPhoto',
    caseAssetPath(restaurantData.photo_path)
  );
  const photoBlock = cesdk.block.findByName('RestaurantPhoto')[0];
  cesdk.block.setContentFillMode(photoBlock, 'Cover');
  replaceImage(
    cesdk,
    'RestaurantLogo',
    caseAssetPath(restaurantData.logo_path)
  );
  cesdk.variable.setString('Name', restaurantData.name || '');
  // FIXME: not changed!
  cesdk.variable.setString('$$', restaurantData.price || '');
  cesdk.variable.setString(
    'Count',
    restaurantData.review_count.toString() || ''
  );
  // Apply colors based on black/white-ness of the previous color
  const primaryColor = hexToRgba(restaurantData.primary_color);
  const secondaryColor = hexToRgba(restaurantData.secondary_color);
  cesdk.block.findAll().forEach((block) => {
    // handle text blocks differently
    if (cesdk.block.getType(block) === '//ly.img.ubq/text') {
      const preColor = cesdk.block.getTextColors(block)[0];
      if (preColor.r === 1 && preColor.g === 1 && preColor.b === 1) {
        //white
        cesdk.block.setTextColor(block, secondaryColor);
      } else if (preColor.r === 0 && preColor.g === 0 && preColor.b === 0) {
        //black
        cesdk.block.setTextColor(block, primaryColor);
      }
    } else {
      if (cesdk.block.supportsFill(block) && cesdk.block.hasFill(block)) {
        const fillBlock = cesdk.block.getFill(block);
        if (cesdk.block.getType(fillBlock) === '//ly.img.ubq/fill/color') {
          const preColor = cesdk.block.getColor(fillBlock, 'fill/color/value');
          if (preColor.r === 1 && preColor.g === 1 && preColor.b === 1) {
            //white
            cesdk.block.setColor(fillBlock, 'fill/color/value', secondaryColor);
          } else if (preColor.r === 0 && preColor.g === 0 && preColor.b === 0) {
            //black
            cesdk.block.setColor(fillBlock, 'fill/color/value', primaryColor);
          }
        }
      }
    }
  });
  // Fill rating stars' color
  const onColor = cesdk.block.getColor(
    cesdk.block.findByName('Rating1')[0],
    'fill/solid/color'
  );
  const offColor = cesdk.block.getColor(
    cesdk.block.findByName('Rating5')[0],
    'fill/solid/color'
  );
  for (let i = 1; i < 6; i++) {
    cesdk.block.setColor(
      cesdk.block.findByName(`Rating${i}`)[0],
      'fill/solid/color',
      restaurantData.rating >= i ? onColor : offColor
    );
  }
};

const CaseComponent = () => {
  const engineRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null);
  const [reviewBlobs, setReviewBlobs] = useState(new Array(3).fill(null));

  useEffect(() => {
    const config = {
      license: process.env.NEXT_PUBLIC_LICENSE
    };
    CreativeEngine.init(config).then(async (engine) => {
      engine.addDefaultAssetSources();
      engine.addDemoAssetSources({ sceneMode: 'Design' });
      engineRef.current = engine;
    });

    return function shutdownCreativeEngine() {
      engineRef?.current?.dispose();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const engine = engineRef?.current;
    if (!engine || !restaurantData) {
      return;
    }
    async function renderTemplates(data) {
      // This can not be done in parallel.
      for (const [index, sceneUrl] of TEMPLATE_PATHS.entries()) {
        await engine.scene.loadFromURL(caseAssetPath(sceneUrl.scenePath));
        fillTemplate(engineRef.current, data);
        const blob = await engine.block.export(
          engine.scene.get(),
          'image/jpeg'
        );
        setReviewBlobs((oldBlobs) => {
          oldBlobs[index] = {
            isLoading: false,
            src: URL.createObjectURL(blob)
          };
          return [...oldBlobs];
        });
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }
    setIsLoading(true);
    setReviewBlobs((oldBlobs) => [
      ...oldBlobs.map((blob) => ({ ...blob, isLoading: true }))
    ]);
    renderTemplates({ ...restaurantData });
    setIsLoading(false);
  }, [restaurantData]);

  return (
    <div
      className="flex flex-grow flex-col items-center justify-center"
      style={{ gap: '64px' }}
    >
      <div className="gap-sm flex flex-col items-center">
        <h3 className="h4">Select Restaurant</h3>
        <div className="paragraphSmall" style={paragraphStyle}>
          <div className="gap-sm flex">
            {EXAMPLES.map((example) => (
              <button
                key={example.name}
                className={`${classes.example_button} ${
                  restaurantData && restaurantData.name === example.name
                    ? classes.selected
                    : ''
                }`}
                style={{ backgroundColor: example.secondary_color }}
                onClick={() => setRestaurantData(example)}
              >
                <img
                  className="object-contain w-auto"
                  src={caseAssetPath(example.card_path)}
                  alt={example.name}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="gap-sm flex flex-col items-center">
        <h3 className="h4">Generated Assets</h3>
        <div style={imageWrapper}>
          {TEMPLATE_PATHS.map(({ width, height, placeholderPath }, index) => (
            <div style={{ width, position: 'relative' }} key={placeholderPath}>
              <img
                data-cy={!reviewBlobs[index]?.isLoading ? 'export-image' : ''}
                key={index}
                src={reviewBlobs[index]?.src || caseAssetPath(placeholderPath)}
                style={{
                  ...(reviewBlobs[index]?.isLoading
                    ? { opacity: 0.5 }
                    : { opacity: 1 }),
                  transition: 'opacity .5s',
                  transitionTimingFunction: 'ease-in-out'
                }}
                width={width}
                height={height}
                alt={'Rendered review template ' + index}
              />
              {reviewBlobs[index]?.isLoading && <LoadingSpinner />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const imageWrapper = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '3rem',
  overflow: 'auto'
};

const paragraphStyle = {
  display: 'flex',
  columnGap: '1rem',
  flexWrap: 'wrap'
};

export default CaseComponent;
