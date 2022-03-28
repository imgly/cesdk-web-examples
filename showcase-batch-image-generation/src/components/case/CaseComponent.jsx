import CreativeEngine from '@cesdk/cesdk-js/cesdk-engine.umd.js';
import classNames from 'classnames';
import SegmentedControl from 'components/ui/SegmentedControl/SegmentedControl';
import LoadingSpinner from 'components/ui/LoadingSpinner/LoadingSpinner';
import { TEAMS, STYLES, EMPLOYEES } from './data';
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

const caseAssetPath = (path, caseId = 'batch-image-generation') =>
  `${window.location.protocol + "//" + window.location.host}/cases/${caseId}${path}`;

const replaceImage = (cesdk, imageName, newUrl) => {
  const img = cesdk.block.findByName(imageName)[0];
  if (!img) {
    return;
  }
  cesdk.block.setString(img, 'image/imageFileURI', newUrl);
  cesdk.block.resetCrop(img);
};

const fillTemplate = (cesdk, team, employee) => {
  const backgroundPlane = cesdk.block.findByName('Background')[0];
  cesdk.block.setColorRGBA(
    backgroundPlane,
    'fill_color/value',
    team.primaryColor.r,
    team.primaryColor.g,
    team.primaryColor.b,
    1.0
  );
  replaceImage(
    cesdk,
    'Gradient',
    caseAssetPath(`/images/${team.gradientPath}`)
  );
  replaceImage(
    cesdk,
    'LogoSmall',
    caseAssetPath(`/images/${team.logoSmallPath}`)
  );
  replaceImage(cesdk, 'Logo', caseAssetPath(`/images/${team.logoBigPath}`));
  replaceImage(cesdk, 'Photo', caseAssetPath(`/images/${employee.imagePath}`));
  const { r, g, b } = team.textColor;
  cesdk.variable.setString('Department', employee.department || '');
  const departmentBlock = cesdk.block.findByName('Department')[0];
  cesdk.block.setColorRGBA(departmentBlock, 'fill_color/value', r, g, b, 0.6);

  cesdk.variable.setString('FirstName', employee.firstName || '');
  const firstNameBlock = cesdk.block.findByName('FirstName')[0];
  cesdk.block.setColorRGBA(firstNameBlock, 'fill_color/value', r, g, b, 1.0);

  cesdk.variable.setString('LastName', employee.lastName || '');
  const lastNameBlock = cesdk.block.findByName('LastName')[0];
  cesdk.block.setColorRGBA(lastNameBlock, 'fill_color/value', r, g, b, 1.0);

  cesdk.block.setString(departmentBlock, 'text/fontFileUri', team.fontMedium);
  cesdk.block.setString(firstNameBlock, 'text/fontFileUri', team.fontMedium);
  cesdk.block.setString(lastNameBlock, 'text/fontFileUri', team.fontBold);
};

const CaseComponent = () => {
  const engineRef = useRef(null);

  const [currentTeam, setCurrentTeam] = useState();
  const [currentStyle, setCurrentStyle] = useState(STYLES[0]);
  const [teamImages, setTeamImages] = useState(new Array(12).fill(null));
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const config = {
      license: process.env.REACT_APP_LICENSE,
      page: {
        title: {
          show: false
        }
      }
    };
    if (navigator.userAgent !== 'ReactSnap') {
      CreativeEngine.init(config).then(async (instance) => {
        await instance.scene.loadFromURL(
          caseAssetPath(`/${currentStyle.sceneFile}`)
        );
        engineRef.current = instance;
        setInitialized(true);
      });
    }

    return function shutdownCreativeEngine() {
      engineRef?.current?.dispose();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function renderTeam() {
      const cesdk = engineRef?.current;
      if (initialized && cesdk && currentTeam) {
        if (!currentTeam) {
          return;
        }
        // set image loading state
        setTeamImages((oldImages) => [
          ...oldImages.map((image) => ({ ...image, isLoading: true }))
        ]);
        // prepare scene
        await cesdk.scene.loadFromURL(
          caseAssetPath(`/${currentStyle.sceneFile}`)
        );
        // prepare data
        const employees = EMPLOYEES.filter(
          (employee) => employee.team === currentTeam.name
        );
        for (const [index, employee] of employees.entries()) {
          fillTemplate(cesdk, currentTeam, employee);

          const blob = await cesdk.block.export(
            cesdk.block.findByType('scene')[0],
            currentStyle.outputFormat
          );
          setTeamImages((oldImages) => {
            oldImages[index] = {
              isLoading: false,
              src: URL.createObjectURL(blob)
            };
            return [...oldImages];
          });
          // Allow react to render
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
    }
    renderTeam();
  }, [currentTeam, currentStyle, engineRef, initialized]);

  return (
    <div className="flex flex-col items-center">
      <Helmet>
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
      <div style={{ paddingTop: '2rem' }}>
        <h3 className="h4" style={headlineStyle}>
          Generate Team Cards
        </h3>
        <div className="flex flex-row items-center space-x-2">
          <div className="select-wrapper flex-grow" style={{ minWidth: 190 }}>
            <select
              name="currentTeam"
              id="currentTeam"
              className={classNames(
                'select',
                !currentTeam?.name && 'select--placeholder'
              )}
              value={currentTeam?.name || 'placeholder'}
              onChange={(e) =>
                setCurrentTeam(
                  TEAMS.find(
                    (currentTeam) => currentTeam.name === e.target.value
                  )
                )
              }
            >
              <option value="placeholder" disabled>
                Select Company
              </option>
              {TEAMS.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <SegmentedControl
            options={STYLES.map(({ name }) => ({
              value: name,
              label: name
            }))}
            value={currentStyle.name}
            name="currentStyle"
            onChange={(value) => {
              const style = STYLES.find((style) => style.name === value);
              if (style.name !== currentStyle.name) {
                setTeamImages(new Array(12).fill(null));
                setCurrentStyle(style);
              }
            }}
            size="md"
          />
        </div>
      </div>
      <div style={contentWrapper}>
        <div style={imageWrapper}>
          {teamImages.map((image, index) => {
            const placeholderSrc = caseAssetPath(
              `/images/${currentStyle.placeholderPath}`
            );
            const placeholderSrc2 = caseAssetPath(
              `/images/${currentStyle.placeholder2xPath}`
            );
            return (
              <div style={{ width: currentStyle.width, position: 'relative' }}>
                <img
                  key={index}
                  alt=""
                  src={image?.src || placeholderSrc}
                  srcSet={`${image?.src || placeholderSrc} 1x, ${
                    image?.src || placeholderSrc2
                  } 2x`}
                  style={{
                    opacity: image?.isLoading ? 0.5 : 1,
                    transition: 'opacity .5s',
                    transitionTimingFunction: 'ease-in-out',
                    maxWidth: Math.max(...STYLES.map(({ width }) => width)),
                    maxHeight: Math.max(...STYLES.map(({ height }) => height)),
                    objectFit: 'contain'
                  }}
                />
                {image?.isLoading && <LoadingSpinner />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const contentWrapper = {
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const imageWrapper = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2rem',
  marginTop: '2rem',
  overflow: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: '1',
  maxWidth: '800px'
};

const headlineStyle = {
  marginBottom: '1rem',
  color: 'white',
  textAlign: 'center'
};
export default CaseComponent;
