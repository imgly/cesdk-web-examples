import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.16.1/index.js';

const config = {
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.16.1/assets'
};

CreativeEngine.init(config).then(
  async (engine) => {
    document.getElementById('root').appendChild(engine.element);

    // Add default assets used in scene.
    engine.addDefaultAssetSources();

    const scene = engine.scene.create();
    const text = engine.block.create('text');
    engine.block.appendChild(scene, text);
    engine.block.setWidthMode(text, 'Auto');
    engine.block.setHeightMode(text, 'Auto');

    // highlight-replaceText
    engine.block.replaceText(text, 'Hello World');
    // highlight-replaceText
    // highlight-replaceText-single-index
    // Add a "!" at the end of the text
    engine.block.replaceText(text, "!", 11);
    // highlight-replaceText-single-index
    // highlight-replaceText-range
    // Replace "World" with "Alex"
    engine.block.replaceText(text, "Alex", 6, 11);
    // highlight-replaceText-range

    engine.scene.zoomToBlock(text, 100, 100, 100, 100);

    // highlight-removeText
    // Remove the "Hello "
    engine.block.removeText(text, 0, 6)
    // highlight-removeText

    // highlight-setTextColor
    engine.block.setTextColor(text, { r: 1.0, g: 1.0, b: 0.0, a: 1.0 });
    // highlight-setTextColor
    // highlight-setTextColor-range
    engine.block.setTextColor(text, { r: 0.0, g: 0.0, b: 0.0, a: 1.0 }, 1, 4);
    // highlight-setTextColor-range
    // highlight-getTextColors
    const allColors = engine.block.getTextColors(text);
    // highlight-getTextColors
    // highlight-getTextColors-range
    const colorsInRange = engine.block.getTextColors(text, 2, 5);
    // highlight-getTextColors-range

    // highlight-getTextFontWeights
    const fontWeights = engine.block.getTextFontWeights(text);
    // highlight-getTextFontWeights

    // highlight-getTextFontStyles
    const fontStyles = engine.block.getTextFontStyles(text);
    // highlight-getTextFontStyles

    // highlight-setTextCase
    engine.block.setTextCase(text, 'Titlecase');
    // highlight-setTextCase

    // highlight-getTextCases
    const textCases = engine.block.getTextCases(text);
    // highlight-getTextCases
  }
);
