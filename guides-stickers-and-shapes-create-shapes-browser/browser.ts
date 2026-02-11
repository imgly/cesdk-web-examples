import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true,
    });
    await cesdk.actions.run('scene.create', {
      page: { width: 300, height: 200, unit: 'Pixel' },
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    const testGraphic = engine.block.create('graphic');
    engine.block.supportsShape(testGraphic); // Returns true

    const testText = engine.block.create('text');
    engine.block.supportsShape(testText); // Returns false

    engine.block.destroy(testText);
    engine.block.destroy(testGraphic);

    const rectGraphic = engine.block.create('graphic');
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(rectGraphic, rectShape);

    const redFill = engine.block.createFill('color');
    engine.block.setColor(redFill, 'fill/color/value', {
      r: 1.0,
      g: 0.0,
      b: 0.0,
      a: 1.0,
    });
    engine.block.setFill(rectGraphic, redFill);

    engine.block.setWidth(rectGraphic, 64);
    engine.block.setHeight(rectGraphic, 64);
    engine.block.appendChild(page, rectGraphic);
    engine.block.setPositionX(rectGraphic, 10);
    engine.block.setPositionY(rectGraphic, 10);

    const ellipseGraphic = engine.block.create('graphic');
    const ellipseShape = engine.block.createShape('ellipse');
    engine.block.setShape(ellipseGraphic, ellipseShape);

    const gradientFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
      { color: { r: 0.2, g: 0.6, b: 0.9, a: 1.0 }, stop: 0.0 },
      { color: { r: 0.9, g: 0.3, b: 0.6, a: 1.0 }, stop: 1.0 },
    ]);
    engine.block.setFill(ellipseGraphic, gradientFill);

    engine.block.setWidth(ellipseGraphic, 64);
    engine.block.setHeight(ellipseGraphic, 64);
    engine.block.appendChild(page, ellipseGraphic);
    engine.block.setPositionX(ellipseGraphic, 82);
    engine.block.setPositionY(ellipseGraphic, 10);

    // Discover what properties are available on a shape
    const exampleStarShape = engine.block.createShape('star');
    engine.block.findAllProperties(exampleStarShape);
    // Returns: ['shape/star/points', 'shape/star/innerDiameter', 'type', ...]
    engine.block.destroy(exampleStarShape);

    const starGraphic = engine.block.create('graphic');
    const starShape = engine.block.createShape('star');
    engine.block.setShape(starGraphic, starShape);

    engine.block.setInt(starShape, 'shape/star/points', 5);
    engine.block.setFloat(starShape, 'shape/star/innerDiameter', 0.5);

    const yellowFill = engine.block.createFill('color');
    engine.block.setColor(yellowFill, 'fill/color/value', {
      r: 1.0,
      g: 0.8,
      b: 0.0,
      a: 1.0,
    });
    engine.block.setFill(starGraphic, yellowFill);

    engine.block.setWidth(starGraphic, 64);
    engine.block.setHeight(starGraphic, 64);
    engine.block.appendChild(page, starGraphic);
    engine.block.setPositionX(starGraphic, 154);
    engine.block.setPositionY(starGraphic, 10);

    const polygonGraphic = engine.block.create('graphic');
    const polygonShape = engine.block.createShape('polygon');
    engine.block.setShape(polygonGraphic, polygonShape);

    engine.block.setInt(polygonShape, 'shape/polygon/sides', 8);

    const greenFill = engine.block.createFill('color');
    engine.block.setColor(greenFill, 'fill/color/value', {
      r: 0.2,
      g: 0.8,
      b: 0.3,
      a: 1.0,
    });
    engine.block.setFill(polygonGraphic, greenFill);

    engine.block.setWidth(polygonGraphic, 64);
    engine.block.setHeight(polygonGraphic, 64);
    engine.block.appendChild(page, polygonGraphic);
    engine.block.setPositionX(polygonGraphic, 226);
    engine.block.setPositionY(polygonGraphic, 10);

    const lineGraphic = engine.block.create('graphic');
    const lineShape = engine.block.createShape('line');
    engine.block.setShape(lineGraphic, lineShape);

    const purpleFill = engine.block.createFill('color');
    engine.block.setColor(purpleFill, 'fill/color/value', {
      r: 0.6,
      g: 0.2,
      b: 0.9,
      a: 1.0,
    });
    engine.block.setFill(lineGraphic, purpleFill);

    engine.block.setWidth(lineGraphic, 64);
    engine.block.setHeight(lineGraphic, 10);
    engine.block.appendChild(page, lineGraphic);
    engine.block.setPositionX(lineGraphic, 10);
    engine.block.setPositionY(lineGraphic, 109);

    const vectorPathGraphic = engine.block.create('graphic');
    const vectorPathShape = engine.block.createShape('vector_path');
    engine.block.setShape(vectorPathGraphic, vectorPathShape);

    engine.block.setString(
      vectorPathShape,
      'shape/vector_path/path',
      'M 0,0 L 100,50 L 0,100 Z',
    );

    const orangeFill = engine.block.createFill('color');
    engine.block.setColor(orangeFill, 'fill/color/value', {
      r: 1.0,
      g: 0.5,
      b: 0.0,
      a: 1.0,
    });
    engine.block.setFill(vectorPathGraphic, orangeFill);

    engine.block.setWidth(vectorPathGraphic, 64);
    engine.block.setHeight(vectorPathGraphic, 64);
    engine.block.appendChild(page, vectorPathGraphic);
    engine.block.setPositionX(vectorPathGraphic, 82);
    engine.block.setPositionY(vectorPathGraphic, 82);

    const roundedRectGraphic = engine.block.create('graphic');
    const roundedRectShape = engine.block.createShape('rect');
    engine.block.setShape(roundedRectGraphic, roundedRectShape);

    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusTL', 5.0);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusTR', 5.0);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusBL', 5.0);
    engine.block.setFloat(roundedRectShape, 'shape/rect/cornerRadiusBR', 5.0);

    const cyanFill = engine.block.createFill('color');
    engine.block.setColor(cyanFill, 'fill/color/value', {
      r: 0.0,
      g: 0.8,
      b: 0.8,
      a: 1.0,
    });
    engine.block.setFill(roundedRectGraphic, cyanFill);

    engine.block.setWidth(roundedRectGraphic, 64);
    engine.block.setHeight(roundedRectGraphic, 64);
    engine.block.appendChild(page, roundedRectGraphic);
    engine.block.setPositionX(roundedRectGraphic, 154);
    engine.block.setPositionY(roundedRectGraphic, 82);
  }
}

export default Example;
