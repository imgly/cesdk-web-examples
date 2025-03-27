import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.48.0-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.48.0-rc.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  let uri = engine.editor.getSettingString('ubq://defaultEmojiFontFileUri');
  // From a bundle
  engine.editor.setSettingString(
    'ubq://defaultEmojiFontFileUri',
    'bundle://ly.img.cesdk/fonts/NotoColorEmoji.ttf'
  );
  // From a URL
  engine.editor.setSettingString(
    'ubq://defaultEmojiFontFileUri',
    'https://cdn.img.ly/assets/v2/emoji/NotoColorEmoji.ttf'
  );

  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  engine.scene.zoomToBlock(page, 40, 40, 40, 40);

  const text = engine.block.create('text');
  engine.block.setString(text, 'text/text', 'Text with an emoji 🧐');
  engine.block.setWidthMode(text, 'Auto');
  engine.block.setHeightMode(text, 'Auto');
  engine.block.appendChild(page, text);
});
