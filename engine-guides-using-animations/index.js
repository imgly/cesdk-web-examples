import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.48.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.33.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  const scene = engine.scene.createVideo();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1920);
  engine.block.setHeight(page, 1080);
  engine.block.appendChild(scene, page);

  engine.editor.setSettingColor('clearColor', { r: 0.2, g: 0.2, b: 0.2, a: 1 });

  const graphic = engine.block.create('graphic');
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://cdn.img.ly/assets/v3/ly.img.sticker/images/emoticons/imgly_sticker_emoticons_star.svg'
  );
  engine.block.setFill(graphic, imageFill);
  engine.block.setShape(graphic, engine.block.createShape('rect'));
  engine.block.setWidth(graphic, 500);
  engine.block.setHeight(graphic, 500);
  engine.block.setPositionX(graphic, (1920 - 500) / 2);
  engine.block.setPositionY(graphic, (1080 - 500) / 2);
  engine.block.appendChild(page, graphic);

  engine.scene.zoomToBlock(page, 60, 60, 60, 60);

  if (!engine.block.supportsAnimation(graphic)) {
    return;
  }

  const slideInAnimation = engine.block.createAnimation('slide');
  const breathingLoopAnimation = engine.block.createAnimation('breathing_loop');
  const fadeOutAnimation = engine.block.createAnimation('fade');
  engine.block.setInAnimation(graphic, slideInAnimation);
  engine.block.setLoopAnimation(graphic, breathingLoopAnimation);
  engine.block.setOutAnimation(graphic, fadeOutAnimation);
  const animation = engine.block.getLoopAnimation(graphic);
  const animationType = engine.block.getType(animation);

  const squeezeLoopAnimation = engine.block.createAnimation('squeeze_loop');
  engine.block.destroy(engine.block.getLoopAnimation(graphic));
  engine.block.setLoopAnimation(graphic, squeezeLoopAnimation);
  /* The following line would also destroy all currently attached animations */
  // engine.block.destroy(graphic);

  const allAnimationProperties = engine.block.findAllProperties(slideInAnimation);
  engine.block.setFloat(slideInAnimation, 'animation/slide/direction', 0.5 * Math.PI);
  engine.block.setDuration(slideInAnimation, 0.6);
  engine.block.setEnum(slideInAnimation, 'animationEasing', 'EaseOut');
  console.log("Available easing options:", engine.block.getEnumValues('animationEasing'));

  const text = engine.block.create('text');
  const textAnimation = engine.block.createAnimation('baseline');
  engine.block.setInAnimation(text, textAnimation);
  engine.block.appendChild(page, text);
  engine.block.setPositionX(text, 100);
  engine.block.setPositionY(text, 100);
  engine.block.setWidthMode(text, 'Auto');
  engine.block.setHeightMode(text, 'Auto');
  engine.block.replaceText(text, "You can animate text\nline by line,\nword by word,\nor character by character\nwith CE.SDK");
  engine.block.setEnum(textAnimation, 'textAnimationWritingStyle', 'Word');
  engine.block.setDuration(textAnimation, 2.0);
  engine.block.setEnum(textAnimation, 'animationEasing', 'EaseOut');

  const text2 = engine.block.create('text');
  const textAnimation2 = engine.block.createAnimation('pan');
  engine.block.setInAnimation(text2, textAnimation2);
  engine.block.appendChild(page, text2);
  engine.block.setPositionX(text2, 100);
  engine.block.setPositionY(text2, 500);
  engine.block.setWidth(text2, 500);
  engine.block.setHeightMode(text2, 'Auto');
  engine.block.replaceText(text2, "You can use the textAnimationOverlap property to control the overlap between text animation segments.");
  engine.block.setFloat(textAnimation2, 'textAnimationOverlap', 0.4);
  engine.block.setDuration(textAnimation2, 1.0);
  engine.block.setEnum(textAnimation2, 'animationEasing', 'EaseOut');

  engine.block.setPlaying(page, true);
  engine.block.setLooping(page, true);
});
