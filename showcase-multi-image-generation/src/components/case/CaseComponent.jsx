import CreativeEngine from '@cesdk/engine';
import React, { useEffect, useRef, useState } from 'react';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';

const ID_FROM_RESTAURANT_REGEX = /yelp\.de\/biz\/([^?]*).*?$/;
const caseAssetPath = (path, caseId = 'multi-image-generation') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;

const YELP_EXAMPLES = [
  {
    label: 'Ice Cream',
    value: 'https://www.yelp.de/biz/i-am-love-bochum-2'
  },
  {
    label: 'Coffee',
    value: 'https://www.yelp.de/biz/r%C3%B6st-art-bochum'
  },
  {
    label: 'Burger',
    value: 'https://www.yelp.de/biz/burgerado-bochum'
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
  const img = cesdk.block.findByName(imageName)[0];
  if (!img) {
    return;
  }
  cesdk.block.setString(img, 'image/imageFileURI', newUrl);
  cesdk.block.resetCrop(img);
};

const fillTemplate = (cesdk, yelpData) => {
  if (!yelpData) {
    return false;
  }
  replaceImage(cesdk, 'RestaurantPhoto', yelpData.image_url);
  cesdk.variable.setString('Name', yelpData.name || '');
  cesdk.variable.setString('$$', yelpData.price || '');
  cesdk.variable.setString('Count', yelpData.review_count.toString() || '');
  const ratingImageUrl = caseAssetPath(
    `/images/${yelpData.rating.toString().replace('.', '_')}.png`
  );
  replaceImage(cesdk, 'ReviewStars', ratingImageUrl);
};

const yelpIdFromUrl = (url) => {
  const match = url.match(ID_FROM_RESTAURANT_REGEX);
  if (match && match[1]) {
    return match[1];
  }
  return null;
};

const CaseComponent = () => {
  const engineRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [yelpData, setYelpData] = useState(null);
  const [yelpId, setYelpId] = useState(null);
  const [yelpUrl, setYelpUrl] = useState('');
  const [reviewBlobs, setReviewBlobs] = useState(new Array(3).fill(null));

  useEffect(() => {

    const config = {
      license: process.env.REACT_APP_LICENSE
    };
    CreativeEngine.init(config).then(async (instance) => {
      instance.addDefaultAssetSources();
      instance.addDemoAssetSources();
      engineRef.current = instance;
    });

    return function shutdownCreativeEngine() {
      engineRef?.current?.dispose();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (yelpId) {
      fetchApiData(yelpId);
    }
  }, [yelpId]);

  useEffect(() => {
    if (!engineRef?.current || !yelpData) {
      return;
    }
    async function renderTemplates() {
      // This can not be done in parallel.
      for (const [index, sceneUrl] of TEMPLATE_PATHS.entries()) {
        await engineRef?.current.scene.loadFromURL(
          caseAssetPath(sceneUrl.scenePath)
        );
        fillTemplate(engineRef.current, yelpData);
        const blob = await engineRef?.current.block.export(
          engineRef?.current.block.findByType('scene')[0],
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
    renderTemplates();
  }, [yelpData]);

  const fetchApiData = async (id) => {
    setIsLoading(true);
    setReviewBlobs((oldBlobs) => [
      ...oldBlobs.map((blob) => ({ ...blob, isLoading: true }))
    ]);
    const res = await fetch(
      `https://europe-west3-img-ly.cloudfunctions.net/demos-yelp-api-proxy2?id=` +
        id
    );
    const resJson = await res.json();
    if (resJson.id) {
      setYelpData(resJson);
    }
    setIsLoading(false);
  };

  return (
    <div className="gap-lg flex flex-grow flex-col items-center justify-center">
      <div className="gap-sm flex flex-col items-center">
        <h3 className="h4">Paste Yelp Restaurant URL</h3>
        <div className="gap-sm flex flex-wrap">
          <input
            type="text"
            value={yelpUrl}
            placeholder={`e.g. ${YELP_EXAMPLES[0].value}`}
            onChange={(e) => setYelpUrl(e.target.value)}
            style={inputStyle}
          />
          {isLoading ? (
            <button disabled className="button button--primary">
              Loading
            </button>
          ) : (
            <button
              onClick={() => {
                if (!yelpUrl) {
                  setYelpUrl(YELP_EXAMPLES[0].value);
                }
                setYelpId(yelpIdFromUrl(yelpUrl || YELP_EXAMPLES[0].value));
              }}
              className="button button--primary"
            >
              Generate
            </button>
          )}
        </div>
        <div className="paragraphSmall" style={paragraphStyle}>
          <span>Or try these examples:</span>
          <div className="gap-xs flex">
            {YELP_EXAMPLES.map(({ label, value }) => (
              <button
                key={value}
                style={exampleButtonStyle}
                onClick={() => {
                  setYelpUrl(value);
                  setYelpId(yelpIdFromUrl(value));
                }}
              >
                {label}
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

const inputStyle = {
  minWidth: 320
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

const exampleButtonStyle = { color: '#471AFF' };

export default CaseComponent;
