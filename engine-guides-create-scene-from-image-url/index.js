import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.62.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.62.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  await engine.scene.createFromImage(
    'https://img.ly/static/ubq_samples/sample_4.jpg'
  );

  // Attach engine canvas to DOM
  document.getElementById('cesdk_container').append(engine.element);
});
