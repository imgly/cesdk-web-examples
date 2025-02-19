import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.6/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.10.6/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  // highlight-create
  let scene = await engine.scene.create();
  // highlight-create

  // highlight-add-page
  let page = engine.block.create("page");
  engine.block.appendChild(scene, page);
  // highlight-add-page
  
  // highlight-add-star
  let star = engine.block.create("shapes/star");
  engine.block.appendChild(page, star);
  // highlight-add-star
});
