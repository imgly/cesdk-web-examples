import CreativeEditorSDK from '@cesdk/cesdk-js';
import SegmentedControl from 'components/ui/SegmentedControl/SegmentedControl';
import React, { useEffect, useRef, useState } from 'react';

const ROLE_OPTIONS = [
  {
    name: 'Creator',
    cesdkConfig: {
      theme: 'dark',
      role: 'Creator',
      ui: {
        elements: {
          dock: {
            iconSize: 'normal',
            hideLabels: true
          }
        }
      }
    }
  },
  { name: 'Adopter', cesdkConfig: { theme: 'light', role: 'Adopter' } }
];

const CaseComponent = () => {
  const cesdkContainer = useRef(null);
  const cesdkRef = useRef(null);
  const [currentRole, setCurrentRole] = useState('Creator');
  const [currentScene, setCurrentScene] = useState(null);

  useEffect(() => {
    const config = {
      ui: {
        elements: {
          panels: {
            settings: true
          },
          libraries: {
            template: false,
            panel: {
              insert: {
                floating: false
              },
              replace: {
                floating: false
              }
            }
          }
        }
      },
      ...ROLE_OPTIONS.find(({ name }) => name === currentRole).cesdkConfig
    };
    if (currentScene) {
      config.initialSceneString = currentScene;
    } else {
      config.initialSceneURL = `${window.location.protocol + "//" + window.location.host}/cases/placeholders/example.scene`;
    }
    if (cesdkContainer.current) {
      CreativeEditorSDK.init(cesdkContainer.current, config).then((cesdk) => {
        cesdkRef.current = cesdk;
      });
    }
    return () => {
      if (cesdkRef.current) {
        cesdkRef.current.dispose();
      }
    };
  }, [currentRole, currentScene, cesdkContainer]);

  return (
    <div className="flex flex-col" style={{ width: '100%' }}>
      <div className="caseHeader">
        <h3>Placeholders</h3>
        <p>
          In the <b>creator</b> role you can define placeholders and constraints
          for a template. <br /> As an <b>adopter</b>, you can adapt the
          template within those constraints.
        </p>
      </div>
      <div className="gap-sm flex flex-grow flex-col" style={{ minHeight: 0 }}>
        <div className="flex">
          <SegmentedControl
            options={ROLE_OPTIONS.map(({ name }) => ({
              value: name,
              label: name
            }))}
            value={currentRole}
            name="currentRole"
            onChange={async (value) => {
              const currentScene =
                await cesdkRef.current.engine.scene.saveToString();
              setCurrentScene(currentScene);
              setCurrentRole(value);
            }}
            size="md"
          />
        </div>
        <div style={wrapperStyle} key={currentRole + currentScene}>
          <div ref={cesdkContainer} style={cesdkStyle}></div>
        </div>
      </div>
    </div>
  );
};

const cesdkStyle = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '0.75rem',
  minHeight: 0
};

const wrapperStyle = {
  borderRadius: '0.75rem',
  display: 'flex',
  flexGrow: '1',
  flexShrink: '1',
  minHeight: 0,
  boxShadow:
    '0px 0px 2px rgba(0, 0, 0, 0.25), 0px 18px 18px -2px rgba(18, 26, 33, 0.12), 0px 7.5px 7.5px -2px rgba(18, 26, 33, 0.12), 0px 3.75px 3.75px -2px rgba(18, 26, 33, 0.12)'
};

export default CaseComponent;
