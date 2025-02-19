import CreativeEngine from '@cesdk/engine';
import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import classes from './CaseComponent.module.css';
import EditInstanceCESDK from './components/EditInstanceCESDK/EditInstanceCESDK';
import EditTemplateCESDK from './components/EditTemplateCESDK/EditTemplateCESDK';
import InstanceImage from './components/InstanceImage/InstanceImage';
import TemplateEditButton from './components/TemplateEditButton/TemplateEditButton';
import TemplateSelectButton from './components/TemplateSelectButton/TemplateSelectButton';
import { EMPLOYEES, TEMPLATES } from './data';
import { caseAssetPath, replaceImages } from './util';

const CaseComponent = () => {
  const engineRef = useRef(null);

  const [allTemplates, setAllTemplates] = useState(TEMPLATES);
  const [currentTemplateName, setCurrentTemplateName] = useState('portrait');
  const currentTemplate = useMemo(
    () => allTemplates[currentTemplateName],
    [allTemplates, currentTemplateName]
  );

  const [teamImages, setTeamImages] = useState(
    EMPLOYEES.map((employee) => ({
      isLoading: true,
      src: currentTemplate.previewImagePath,
      sceneString: null,
      employee
    }))
  );
  const [initialized, setInitialized] = useState(false);

  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const [modalEmployee, setModalEmployee] = useState();

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const hideTemplateModal = useCallback(() => {
    setShowTemplateModal(false);
  }, []);
  const [modalTemplate, setModalTemplate] = useState();

  useEffect(() => {
    const config = {
      license: process.env.REACT_APP_LICENSE,
      initialSceneString: currentTemplate.sceneString,
      page: {
        title: {
          show: false
        }
      },
      callbacks: {
        onUpload: 'local'
      }
    };
    CreativeEngine.init(config).then(async (instance) => {
      instance.addDefaultAssetSources();
      instance.addDemoAssetSources();
      engineRef.current = instance;
      setInitialized(true);
    });

    return function shutdownCreativeEngine() {
      engineRef.current?.dispose();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function renderTeam() {
      const cesdk = engineRef.current;
      if (initialized && cesdk) {
        // set image loading state
        setTeamImages(
          EMPLOYEES.map((employee) => ({
            isLoading: true,
            src: currentTemplate.previewImagePath,
            sceneString: currentTemplate.sceneString,
            employee
          }))
        );
        // let react render
        await new Promise((resolve) => setTimeout(resolve, 0));
        // prepare scene
        await cesdk.scene.loadFromString(currentTemplate.sceneString);
        for (const [index, employee] of EMPLOYEES.entries()) {
          const { blob, sceneString } = await renderInstance(
            cesdk,
            employee,
            currentTemplate.outputFormat
          );
          setTeamImages((oldImages) => {
            oldImages[index] = {
              isLoading: false,
              src: URL.createObjectURL(blob),
              sceneString,
              employee
            };
            return [...oldImages];
          });
          // Allow react to render
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    }
    renderTeam();
  }, [currentTemplate, engineRef, initialized]);

  const onEditInstance = useCallback((image) => {
    setModalEmployee(image);
    setShowInstanceModal(true);
  }, []);
  const onEditTemplate = useCallback((template) => {
    setModalTemplate(template);
    setShowTemplateModal(true);
  }, []);

  const onUpdateImageInstance = async (sceneString, imageToUpdate) => {
    const cesdk = engineRef.current;

    // Render Scene from updated sceneString
    await cesdk.scene.loadFromString(sceneString);
    setInstanceVariables(cesdk, imageToUpdate.employee);
    const blob = await cesdk.block.export(
      cesdk.block.findByType('scene')[0],
      currentTemplate.outputFormat
    );
    // Save updated scene and blob for this person
    imageToUpdate.sceneString = sceneString;
    imageToUpdate.src = URL.createObjectURL(blob);
    setShowInstanceModal(false);
  };

  const handleTemplateEdit = useCallback(
    async (sceneString) => {
      const cesdk = engineRef.current;

      // Render Scene from updated sceneString
      await cesdk.scene.loadFromString(sceneString);
      removeInstanceVariables(cesdk);
      const blob = await cesdk.block.export(
        cesdk.block.findByType('scene')[0],
        currentTemplate.outputFormat
      );
      const updatedTemplate = {
        ...currentTemplate,
        sceneString,
        previewImagePath: URL.createObjectURL(blob)
      };
      setAllTemplates((allTemplates) => ({
        ...allTemplates,
        [currentTemplateName]: updatedTemplate
      }));
      setShowTemplateModal(false);
    },
    [currentTemplate, currentTemplateName]
  );

  return (
    <div className="flex flex-grow flex-col">
      <Helmet>
        {/* Preload images so they are already loaded in cache. */}
        {EMPLOYEES.map((employee) => (
          <link
            rel="preload"
            href={caseAssetPath(`/images/${employee.imagePath}`)}
            as="image"
            key={employee.imagePath}
            type="image/png"
          />
        ))}
      </Helmet>
      <div className="caseHeader">
        <h3>Image Set Generation</h3>
        <p>Use templates to automatically generate images from data.</p>
      </div>
      <div className={classes.wrapper}>
        <div className="gap-sm flex flex-col items-start">
          <div>
            <h4 className={classNames('h4', classes.headline)}>Templates</h4>
            <p className={classes.description}>
              Edit a template to change all images.
            </p>
          </div>
          <div className={classes.templateWrapper}>
            {Object.entries(allTemplates).map(([templateName, template]) => {
              if (templateName === currentTemplateName) {
                return (
                  <TemplateEditButton
                    key={templateName}
                    template={template}
                    onClick={() => onEditTemplate(template)}
                  />
                );
              } else {
                return (
                  <TemplateSelectButton
                    key={templateName}
                    template={template}
                    onClick={() => {
                      if (templateName !== currentTemplateName) {
                        setCurrentTemplateName(templateName);
                      }
                    }}
                  />
                );
              }
            })}
          </div>
        </div>

        <div className="gap-sm flex flex-col">
          <div>
            <h4 className={classNames('h4', classes.headline)}>
              Generated Cards
            </h4>
            <p className={classes.description}>
              Edit individual cards leaving all others unchanged.
            </p>
          </div>
          <div className={classes.contentWrapper}>
            <div
              className={classes.imageWrapper}
              style={{ maxWidth: (currentTemplate.width + 40) * 3 }}
            >
              {teamImages.map((image, index) => (
                <InstanceImage
                  key={index}
                  image={image}
                  currentTemplate={currentTemplate}
                  onClick={() => onEditInstance(image)}
                  maxWidth={Math.max(
                    ...Object.values(allTemplates).map(({ width }) => width)
                  )}
                  maxHeight={Math.max(
                    ...Object.values(allTemplates).map(({ height }) => height)
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showInstanceModal && (
        <EditInstanceCESDK
          firstName={modalEmployee.employee.firstName}
          lastName={modalEmployee.employee.lastName}
          department={modalEmployee.employee.department}
          styleName={currentTemplateName}
          sceneString={modalEmployee.sceneString}
          onClose={() => setShowInstanceModal(false)}
          onSave={async (sceneString) => {
            const updatedTeamImage = teamImages.find(
              ({ employee }) =>
                employee.lastName === modalEmployee.employee.lastName
            );
            onUpdateImageInstance(sceneString, updatedTeamImage);
          }}
        />
      )}
      {showTemplateModal && (
        <EditTemplateCESDK
          templateName={modalTemplate.label}
          sceneString={modalTemplate.sceneString}
          onSave={handleTemplateEdit}
          onClose={hideTemplateModal}
        />
      )}
    </div>
  );
};

const removeInstanceVariables = (cesdk) => {
  cesdk.variable.remove('Department');
  cesdk.variable.remove('FirstName');
  cesdk.variable.remove('LastName');
};
const setInstanceVariables = (cesdk, { department, firstName, lastName }) => {
  cesdk.variable.setString('Department', department || '');
  cesdk.variable.setString('FirstName', firstName || '');
  cesdk.variable.setString('LastName', lastName || '');
};

const renderInstance = async (cesdk, employee, outputFormat) => {
  replaceImages(cesdk, 'Photo', caseAssetPath(`/images/${employee.imagePath}`));
  setInstanceVariables(cesdk, employee);

  const blob = await cesdk.block.export(
    cesdk.block.findByType('page')[0],
    outputFormat
  );
  const sceneString = await cesdk.scene.saveToString();
  return { blob, sceneString };
};

export default CaseComponent;
