import React, { memo } from 'react';
import { CESDKModal } from './CESDKModal';
import { fillTemplate } from '../lib/TemplateUtilities';

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

export const EditInstanceCESDK = memo(
  ({
    templateName,
    restaurantData,
    sceneString,
    onClose,
    onSave
  }) => {
    return (
      <CESDKModal
        configure={async (instance) => {
          instance.engine.editor.setSettingBool('page/title/show', false);
          fillTemplate(instance.engine, sceneString, restaurantData);
        }}
        config={{
          license: process.env.NEXT_PUBLIC_LICENSE,
          callbacks: {
            onExport: (blobs) => {
              localDownload(
                blobs[0],
                `${restaurantData.name}_${templateName}.png`
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
                title: `${restaurantData.name} - ${templateName}`,
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
