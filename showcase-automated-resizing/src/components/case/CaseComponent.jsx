'use client';

import CreativeEngine from '@cesdk/engine';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classes from './CaseComponent.module.css';
import EditInstanceCESDK from './components/EditInstanceCESDK/EditInstanceCESDK';
import EditTemplateCESDK from './components/EditTemplateCESDK/EditTemplateCESDK';
import InstanceImage from './components/InstanceImage/InstanceImage';
import TemplateEditButton from './components/TemplateEditButton/TemplateEditButton';
import TemplateSelectButton from './components/TemplateSelectButton/TemplateSelectButton';
import { caseAssetPath } from './util';

const SIZES = [
  {
    id: 'ig-story',
    label: { en: 'Instagram Story' },
    meta: {
      width: 1080,
      height: 1920,
      designUnit: 'Pixel',
      icon: <img src={caseAssetPath('/instagram.svg')} alt="Instagram Logo" />
    }
  },
  {
    id: 'ig-post',
    label: { en: 'Instagram Post 4:5' },
    meta: {
      width: 1080,
      height: 1350,
      designUnit: 'Pixel',
      icon: <img src={caseAssetPath('/instagram.svg')} alt="Instagram Logo" />
    }
  },
  {
    id: 'x-post',
    label: { en: 'X (Twitter) Post' },
    meta: {
      width: 1200,
      height: 675,
      designUnit: 'Pixel',
      icon: <img src={caseAssetPath('/x.svg')} alt="X Logo" />
    }
  },

  {
    id: 'facebook-post',
    label: { en: 'Facebook Post' },
    meta: {
      width: 1200,
      height: 630,
      designUnit: 'Pixel',
      icon: <img src={caseAssetPath('/facebook.svg')} alt="Facebook Logo" />
    }
  }
];

const TEMPLATES = {
  'example-1': {
    sceneString: undefined,
    sceneUrl: caseAssetPath('/example-1.scene'),
    previewImagePath: caseAssetPath('/example-1.png')
  },
  'example-2': {
    sceneString: undefined,
    sceneUrl: caseAssetPath('/example-2.scene'),
    previewImagePath: caseAssetPath('/example-2.png')
  },
  'example-3': {
    sceneString: undefined,
    sceneUrl: caseAssetPath('/example-3.scene'),
    previewImagePath: caseAssetPath('/example-3.png')
  }
};

