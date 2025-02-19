// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.0-preview.0/index.js';

const config = {
  baseURL:
    'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.0-preview.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('root').append(engine.element);

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
    'https://cdn.img.ly/assets/v1/emoji/NotoColorEmoji.ttf'
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
  engine.block.setWidth(text, 50);
  engine.block.setHeight(text, 10);
  engine.block.appendChild(page, text);
  // highlight-add-text-with-emoji
});
