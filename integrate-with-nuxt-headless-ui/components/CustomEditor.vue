<template>
  <div style="width: 100vw; height: 100vh; position: relative">
    <div ref="canvasRef" style="width: 100%; height: 100%"></div>
    <div style="position: absolute; top: 20px; left: 20px">
      <button @click="changeOpacity">Reduce Opacity</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CreativeEngine from '@cesdk/engine';

// DOM reference to hold the CE.SDK canvas
const canvasRef = ref(null);
let engine = null;
let imageBlockId = null;

onMounted(async () => {
  const config = {
    // license: import.meta.env.VITE_CESDK_LICENSE,
    userId: 'guides-user',
    // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEngine.version}/assets`,
    // Use local assets when developing with local packages
    ...(import.meta.env.CESDK_USE_LOCAL && {
      baseURL: '/assets/'
    })
  };

  engine = await CreativeEngine.init(config);

  // Attach engine element to DOM if needed
  if (canvasRef.value) {
    canvasRef.value.appendChild(engine.element);
  }

  // Create a scene programmatically
  const scene = await engine.scene.create();

  // Add blocks and manipulate content
  const page = engine.block.create('page');
  engine.block.setWidth(page, 800);
  engine.block.setHeight(page, 600);
  engine.block.appendChild(scene, page);

  // Add content to the scene
  imageBlockId = engine.block.create('graphic');
  engine.block.setShape(imageBlockId, engine.block.createShape('rect'));

  // fill the block with an image from a public source
  const imageFill = engine.block.createFill('image');
  engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
    {
      uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
      width: 1024,
      height: 683
    }
  ]);
  engine.block.setFill(imageBlockId, imageFill);
  engine.block.appendChild(page, imageBlockId);

  // zoom to fit the page in the editor view
  engine.scene.zoomToBlock(page);
});

const changeOpacity = () => {
  if (engine && imageBlockId != null) {
    // get the current opacity value of the image
    const currentOpacity = engine.block.getOpacity(imageBlockId);
    // reduce the opacity image by 20% at each click
    engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
  }
};
</script>

<style scoped>
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
  padding: 0.6em 0.6em;
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
  width: 150px;
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
