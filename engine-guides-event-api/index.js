// highlight-setup
import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.26.0-rc.0/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.26.0-rc.0/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').append(engine.element);

  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  // highlight-setup

  const block = engine.block.create('graphic');
  engine.block.setShape(block, engine.block.createShape('star'));
  engine.block.setFill(block, engine.block.createFill('color'));
  engine.block.appendChild(page, block);

  // highlight-subscribe
  let unsubscribe = engine.event.subscribe([block], (events) => {
    for (var i = 0; i < events.length; i++) {
      let event = events[i];
      // highlight-subscribe
      console.log('Event:', event.type, event.block);
      if (engine.block.isValid(event.block)) {
        console.log('Block type:', engine.block.getType(event.block));
      }
    }
  });

  await sleep(1000);
  engine.block.setRotation(block, 0.5 * Math.PI);
  await sleep(1000);
  engine.block.destroy(block);
  await sleep(1000);

  // highlight-unsubscribe
  unsubscribe();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
});
