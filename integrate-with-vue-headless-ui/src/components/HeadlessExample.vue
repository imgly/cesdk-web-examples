<template>
  <div ref="cesdkContainer" style="width: 100vw; height: 100vh"></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import CreativeEngine from '@cesdk/engine';

export default {
  name: 'HeadlessExample',
  setup() {
    const cesdkContainer = ref(null);

    onMounted(async () => {
      const config = {
        // license: 'YOUR_CESDK_LICENSE_KEY',
        // baseURL: `https://cdn.img.ly/packages/imgly/cesdk-js/${CreativeEngine.version}/assets`,
        userId: 'guides-user'
      };

      const engine = await CreativeEngine.init(config);

      // Attach engine element to DOM if needed
      if (cesdkContainer.value) {
        cesdkContainer.value.appendChild(engine.element);
      }

      // Create a scene programmatically
      const scene = await engine.scene.create();

      // Add blocks and manipulate content
      const page = engine.block.create('page');
      engine.block.setWidth(page, 800);
      engine.block.setHeight(page, 600);
      engine.block.appendChild(scene, page);

      // Add a graphic block with an image
      const graphic = engine.block.create('graphic');
      engine.block.setShape(graphic, engine.block.createShape('rect'));

      const imageFill = engine.block.createFill('image');
      engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
        {
          uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
          width: 1024,
          height: 683
        }
      ]);
      engine.block.setFill(graphic, imageFill);
      engine.block.appendChild(page, graphic);

      // Zoom to fit the page
      engine.scene.zoomToBlock(page);
    });

    return {
      cesdkContainer
    };
  }
};
</script>
