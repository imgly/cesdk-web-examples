import React from 'react';
import CESDKModal from '../CESDKModal/CESDKModal';

const EditTemplateCESDK = ({ templateName, sceneString, onSave, onClose }) => {
  return (
    <CESDKModal
      onOutsideClick={onClose}
      config={{
        theme: 'dark',
        initialSceneString: sceneString,
        callbacks: {
          onSave: (sceneString) => {
            onSave(sceneString);
          },
          onBack: () => {
            onClose();
          }
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
        },
        page: {
          title: {
            show: false
          }
        }
      }}
    />
  );
};

export default EditTemplateCESDK;
