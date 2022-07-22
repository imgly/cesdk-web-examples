import CESDKModal from '../CESDKModal/CESDKModal';

const EditMockupCESDK = ({
  templateName,
  sceneString,
  sceneUrl,
  onSave,
  onClose
}) => {
  const sceneLoadingConfig = sceneString
    ? {
        initialSceneString: sceneString
      }
    : {
        initialSceneURL: sceneUrl
      };
  return (
    <CESDKModal
      onOutsideClick={onClose}
      config={{
        callbacks: {
          onSave: (sceneString) => {
            onSave(sceneString);
          },
          onBack: () => {
            onClose();
          }
        },
        role: 'Adopter',
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
        },
        ...sceneLoadingConfig
      }}
    />
  );
};
export default EditMockupCESDK;
