import CreativeEngine from 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.37.0-rc.1/index.js';

const config = {
  license: 'vERESgSXbYj5Rs-FF4DzkMvhdQLh0Mxe6AD8V-doP6wqe_gmYmx_oUKqIlMkwpMu',
  userId: 'guides-user',
  baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.37.0-rc.1/assets'
};

CreativeEngine.init(config).then(async (engine) => {
  document.getElementById('cesdk_container').appendChild(engine.element);

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
  engine.block.replaceText(text, '!', 11);
  // highlight-replaceText-single-index
  // highlight-replaceText-range
  // Replace "World" with "Alex"
  engine.block.replaceText(text, 'Alex', 6, 11);
  // highlight-replaceText-range

  engine.scene.zoomToBlock(text, 100, 100, 100, 100);

  // highlight-removeText
  // Remove the "Hello "
  engine.block.removeText(text, 0, 6);
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

  // highlight-setTextCase
  engine.block.setTextCase(text, 'Titlecase');
  // highlight-setTextCase

  // highlight-getTextCases
  const textCases = engine.block.getTextCases(text);
  // highlight-getTextCases

  // highlight-setFont
  const typeface = {
    name: 'Roboto',
    fonts: [
      {
        uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf',
        subFamily: 'Bold',
        weight: 'bold'
      },
      {
        uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf',
        subFamily: 'Bold Italic',
        weight: 'bold',
        style: 'italic'
      },
      {
        uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf',
        subFamily: 'Italic',
        style: 'italic'
      },
      {
        uri: 'https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf',
        subFamily: 'Regular'
      }
    ]
  };
  engine.block.setFont(text, typeface.fonts[3].uri, typeface);
  // highlight-setFont

  // highlight-getTypeface
  const currentTypeface = engine.block.getTypeface(text);
  // highlight-getTypeface

  // highlight-toggleBold
  if (engine.block.canToggleBoldFont(text)) {
    engine.block.toggleBoldFont(text);
  }
  // highlight-toggleBold

  // highlight-toggleItalic
  if (engine.block.canToggleItalicFont(text)) {
    engine.block.toggleItalicFont(text);
  }
  // highlight-toggleItalic

  // highlight-getTextFontWeights
  const fontWeights = engine.block.getTextFontWeights(text);
  // highlight-getTextFontWeights

  // highlight-getTextFontStyles
  const fontStyles = engine.block.getTextFontStyles(text);
  // highlight-getTextFontStyles
});
