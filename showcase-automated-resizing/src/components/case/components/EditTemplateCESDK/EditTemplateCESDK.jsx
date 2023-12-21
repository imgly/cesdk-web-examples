import React, { memo } from 'react';
import CESDKModal from '../CESDKModal/CESDKModal';

const EditTemplateCESDK = memo(
  ({ templateName, sceneString, sceneUrl, onSave, onClose }) => {
    return (
      <CESDKModal
        onOutsideClick={onClose}
        configure={async (instance) => {
          instance.engine.editor.setSettingBool('page/title/show', false);
          if (sceneString) {
            await instance.engine.scene.loadFromString(sceneString);
          } else {
            await instance.engine.scene.loadFromURL(sceneUrl);
          }
        }}
        config={{
          theme: 'dark',
          callbacks: {
            onSave: (sceneString) => {
              onSave(sceneString);
            },
            onBack: () => {
              onClose();
            },
            onUpload: 'local',
            onDownload: 'local',
            onLoad: 'upload'
          },
          role: 'Creator',
          ui: {
            elements: {
              view: 'advanced',
              navigation: {
                title: `${templateName}`,
                action: {
                  back: true,
                  save: true,
                  download: true,
                  load: true
                }
              },
              libraries: { template: false },
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
              }
            }
          }
        }}
      />
    );
  }
);

export default EditTemplateCESDK;
