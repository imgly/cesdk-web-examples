import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.62.0-rc.2/index.js';

const blob = await fetch('https://img.ly/static/ubq_samples/sample_4.jpg').then(
  (response) => response.blob()
);
const objectURL = URL.createObjectURL(blob);

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.62.0-rc.2/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  const scene = await engine.scene.createFromImage(objectURL);

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
