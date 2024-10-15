import React, { memo } from 'react';
import CESDKModal from '../CESDKModal/CESDKModal';

const EditInstanceCESDK = memo(({ sceneString, onClose, onSave }) => {
  return (
    <CESDKModal
      onOutsideClick={onClose}
      configure={async (instance) => {
        instance.ui.setDockOrder([
          ...instance.ui
            .getDockOrder()
            .filter(({ key }) => key !== 'ly.img.template')
        ]);
        await instance.engine.scene.loadFromString(sceneString);
      }}
      config={{
        callbacks: {
          onExport: 'download',
          onDownload: 'download',
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
            navigation: {
              action: {
                export: {
                  show: true,
                  format: ['image/png']
                },
                save: true,
                back: true,
                download: true
              }
            }
          }
        }
      }}
    />
  );
});

EditInstanceCESDK.displayName = 'EditInstanceCESDK';

export default EditInstanceCESDK;
