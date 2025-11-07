import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.0/index.js';

const config = {
  // license: import.meta.env.VITE_CESDK_LICENSE,
  userId: 'guides-user'
  // baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.64.0-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  const uri = engine.editor.getSetting('defaultEmojiFontFileUri');
  // From a bundle
  engine.editor.setSetting(
    'defaultEmojiFontFileUri',
    'bundle://ly.img.cesdk/fonts/NotoColorEmoji.ttf'
  );
  // From a URL
  engine.editor.setSetting(
    'defaultEmojiFontFileUri',
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
