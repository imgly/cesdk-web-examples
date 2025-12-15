import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Edit Shapes
 *
 * Demonstrates editing shapes programmatically in Node.js:
 * - Accessing and checking shape support
 * - Creating and setting shapes
 * - Replacing shapes with proper cleanup
 * - Querying shape properties
 * - Modifying shape-specific properties
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with page dimensions
  engine.scene.create('VerticalStack', {
    page: { size: { width: 400, height: 400 } }
  });
  const page = engine.block.findByType('page')[0];

  // Create a graphic block to work with
  const graphic = engine.block.create('graphic');
  const imageFill = engine.block.createFill('image');
  engine.block.setString(
    imageFill,
    'fill/image/imageFileURI',
    'https://img.ly/static/ubq_samples/sample_1.jpg'
  );
  engine.block.setFill(graphic, imageFill);
  engine.block.setWidth(graphic, 200);
  engine.block.setHeight(graphic, 200);
  engine.block.setPositionX(graphic, 100);
  engine.block.setPositionY(graphic, 100);
  engine.block.appendChild(page, graphic);

  // Check if a block supports shapes
  engine.block.supportsShape(graphic); // Returns true
  const text = engine.block.create('text');
  engine.block.supportsShape(text); // Returns false

  // Create a rectangular shape
  const rectShape = engine.block.createShape('rect');

  // Apply the shape to the graphic block
  engine.block.setShape(graphic, rectShape);

  // Retrieve the current shape and its type
  const shape = engine.block.getShape(graphic);
  const shapeType = engine.block.getType(shape);
  console.log(`Current shape type: ${shapeType}`);

  // Replace the shape with a star shape
  const starShape = engine.block.createShape('star');
  // Destroy the old shape before replacing to prevent memory leaks
  engine.block.destroy(engine.block.getShape(graphic));
  engine.block.setShape(graphic, starShape);
  /* The following line would also destroy the currently attached starShape */
  // engine.block.destroy(graphic);

  // Query all properties of the star shape
  const allShapeProperties = engine.block.findAllProperties(starShape);
  // Returns properties like "shape/star/innerDiameter" and "shape/star/points"
  console.log(`Found ${allShapeProperties.length} shape properties`);

  // Modify star-specific properties
  engine.block.setInt(starShape, 'shape/star/points', 5);
  engine.block.setFloat(starShape, 'shape/star/innerDiameter', 0.5);

  // Export the result to PNG
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blob = await engine.block.export(page, { mimeType: 'image/png' });
  const buffer = Buffer.from(await blob.arrayBuffer());
  writeFileSync(`${outputDir}/edit-shapes-result.png`, buffer);

  // eslint-disable-next-line no-console
  console.log('✓ Exported result to output/edit-shapes-result.png');
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
