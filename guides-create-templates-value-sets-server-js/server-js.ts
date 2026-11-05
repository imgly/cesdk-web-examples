import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Value Sets
 *
 * Demonstrates the two layers of a variable value:
 * - Default values, which the scene saves and undo reverts
 * - Value sets, named alternative values that the scene saves
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);
    engine.block.appendChild(scene, page);

    // Scene variables belong to the scene. A save writes them, and undo reverts them.
    engine.variable.setString('first_name', 'Ada');
    engine.variable.setColor('accent', { r: 0.48, g: 0.23, b: 0.93, a: 1 });

    const card = engine.block.create('graphic');
    engine.block.setShape(card, engine.block.createShape('rect'));
    engine.block.setFill(card, engine.block.createFill('color'));
    engine.block.setWidth(card, 720);
    engine.block.setHeight(card, 520);
    engine.block.setPositionX(card, 40);
    engine.block.setPositionY(card, 40);
    engine.block.appendChild(page, card);
    const cardFill = engine.block.getFill(card);
    engine.block.setVariableBinding(cardFill, 'fill/color/value', 'accent');

    const text = engine.block.create('text');
    engine.block.replaceText(text, 'Hello {{first_name}}');
    engine.block.setPositionX(text, 80);
    engine.block.setPositionY(text, 80);
    engine.block.appendChild(page, text);

    // A value set holds alternative values for some scene variables.
    const longNames = engine.variable.createValueSet('Long names');
    engine.variable.setString('first_name', 'Maximiliane Huber-Schwarzenberg', {
      target: { valueSet: longNames }
    });
    console.log(engine.variable.findAllValueSets()); // [longNames]
    console.log(engine.variable.getValueSetName(longNames)); // 'Long names'

    // The active set wins over the default values in text, bound properties and getters.
    engine.variable.setActiveValueSet(longNames);
    console.log(engine.variable.getString('first_name')); // 'Maximiliane Huber-Schwarzenberg'
    console.log(engine.variable.getString('first_name', { target: 'Default' })); // 'Ada'
    // A variable that the set has no value for shows its default.
    console.log(engine.variable.getColor('accent')); // the purple default

    // A setter without a target writes the layer that the getter reads: the active set
    // when it holds the key, else the default value.
    engine.variable.setString('first_name', 'Maximiliane Huber');
    console.log(engine.variable.getString('first_name')); // 'Maximiliane Huber'
    console.log(engine.variable.getString('first_name', { target: 'Default' })); // 'Ada'
    engine.variable.setColor('accent', { r: 0.95, g: 0.45, b: 0.1, a: 1 });
    console.log(engine.block.getColor(cardFill, 'fill/color/value')); // the new orange default

    // Exports show the values of the active set, as the canvas does.
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    writeFileSync(
      `${outputDir}/value-sets.png`,
      Buffer.from(await blob.arrayBuffer())
    );
    console.log('Exported result to output/value-sets.png');

    // A save holds the default values, the value sets and the active set.
    const saved = await engine.scene.saveToString();
    await engine.scene.loadFromString(saved);
    // The scene saves the id of a set, so it stays the same across a load.
    console.log(engine.variable.getActiveValueSet() === longNames); // true
    console.log(engine.variable.findValueSetByName('Long names') === longNames); // true

    // A variable set while no scene exists waits for the next scene. That scene takes it over
    // its own value, for example to fill a template with the data of one record.
    engine.block.destroy(engine.scene.get()!);
    engine.variable.setString('city', 'Berlin');
    await engine.scene.loadFromString(saved);
    console.log(engine.variable.getString('city')); // 'Berlin'

    try {
      // A value set holds values only for variables of the scene.
      engine.variable.setString('missing', 'x', {
        target: { valueSet: longNames }
      });
    } catch (error) {
      const { code } = error as { code?: string };
      console.log(code); // 'BLOCK.VARIABLE_NOT_FOUND'
    }
    try {
      engine.variable.createValueSet('Long names');
    } catch (error) {
      const { code } = error as { code?: string };
      console.log(code); // 'BLOCK.VALUE_SET_NAME_TAKEN'
    }

    // Destroying the active set shows the default values again.
    engine.variable.destroyValueSet(longNames);
    console.log(engine.variable.getActiveValueSet()); // null
    console.log(engine.variable.getString('first_name')); // 'Ada'
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
