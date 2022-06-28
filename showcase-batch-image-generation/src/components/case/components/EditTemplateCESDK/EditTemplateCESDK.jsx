import React from 'react';
import CESDKModal from '../CESDKModal/CESDKModal';

const EditTemplateCESDK = ({ templateName, sceneString, onSave, onClose }) => {
  return (
    <CESDKModal
      onOutsideClick={onClose}
      config={{
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
            navigation: {
              title: `${templateName}`,
              action: {
                back: true,
                save: true
              }
            },
            libraries: { template: false }
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
