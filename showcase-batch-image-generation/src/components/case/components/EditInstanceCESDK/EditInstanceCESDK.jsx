import React, { memo } from 'react';
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

const EditInstanceCESDK = memo(
  ({
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
        configure={async (instance) => {
          instance.engine.editor.setSetting('page/title/show', false);
          instance.engine.variable.setString('Department', department);
          instance.engine.variable.setString('FirstName', firstName);
          instance.engine.variable.setString('LastName', lastName);
          await instance.engine.scene.loadFromString(sceneString);
        }}
        config={{
          license: process.env.NEXT_PUBLIC_LICENSE,
          callbacks: {
            onExport: (blobs) => {
              localDownload(
                blobs[0],
                `${firstName}${lastName}${styleName}.png`
              );
            },
            onSave: (sceneString) => {
              onSave(sceneString);
            },
            onClose: () => {
              onClose();
            },
            onUpload: 'local'
          },
          role: 'Adopter',
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
                  close: true
                }
              }
            }
          }
        }}
      />
    );
  }
);

EditInstanceCESDK.displayName = 'EditInstanceCESDK';

export default EditInstanceCESDK;
