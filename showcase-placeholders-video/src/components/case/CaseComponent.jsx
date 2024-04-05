import CreativeEditorSDK from '@cesdk/cesdk-js';
import SegmentedControl from 'components/ui/SegmentedControl/SegmentedControl';
import React, { useEffect, useRef, useState } from 'react';

const ROLE_OPTIONS = [
  {
    name: 'Creator',
    cesdkConfig: {
      theme: 'dark',
      role: 'Creator',
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          view: 'advanced',
          panels: {
            inspector: {
              show: true,
              position: 'right'
            },
            settings: true
          },
          dock: {
            iconSize: 'normal',
            hideLabels: true
          },
          navigation: {
            action: {
              export: {
                show: true
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Adopter',
    cesdkConfig: {
      theme: 'light',
      role: 'Adopter',
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          panels: {
            settings: true
          },
          navigation: {
            action: {
              export: {
                show: true
              }
            }
          }
        }
      }
    }
  }
];

const CaseComponent = () => {
  const cesdkContainer = useRef(null);
  const cesdkRef = useRef(null);
  const [currentRole, setCurrentRole] = useState('Creator');
  const [currentScene, setCurrentScene] = useState(null);

  useEffect(() => {
    let disposed = false;
    let _cesdk;
    const config = {
      ...ROLE_OPTIONS.find(({ name }) => name === currentRole).cesdkConfig,
      license: process.env.REACT_APP_LICENSE
    };
    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          if (disposed) {
            instance.dispose();
            return;
          }
          _cesdk = instance;
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({ sceneMode: 'Video' });
          cesdkRef.current = instance;
          if (currentScene) {
            await instance.loadFromString(currentScene);
          } else {
            await instance.loadFromURL(
              `${window.location.protocol + "//" + window.location.host}/cases/placeholders-video/example.scene`
            );
          }
        }
      );
    }
    return () => {
      disposed = true;
      _cesdk?.dispose();
      cesdkRef.current = null;
    };
  }, [currentRole, currentScene, cesdkContainer]);

  return (
    <div className="gap-sm flex flex-grow flex-col">
      <div className="flex  w-full flex-col items-center">
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
      <div style={cesdkWrapperStyle} key={currentRole + currentScene}>
        <div ref={cesdkContainer} style={cesdkStyle}></div>
      </div>
    </div>
  );
};

const cesdkStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

const cesdkWrapperStyle = {
  position: 'relative',
  minHeight: '640px',
  overflow: 'hidden',
  flexGrow: 1,
  display: 'flex',
  borderRadius: '0.75rem',
  boxShadow:
    '0px 0px 2px rgba(22, 22, 23, 0.25), 0px 4px 6px -2px rgba(22, 22, 23, 0.12), 0px 2px 2.5px -2px rgba(22, 22, 23, 0.12), 0px 1px 1.75px -2px rgba(22, 22, 23, 0.12)'
};

export default CaseComponent;
