import { writeFile } from "fs/promises";
import CreativeEngine from "@cesdk/node";

const { MimeType } = CreativeEngine as any;

// Configuration for the engine
const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-node/1.55.0-rc.1/assets'
};

// Initialize CE.SDK Engine
CreativeEngine.init(config).then(async (engine) => {
  console.log("CE.SDK Engine initialized");

  try {
    // Load default assets
    await engine.addDefaultAssetSources();

    // Load a scene from a URL
    await engine.scene.loadFromURL(
      "https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_instagram_photo_1.scene"
    );

    // Find the first page in the scene
    const [page] = engine.block.findByType("page");

    // Export the scene as a PNG image
    const blob = await engine.block.export(page, MimeType.Png);
    const arrayBuffer = await blob.arrayBuffer();

    // Save the exported image to the file system
    await writeFile("./example-output.png", Buffer.from(arrayBuffer));

    console.log("Export completed: example-output.png");
  } catch (error) {
    console.error("Error processing scene:", error);
  } finally {
    // Dispose of the engine to free resources
    engine.dispose();
  }
});

