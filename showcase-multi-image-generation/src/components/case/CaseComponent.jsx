'use client';

import CreativeEngine from '@cesdk/engine';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import {
  caseAssetPath,
  fillTemplate,
  removeInstanceVariables
} from './lib/TemplateUtilities';
import classes from './CaseComponent.module.css';
import EditIcon from './icons/Edit.svg';
import { EditTemplateCESDK } from './components/EditTemplateCESDK';
import { EditInstanceCESDK } from './components/EditInstanceCESDK';
import SCENES from './scenes.json';

const EXAMPLES = [
  {
    name: 'Bean there Bean good',
    photoPath: '/images/photo-bean.png',
    price: '$$',
    reviewCount: 281,
    rating: 1,
    cardPath: '/images/card-bean.png',
    logoPath: '/images/logo-bean.png',
    primaryColor: '#050087',
    secondaryColor: '#F1E1C7'
  },
  {
    name: 'Scoop\nthere it is',
    photoPath: '/images/photo-scoop.png',
    price: '$',
    reviewCount: 114,
    rating: 5,
    cardPath: '/images/card-scoop.png',
    logoPath: '/images/logo-scoop.png',
    primaryColor: '#EB11D5',
    secondaryColor: '#85EAD1'
  },
  {
    name: 'BUN intended',
    photoPath: '/images/photo-bun.png',
    price: '$$$',
    reviewCount: 65,
    rating: 3,
    cardPath: '/images/card-bun.png',
    logoPath: '/images/logo-bun.png',
    primaryColor: '#2E573E',
    secondaryColor: '#E4A341'
  }
];

const TEMPLATES = {
  Square: {
    label: 'Square',
    sceneString: SCENES.square,
    previewImagePath: caseAssetPath('/images/placeholder-1.png'),
    outputFormat: 'image/png',
    width: 480 / 2,
    height: 480 / 2
  },
  Portrait: {
    label: 'Portrait',
    sceneString: SCENES.portrait,
    previewImagePath: caseAssetPath('/images/placeholder-2.png'),
    outputFormat: 'image/png',
    width: 400 / 2,
    height: 560 / 2
  },
  Landscape: {
    label: 'Landscape',
    sceneString: SCENES.landscape,
    previewImagePath: caseAssetPath('/images/placeholder-3.png'),
    outputFormat: 'image/png',
    width: 560 / 2,
    height: 400 / 2
  }
};

