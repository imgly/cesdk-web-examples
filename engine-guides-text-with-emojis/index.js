// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.35.0-rc.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.35.0-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  // highlight-change-default-emoji-font
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
  // highlight-change-default-emoji-font

  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  engine.scene.zoomToBlock(page, 40, 40, 40, 40);

  // highlight-add-text-with-emoji
  const text = engine.block.create('text');
  engine.block.setString(text, 'text/text', 'Text with an emoji 🧐');
  engine.block.setWidthMode(text, 'Auto');
  engine.block.setHeightMode(text, 'Auto');
  engine.block.appendChild(page, text);
  // highlight-add-text-with-emoji
});
