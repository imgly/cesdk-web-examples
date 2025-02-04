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
                show: true,
                format: ['image/png', 'application/pdf']
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
                show: true,
                format: ['image/png', 'application/pdf']
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
      // Begin standard template presets
      presets: {
        templates: {
          postcard_1: {
            label: 'Postcard Design',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.png`
          },
          postcard_2: {
            label: 'Postcard Tropical',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_2.png`
          },
          business_card_1: {
            label: 'Business card',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_business_card_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_business_card_1.png`
          },
          instagram_photo_1: {
            label: 'Instagram photo',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_photo_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_photo_1.png`
          },
          instagram_story_1: {
            label: 'Instagram story',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_story_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_instagram_story_1.png`
          },
          poster_1: {
            label: 'Poster',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_poster_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_poster_1.png`
          },
          presentation_4: {
            label: 'Presentation',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_presentation_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_presentation_1.png`
          },
          collage_1: {
            label: 'Collage',
            scene: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_collage_1.scene`,
            thumbnailURL: `https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_collage_1.png`
          }
        }
      }
      // End standard template presets
    };
    if (currentScene) {
      config.initialSceneString = currentScene;
    } else {
      config.initialSceneURL = `${window.location.protocol + "//" + window.location.host}/cases/placeholders/example.scene`;
    }
    if (cesdkContainer.current) {
      CreativeEditorSDK.init(cesdkContainer.current, config).then(
        (instance) => {
          if (disposed) {
            instance.dispose()
            return
          }
          _cesdk = instance
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources();
          cesdkRef.current = instance;
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
