// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.36.0-rc.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.29.0/assets'
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
  // highlight-setup

  // highlight-supportsAnimation
  if (!engine.block.supportsAnimation(graphic)) {
    return;
  }
  // highlight-supportsAnimation

  // highlight-createAnimation
  const slideInAnimation = engine.block.createAnimation('slide');
  const breathingLoopAnimation = engine.block.createAnimation('breathing_loop');
  const fadeOutAnimation = engine.block.createAnimation('fade');
  // highlight-createAnimation
  // highlight-setInAnimation
  engine.block.setInAnimation(graphic, slideInAnimation);
  // highlight-setInAnimation
  // highlight-setLoopAnimation
  engine.block.setLoopAnimation(graphic, breathingLoopAnimation);
  // highlight-setLoopAnimation
  // highlight-setOutAnimation
  engine.block.setOutAnimation(graphic, fadeOutAnimation);
  // highlight-setOutAnimation
  // highlight-getAnimation
  const animation = engine.block.getLoopAnimation(graphic);
  const animationType = engine.block.getType(animation);
  // highlight-getAnimation

  // highlight-replaceAnimation
  const squeezeLoopAnimation = engine.block.createAnimation('squeeze_loop');
  engine.block.destroy(engine.block.getLoopAnimation(graphic));
  engine.block.setLoopAnimation(graphic, squeezeLoopAnimation);
  /* The following line would also destroy all currently attached animations */
  // engine.block.destroy(graphic);
  // highlight-replaceAnimation

  // highlight-getProperties
  const allAnimationProperties = engine.block.findAllProperties(slideInAnimation);
  // highlight-getProperties
  // highlight-modifyProperties
  engine.block.setFloat(slideInAnimation, 'animation/slide/direction', 0.5 * Math.PI);
  // highlight-modifyProperties
  // highlight-changeDuration
  engine.block.setDuration(slideInAnimation, 0.6);
  // highlight-changeDuration
  // highlight-changeEasing
  engine.block.setEnum(slideInAnimation, 'animationEasing', 'EaseOut');
  console.log("Available easing options:", engine.block.getEnumValues('animationEasing'));
  // highlight-changeEasing

  engine.block.setPlaying(page, true);
  engine.block.setLooping(page, true);
});
