import CreativeEngine from '@cesdk/node';
import { LottieImporter } from '@imgly/lottie-importer';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config(); // Load .env file

/**
 * CE.SDK Server Guide: Import Lottie Animations
 *
 * Demonstrates how to import Lottie animations as editable blocks with
 * `@imgly/lottie-importer`:
 * - Importing the text of a Lottie `.json` file
 * - Reading the fallback layers and the slots of the import
 * - Changing a slot through its variable
 * - Reading the markers that the import adds to the scene
 * - Importing the bytes of a `.lottie` archive
 * - Saving the scene to a string, which needs the data: scheme
 * - Saving the result as a scene archive for other platforms
 */

const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
});

try {
  // The import adds its blocks to the current page.
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.setWidth(page, 1280);
  engine.block.setHeight(page, 720);
  engine.block.appendChild(scene, page);

  // fromJSON() takes the text of a Lottie .json file.
  const jsonPath = fileURLToPath(
    new URL('./assets/badge.json', import.meta.url)
  );
  const json = readFileSync(jsonPath, 'utf8');
  const badge = await LottieImporter.fromJSON(engine, json);

  // The group holds one block per layer, named after the layer.
  const layerNames = engine.block
    .getChildren(badge.block)
    .map((child) => engine.block.getName(child));
  console.log('Imported layers:', layerNames);

  // Layers without a native mapping play back from a video fill.
  for (const layer of badge.fallbackLayers) {
    console.log(
      `Layer ${layer.layerIndex} "${layer.name}" falls back: ${layer.reason}`
    );
  }

  // Each slot becomes a variable named after the slot id.
  for (const slot of badge.slots) {
    console.log(
      `Slot "${slot.id}" -> variables [${slot.variables.join(', ')}]`,
      slot.reason
    );
  }
  const brandSlot = badge.slots.find((slot) => slot.id === 'brand');
  const brandVariable = brandSlot?.variables[0];
  if (brandVariable !== undefined) {
    // Setting the variable recolors every fill that uses the slot.
    engine.variable.setColor(brandVariable, {
      r: 0.13,
      g: 0.55,
      b: 0.45,
      a: 1
    });
    console.log('Brand color:', engine.variable.getColor(brandVariable));
  }

  // Lottie markers become scene markers, in seconds.
  for (const marker of engine.scene.getMarkers()) {
    console.log(
      `Marker "${marker.name}" at ${marker.time}s for ${marker.duration}s`
    );
  }

  // fromFile() takes the bytes of a .json file or a .lottie archive.
  const dotLottiePath = fileURLToPath(
    new URL('./assets/badge.lottie', import.meta.url)
  );
  const archive = await LottieImporter.fromFile(
    engine,
    readFileSync(dotLottiePath)
  );
  console.log('Imported animation:', archive.animationId);
  console.log('Ignored archive entries:', archive.ignoredArchiveEntries);

  // The imported group is a regular block. Move it next to the first one.
  engine.block.setPositionX(
    archive.block,
    engine.block.getPositionX(archive.block) + 640
  );
  console.log('Page duration:', engine.block.getDuration(page), 'seconds');

  // Fallback layers play Lottie documents from data: URIs. saveToString()
  // keeps them only when 'data' is in the allowed resource schemes.
  const sceneString = await engine.scene.saveToString({
    allowedResourceSchemes: ['blob', 'bundle', 'data', 'file', 'http', 'https']
  });
  console.log('Saved scene string:', sceneString.length, 'characters');

  // A scene archive bundles the imported blocks with their resources, so
  // Android and iOS apps can load it without the importer.
  const sceneArchive = await engine.scene.saveToArchive();
  const outputDir = fileURLToPath(new URL('./output/', import.meta.url));
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(
    `${outputDir}badge.imgly`,
    Buffer.from(await sceneArchive.arrayBuffer())
  );
} finally {
  engine.dispose();
}
