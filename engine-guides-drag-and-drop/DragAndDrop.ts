import CreativeEngine from '@cesdk/engine';

async function dragAndDrop() {
  const engine = await CreativeEngine.init({
    // license: 'YOUR_CESDK_LICENSE_KEY'
  });
  // The canvas fills this container, so give the container a size.
  const container = document.getElementById('cesdk_container');
  if (container == null) throw new Error('The page has no #cesdk_container.');
  container.append(engine.element);

  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  // `addImage` adds each image to the current page, which is the only page so far.
  const first = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_1.jpg',
    { size: { width: 300, height: 300 } }
  );
  const second = await engine.block.addImage(
    'https://img.ly/static/ubq_samples/sample_2.jpg',
    { size: { width: 300, height: 300 } }
  );
  engine.block.setPositionX(first, 50);
  engine.block.setPositionY(first, 150);
  engine.block.setPositionX(second, 450);
  engine.block.setPositionY(second, 150);

  // A second page beside the first, for the placement examples.
  const placementPage = engine.block.create('page');
  engine.block.setWidth(placementPage, 800);
  engine.block.setHeight(placementPage, 600);
  engine.block.setPositionX(placementPage, 850);
  engine.block.appendChild(scene, placementPage);

  // One local source with one photo, standing in for your own asset library.
  engine.asset.addLocalSource('my-photos');
  engine.asset.addAssetToSource('my-photos', {
    id: 'photo',
    meta: {
      uri: 'https://img.ly/static/ubq_samples/sample_3.jpg',
      blockType: '//ly.img.ubq/graphic',
      fillType: '//ly.img.ubq/fill/image',
      width: 512,
      height: 341
    }
  });
  const { assets } = await engine.asset.findAssets('my-photos', {
    page: 0,
    perPage: 1
  });
  const [photo] = assets;

  await engine.scene.zoomToBlock(scene);

  // Users can now exchange the images of two blocks by dragging one onto the other.
  engine.editor.setSettingBool('dragToSwapFills/enabled', true);

  // How long the pointer stays pressed before the image lifts.
  // 0 lifts at once, which suits fixed layouts.
  engine.editor.setSettingFloat('dragToSwapFills/longPressDurationMs', 500);

  // A thumbnail in your own UI that the user can drag onto the canvas.
  const thumbnail = document.createElement('img');
  thumbnail.src = 'https://img.ly/static/ubq_samples/sample_3.jpg';
  thumbnail.width = 120;
  thumbnail.draggable = true;
  thumbnail.addEventListener('dragstart', (event) => {
    // Names the asset in the drag, so a drop on the canvas can place it.
    void engine.actions.run('asset.drag', { event, asset: photo });
  });
  document.body.append(thumbnail);

  // The engine runs this when a dragged asset is released on the canvas.
  engine.actions.register('asset.drop', async (drop) => {
    // A drag that carries no asset, such as a file from the desktop, has no ids.
    if (drop.sourceId === '' || drop.assetId === '') return;
    // A drop beside every page has nowhere to go.
    if (drop.target == null && drop.page == null) return;

    const asset = await engine.asset.fetchAsset(drop.sourceId, drop.assetId);
    if (asset == null) return;

    if (drop.target != null && engine.block.isValid(drop.target)) {
      // Replace the image of the block below the drop.
      await engine.asset.applyToBlock(drop.sourceId, asset, drop.target);
    } else if (drop.page != null && engine.block.isValid(drop.page)) {
      // Add the asset centered on the drop point, and select the new block.
      const block = await engine.asset.apply(drop.sourceId, asset, {
        placement: {
          parent: drop.page,
          center: { x: drop.pageX, y: drop.pageY }
        }
      });
      if (block == null) return;
      engine.block.select(block);
    } else {
      return;
    }
    // Make the drop one step that the user can undo.
    engine.editor.addUndoStep();
  });

  // Place the new block yourself. Both center values must be finite.
  const placed = await engine.asset.apply('my-photos', photo, {
    placement: { parent: placementPage, center: { x: 400, y: 200 } }
  });

  // The same placement, through the default behavior an asset source can call.
  const added = await engine.asset.defaultApplyAsset(photo, {
    placement: { parent: placementPage, center: { x: 400, y: 400 } }
  });

  // eslint-disable-next-line no-console
  console.log({ placed, added });
}

void dragAndDrop();