const CaseComponent = () => {
  const engineRef = useRef(null);

  const [allTemplates, setAllTemplates] = useState(TEMPLATES);
  const TEMPLATE_KEYS = useMemo(
    () => Object.keys(allTemplates),
    [allTemplates]
  );
  const [currentTemplateName, setCurrentTemplateName] = useState(
    TEMPLATE_KEYS[0]
  );
  const template = useMemo(
    () => allTemplates[currentTemplateName],
    [allTemplates, currentTemplateName]
  );

  const [sizeImages, setSizeImages] = useState(
    SIZES.map((size) => ({
      isLoading: false,
      src: null,
      sceneString: null,
      size
    }))
  );
  const [initialized, setInitialized] = useState(false);

  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const [modalScene, setModalScene] = useState();

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const hideTemplateModal = useCallback(() => {
    setShowTemplateModal(false);
  }, []);
  const [modalTemplate, setModalTemplate] = useState();

  useEffect(() => {
    const config = {
      license: process.env.NEXT_PUBLIC_LICENSE,
      callbacks: {
        onUpload: 'local'
      }
    };
    CreativeEngine.init(config).then(async (instance) => {
      instance.addDefaultAssetSources();
      instance.addDemoAssetSources({ sceneMode: 'Design' });
      instance.editor.setSetting('page/title/show', false);
      await instance.scene.loadFromURL(template.sceneUrl);
      engineRef.current = instance;
      setInitialized(true);
    });

    return function shutdownCreativeEngine() {
      engineRef.current?.dispose();
    };
    // eslint-disable-next-line
  }, []);

  async function renderSize() {
    const engine = engineRef.current;
    if (initialized && engine) {
      // set image loading state
      setSizeImages(
        SIZES.map((size) => ({
          src: null,
          isLoading: true,
          sceneString: template.sceneString,
          size
        }))
      );
      // let react render
      await new Promise((resolve) => setTimeout(resolve, 0));
      // prepare scene
      for (const [index, size] of SIZES.entries()) {
        if (template.sceneString) {
          await engine.scene.loadFromString(template.sceneString);
        } else {
          await engine.scene.loadFromURL(template.sceneUrl);
        }
        engine.block.resizeContentAware(
          engine.scene.getPages(),
          size.meta.width,
          size.meta.height
        );

        const blob = await engine.block.export(engine.scene.get(), {
          mimeType: 'image/png'
        });
        const sceneString = await engine.scene.saveToString();
        setSizeImages((oldImages) => {
          oldImages[index] = {
            isLoading: false,
            src: URL.createObjectURL(blob),
            sceneString,
            size
          };
          return [...oldImages];
        });
        // Allow react to render
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }

  const onEditInstance = useCallback((image) => {
    setModalScene(image);
    setShowInstanceModal(true);
  }, []);
  const onEditTemplate = useCallback((template) => {
    setModalTemplate(template);
    setShowTemplateModal(true);
  }, []);

  const handleTemplateEdit = useCallback(
    async (sceneString) => {
      const engine = engineRef.current;
      await engine.scene.loadFromString(sceneString);
      const blob = await engine.block.export(engine.scene.get(), {
        mimeType: 'image/png'
      });
      const updatedTemplate = {
        ...template,
        sceneString,
        previewImagePath: URL.createObjectURL(blob)
      };

      setAllTemplates((oldTemplates) => ({
        ...oldTemplates,
        [currentTemplateName]: updatedTemplate
      }));
      setShowTemplateModal(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [template]
  );

  return (
    <div className="flex flex-grow flex-col w-full">
      <div className={classes.wrapper}>
        <div className="gap-xs flex flex-col items-center">
          <div className="flex flex-col items-center">
            <h4 className={'h4'}>Source Template</h4>
            <p className={classes.description}>
              This template will be used to generate the other sizes
            </p>
          </div>
          <div className={classes.templateWrapper}>
            {TEMPLATE_KEYS.map((templateName) => {
              const template = allTemplates[templateName];
              if (currentTemplateName !== templateName) {
                return (
                  <TemplateSelectButton
                    key={templateName}
                    template={template}
                    onClick={() => {
                      setCurrentTemplateName(templateName);
                    }}
                  />
                );
              }

              return (
                <TemplateEditButton
                  key={templateName}
                  template={template}
                  onClick={() => {
                    onEditTemplate(template);
                  }}
                />
              );
            })}
          </div>
          <div className="flex flex-col items-center">
            <button
              data-cy="generate-button"
              className="button button--primary"
              onClick={() => renderSize()}
            >
              Generate
            </button>
          </div>
        </div>
        <div className="gap-lg flex flex-col">
          <div className="flex flex-col items-center">
            <h4 className={'h4'}>Generated Variants</h4>
            <p className={classes.description}>
              Can be edited individually to better fit the different form
              factors.
            </p>
          </div>
          <div className={classes.contentWrapper}>
            <div className={classes.imageWrapper}>
              {sizeImages.map((image, index) => (
                <InstanceImage
                  key={index}
                  src={image.src}
                  Icon={image.size.meta.icon}
                  headline={image.size.label.en}
                  subHeadline={`${image.size.meta.width} × ${image.size.meta.height} px`}
                  isLoading={image.isLoading}
                  aspectRatio={image.size.meta.width / image.size.meta.height}
                  onClick={() => onEditInstance(image)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showInstanceModal && (
        <EditInstanceCESDK
          sceneString={modalScene.sceneString}
          onClose={() => setShowInstanceModal(false)}
          onSave={async (sceneString) => {
            const updatedSizeImage = sizeImages.find(
              (image) => image.size.id === modalScene.size.id
            );
            if (!updatedSizeImage) throw new Error('Size not found');

            const engine = engineRef.current;
            // Render Scene from updated sceneString
            await engine.scene.loadFromString(sceneString);
            const blob = await engine.block.export(engine.scene.get(), {
              mimeType: 'image/png'
            });
            // Save updated scene and blob for this person

            updatedSizeImage.sceneString = sceneString;
            updatedSizeImage.src = URL.createObjectURL(blob);
            setSizeImages((oldImages) => [...oldImages]);
            setShowInstanceModal(false);
          }}
        />
      )}
      {showTemplateModal && modalTemplate && (
        <EditTemplateCESDK
          sceneString={modalTemplate.sceneString}
          sceneUrl={modalTemplate.sceneUrl}
          templateName={'Source Template'}
          onSave={handleTemplateEdit}
          onClose={hideTemplateModal}
        />
      )}
    </div>
  );
};

export default CaseComponent;
