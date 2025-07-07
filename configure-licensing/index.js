import CreativeEditorSDK from 'https://cdn.img.ly/packages/imgly/cesdk-js/1.55.0-rc.2/index.js';

let config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user' // Replace with your license key.
};

CreativeEditorSDK.create('#cesdk_container', config).then(async (instance) => {
  await instance.createDesignScene();
});
