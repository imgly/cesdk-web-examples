import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.63.1/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user' // Replace with your license key.
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  await instance.createDesignScene();
});
