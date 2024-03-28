import React, { memo } from 'react';
import CESDKModal from '../CESDKModal/CESDKModal';

const EditTemplateCESDK = memo(
  ({ templateName, sceneString, onSave, onClose }) => {
    return (
      <CESDKModal
        onOutsideClick={onClose}
        configure={async (instance) => {
          instance.engine.editor.setSettingBool('page/title/show', false);
          await instance.engine.scene.loadFromString(sceneString);
        }}
        config={{
          license: process.env.REACT_APP_LICENSE,
          theme: 'dark',
          callbacks: {
            onSave: (sceneString) => {
              onSave(sceneString);
            },
            onBack: () => {
              onClose();
            },
            onUpload: 'local'
          },
          role: 'Creator',
          ui: {
            elements: {
              view: 'advanced',
              navigation: {
                title: `${templateName}`,
                action: {
                  back: true,
                  save: true
                }
              },
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