const CaseComponent = () => {
  const engineRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [reviewBlobs, setReviewBlobs] = useState(new Array(3).fill(null));
  const [allTemplates, setAllTemplates] = useState(TEMPLATES);
  const [currentSceneData, setCurrentSceneData] = useState();
  const [showEditModal, setShowEditModal] = useState(false);

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
  }, []);

  const selectRestaurant = async (restaurantData) => {
    const engine = engineRef?.current;
    if (!engine || !restaurantData) {
      return;
    }
    setReviewBlobs(
      reviewBlobs.map((blob) => ({
        ...blob,
        isLoading: true
      }))
    );
    // This can not be done in parallel.
    for (const [index, [, template]] of Object.entries(
      Object.entries(allTemplates)
    )) {
      await fillTemplate(engine, template.sceneString, restaurantData);
      const image = await engine.block.export(engine.scene.get(), 'image/jpeg');
      const sceneString = await engine.scene.saveToString();
      setReviewBlobs((oldBlobs) => {
        oldBlobs[index] = {
          isLoading: false,
          src: URL.createObjectURL(image),
          label: template.label,
          sceneString
        };
        return [...oldBlobs];
      });
    }
    setIsLoading(false);
  };

  const resetSelection = async () => {
    setRestaurant(null);
    setReviewBlobs((oldBlobs) => [
      ...oldBlobs.map((blob) => ({
        ...blob,
        src: null,
        label: null,
        sceneString: null,
        isLoading: false
      }))
    ]);
    setIsLoading(false);
  };

  const onEditClicked = useCallback((sceneData) => {
    setCurrentSceneData(sceneData);
    setShowEditModal(true);
  }, []);

  const updateTemplate = useCallback(
    async (sceneString, currentTemplate) => {
      const engine = engineRef?.current;

      // Render Scene from updated sceneString
      await engine.scene.loadFromString(sceneString);
      removeInstanceVariables(engine);
      const blob = await engine.block.export(
        engine.block.findByType('scene')[0],
        currentTemplate.outputFormat
      );
      setAllTemplates({
        ...allTemplates,
        [currentTemplate.label]: {
          ...currentTemplate,
          sceneString,
          previewImagePath: URL.createObjectURL(blob)
        }
      });
      setShowEditModal(false);
    },
    [allTemplates]
  );

  const updateInstance = useCallback(
    async (sceneString, currentTemplate) => {
      const engine = engineRef?.current;

      // Render Scene from updated sceneString
      await engine.scene.loadFromString(sceneString);
      const newBlob = await engine.block.export(
        engine.block.findByType('scene')[0],
        currentTemplate.outputFormat
      );
      setReviewBlobs(
        reviewBlobs.map((blob) =>
          blob.label === currentTemplate.label
            ? {
                ...blob,
                sceneString,
                src: URL.createObjectURL(newBlob)
              }
            : blob
        )
      );
      setShowEditModal(false);
    },
    [reviewBlobs]
  );

  const hideEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.containerButtons}>
        <h3 className={classes.h4}>Select Restaurant</h3>
        <div className={classes.paragraph}>
          <div className={classes.buttons}>
            {EXAMPLES.map((example) => (
              <button
                key={example.name}
                className={`${classes.exampleButton} ${
                  restaurant && restaurant.name === example.name
                    ? classes.selected
                    : ''
                }`}
                disabled={
                  restaurant && restaurant.name !== example.name && isLoading
                }
                style={{ backgroundColor: example.secondaryColor }}
                onClick={() => {
                  if (restaurant && restaurant.name === example.name) {
                    resetSelection();
                  } else {
                    setIsLoading(true);
                    setRestaurant(example);
                    selectRestaurant(example);
                  }
                }}
              >
                <img
                  className={classes.restaurantLogoImage}
                  src={caseAssetPath(example.cardPath)}
                  alt={example.name}
                />
                <div className={classes.overlay}></div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={classes.containerAssets}>
        <h3 className="h4">Generated Assets</h3>
        <div className={classes.wrapperAssets}>
          {Object.entries(allTemplates).map(([_, template], index) => (
            <div
              className={classes.wrapperAsset}
              style={{ width: template.width }}
              key={template.label}
            >
              <img
                data-cy={!reviewBlobs[index]?.isLoading ? 'export-image' : ''}
                key={index}
                src={reviewBlobs[index]?.src || template.previewImagePath}
                style={{
                  ...(reviewBlobs[index]?.isLoading
                    ? { opacity: 0.5 }
                    : { opacity: 1 }),
                  transition: 'opacity .5s',
                  transitionTimingFunction: 'ease-in-out'
                }}
                width={template.width}
                height={template.height}
                alt={'Rendered review template ' + index}
              />
              <div className={classes.overlay}>
                <button
                  onClick={() => onEditClicked(template)}
                  className={classes.editButton}
                >
                  <EditIcon />
                  <span>Edit</span>
                </button>
              </div>
              {reviewBlobs[index]?.isLoading && <LoadingSpinner />}
            </div>
          ))}
        </div>
      </div>
      {showEditModal && restaurant && (
        <EditInstanceCESDK
          templateName={currentSceneData.label}
          restaurantData={restaurant}
          sceneString={currentSceneData.sceneString}
          onSave={async (sceneString) =>
            updateInstance(sceneString, currentSceneData)
          }
          onClose={hideEditModal}
        />
      )}
      {showEditModal && !restaurant && (
        <EditTemplateCESDK
          templateName={currentSceneData.label}
          sceneString={currentSceneData.sceneString}
          onSave={async (sceneString) =>
            updateTemplate(sceneString, currentSceneData)
          }
          onClose={hideEditModal}
        />
      )}
    </div>
  );
};

export default CaseComponent;
