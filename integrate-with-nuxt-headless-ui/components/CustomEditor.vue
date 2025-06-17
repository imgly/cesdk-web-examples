<template>
  <div style="width: 100vw; height: 100vh; position: relative">
    <div ref="canvasRef" style="width: 100%; height: 100%"></div>
    <div class="button-overlay">
      <div style="position: absolute; top: 20px; left: 20px">
        <button @click="changeOpacity">Reduce Opacity</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import CreativeEngine from "@cesdk/engine"

// DOM reference to hold the CE.SDK canvas
const canvasRef = ref(null)
// to keep track of the ID of the added image block
let imageBlockId = null
// to keep track of the CreativeEngine instance
let engine = null

onMounted(async () => {
  // CE.SDK configuration
  const config = {
    license:
      'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu', // replace it with your license key
    userId: 'guides-user',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.54.0-rc.1/assets'
  }

  // initialize CreativeEngine in headless mode
  engine = await CreativeEngine.init(config)

  // attach CE.SDK canvas to the DOM (optional)
  if (canvasRef.value) {
    canvasRef.value.appendChild(engine.element)
  }

  // get or create a new scene
  let scene = engine.scene.get()
  if (!scene) {
    scene = engine.scene.create()
    const page = engine.block.create("page")
    engine.block.appendChild(scene, page)
  }

  // get the first page block
  const [page] = engine.block.findByType("page")

  // create a graphic block and set its shape
  imageBlockId = engine.block.create("graphic")
  engine.block.setShape(imageBlockId, engine.block.createShape("rect"))

  // fill the graphic block with a public image
  const imageFill = engine.block.createFill("image")
  engine.block.setSourceSet(imageFill, "fill/image/sourceSet", [
    {
      uri: "https://img.ly/static/ubq_samples/sample_1_1024x683.jpg",
      width: 1024,
      height: 683
    }
  ])
  engine.block.setFill(imageBlockId, imageFill)
  engine.block.appendChild(page, imageBlockId)

  // zoom to fit the page in the canvas
  engine.scene.zoomToBlock(page)
})

// reduce the image opacity by 20% each click
function changeOpacity() {

  if (engine && imageBlockId != null) {
    // get the current opacity value on the image
    const currentOpacity = engine.block.getOpacity(imageBlockId)
    // reduce the image opacity by 20%
    engine.block.setOpacity(imageBlockId, currentOpacity * 0.8)
  }
}
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
  transition: border-color 0.25s, box-shadow 0.25s;
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
