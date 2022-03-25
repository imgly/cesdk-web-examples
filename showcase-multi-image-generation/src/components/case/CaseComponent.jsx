import CreativeEngine from '@cesdk/cesdk-js/cesdk-engine.umd.js';
import React, { useEffect, useRef, useState } from 'react';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';

const ID_FROM_RESTAURANT_REGEX = /yelp\.de\/biz\/([^?]*).*?$/;
const caseAssetPath = (path, caseId = 'multi-image-generation') =>
  `https:${window.location.href.substring(0, -1)}/cases/${caseId}${path}`;

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
    CreativeEngine.init({
      license: process.env.REACT_APP_LICENSE
    }).then(async (instance) => {
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
    <div
      className="flex flex-col items-center justify-center"
      style={{ paddingTop: '2rem' }}
    >
      <h3 className="h4" style={headlineStyle}>
        API-based Visuals
      </h3>
      <div className="flex space-x-2">
        <input
          type="text"
          value={yelpUrl}
          placeholder="Paste Yelp Restaurant URL"
          onChange={(e) => setYelpUrl(e.target.value)}
          style={{ minWidth: 320 }}
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
      <p
        style={{
          color: 'rgba(255, 255, 255, 0.65)',
          marginTop: '20px',
          marginLeft: '10px'
        }}
      >
        <span style={{ marginRight: '1rem' }}>Or try these examples:</span>
        {YELP_EXAMPLES.map(({ label, value }) => (
          <button
            key={value}
            style={{ margin: '0 5px ', color: '#471AFF' }}
            onClick={() => {
              setYelpUrl(value);
              setYelpId(yelpIdFromUrl(value));
            }}
          >
            {label}
          </button>
        ))}
      </p>

      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={imageWrapper}>
          {TEMPLATE_PATHS.map(({ width, height, placeholderPath }, index) => (
            <div style={{ width, position: 'relative' }}>
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

const imageWrapper = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3rem',
  marginTop: '2rem',
  overflow: 'auto',
  justifyContent: 'center',
  alignItems: 'center'
};

const headlineStyle = {
  marginBottom: '1rem',
  color: 'white',
  textAlign: 'center'
};

export default CaseComponent;
