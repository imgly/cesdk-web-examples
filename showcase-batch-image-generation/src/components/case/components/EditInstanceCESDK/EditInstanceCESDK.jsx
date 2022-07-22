import React from 'react';
import CESDKModal from '../CESDKModal/CESDKModal';

const localDownload = (data, filename) => {
  return new Promise((resolve) => {
    const element = document.createElement('a');
    element.setAttribute('href', window.URL.createObjectURL(data));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    resolve();
  });
};

const EditInstanceCESDK = ({
  firstName,
  lastName,
  department,
  styleName,
  sceneString,
  onClose,
  onSave
}) => {
  return (
    <CESDKModal
      onOutsideClick={onClose}
      config={{
        initialSceneString: sceneString,
        callbacks: {
          onExport: (blobs) => {
            localDownload(blobs[0], `${firstName}${lastName}${styleName}.png`);
          },
          onSave: (sceneString) => {
            onSave(sceneString);
          },
          onBack: () => {
            onClose();
          }
        },
        role: 'Adopter',
        variables: {
          Department: {
            value: department
          },
          FirstName: {
            value: firstName
          },
          LastName: {
            value: lastName
          }
        },
        page: {
          title: {
            show: false
          }
        },
        ui: {
          elements: {
            navigation: {
              title: `${firstName} ${lastName} ${styleName}`,
              action: {
                export: {
                  show: true,
                  format: ['image/png']
                },
                save: true,
                back: true
              }
            },
            libraries: { template: false }
          }
        }
      }}
    />
  );
};

export default EditInstanceCESDK;
