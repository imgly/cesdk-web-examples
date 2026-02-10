<script>
  import { onMount } from 'svelte';
  import CreativeEngine from '@cesdk/engine';

  // to store the DOM container where the CreativeEngine canvas will be attached
  let canvasContainer;
  // to store the CreativeEngine instance
  let engine;
  // to store the ID of the image block added to the scene
  let imageBlockId = null;

  onMount(async () => {

    const config = {
      // license: import.meta.env.VITE_CESDK_LICENSE,
      // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-engine/${CreativeEngine.version}/assets`,
      userId: 'guides-user',
    };

    engine = await CreativeEngine.init(config);

    // Attach engine element to DOM if needed
    if (canvasContainer && engine.element) {
      canvasContainer.appendChild(engine.element);
    }

    // Create a scene programmatically
    const scene = await engine.scene.create();

    // Add blocks and manipulate content
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Add content to the scene
    const imageBlock = engine.block.create('graphic');
    imageBlockId = imageBlock;
    engine.block.setShape(imageBlock, engine.block.createShape('rect'));

    const imageFill = engine.block.createFill('image');
    engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
      {
        uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
        width: 1024,
        height: 683
      }
    ]);
    engine.block.setFill(imageBlock, imageFill);
    engine.block.appendChild(page, imageBlock);

    engine.scene.zoomToBlock(page);
  });

  // callback to change the opacity of the image
  function changeOpacity() {
    if (engine && imageBlockId != null) {
      const currentOpacity = engine.block.getOpacity(imageBlockId);
      engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
    }
  }
</script>

<div class="editor-container">
  <div class="canvas-container" bind:this={canvasContainer}></div>
  <div class="button-overlay">
    <button on:click={changeOpacity}>Reduce Opacity</button>
  </div>
</div>

<style>
  .editor-container {
    width: 100vw;
    height: 100vh;
    position: relative;
  }

  .canvas-container {
    width: 100%;
    height: 100%;
  }

  .button-overlay {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .button-overlay button {
    border-radius: 8px;
    border: 1px solid #ccc;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #ffffff;
    color: #1a1a1a;
    cursor: pointer;
    transition:
      border-color 0.25s,
      box-shadow 0.25s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .button-overlay button:hover {
    border-color: #646cff;
    box-shadow: 0 4px 10px rgba(100, 108, 255, 0.2);
  }

  .button-overlay button:focus,
  .button-overlay button:focus-visible {
    outline: 2px solid #646cff;
    outline-offset: 2px;
  }
</style>
