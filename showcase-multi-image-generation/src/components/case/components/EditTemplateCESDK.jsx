import React, { memo } from 'react';
import { CESDKModal } from './CESDKModal';

export const EditTemplateCESDK = memo(
  ({ templateName, sceneString, onSave, onClose }) => {
    return (
      <CESDKModal
        configure={async (instance) => {
          // change the position of the close button to the left
          const closeComponentId = 'ly.img.close.navigationBar';
          const navBarOrder = instance.ui.getNavigationBarOrder();
          const trimmedNavBarOrder = navBarOrder.filter(
            (item) => item.id !== closeComponentId
          );
          instance.ui.setNavigationBarOrder(
            [{ id: closeComponentId }].concat(trimmedNavBarOrder)
          );
          instance.engine.editor.setSettingBool('page/title/show', false);
          await instance.engine.scene.loadFromString(sceneString);
        }}
        config={{
          license: process.env.NEXT_PUBLIC_LICENSE,
          theme: 'dark',
          callbacks: {
            onSave: (sceneString) => {
              onSave(sceneString);
            },
            onClose: () => {
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
                  close: true,
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

EditTemplateCESDK.displayName = 'EditTemplateCESDK';

export default EditTemplateCESDK;
