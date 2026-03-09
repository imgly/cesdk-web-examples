import type { EditorPlugin, EditorPluginContext } from "@cesdk/cesdk-js";

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from "./package.json";

/**
 * CE.SDK Plugin: Adjust Text Spacing Guide
 *
 * Demonstrates programmatic text spacing capabilities:
 * - Letter spacing (tracking)
 * - Line height (leading)
 * - Paragraph spacing
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error("CE.SDK instance is required for this plugin");
    }

    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run("scene.create", {
      page: { width: 800, height: 600, unit: "Pixel" },
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType("page")[0];


    // Text block 1: Letter Spacing Demo
    const textLetterSpacing = engine.block.create("text");
    engine.block.appendChild(page, textLetterSpacing);
    engine.block.setPositionX(textLetterSpacing, 50);
    engine.block.setPositionY(textLetterSpacing, 30);
    engine.block.setWidth(textLetterSpacing, 700);
    engine.block.setHeightMode(textLetterSpacing, "Auto");
    engine.block.replaceText(textLetterSpacing, "CREATIVE STUDIO");
    engine.block.setTextFontSize(textLetterSpacing, 48);

    // Set letter spacing - controls space between characters
    // Positive values increase spacing, negative values tighten characters
    engine.block.setFloat(textLetterSpacing, "text/letterSpacing", 0.1);

    // Read current letter spacing value
    const letterSpacing = engine.block.getFloat(
      textLetterSpacing,
      "text/letterSpacing"
    );
    console.log("Letter spacing:", letterSpacing);

    // Text block 2: Line Height Demo
    const textLineHeight = engine.block.create("text");
    engine.block.appendChild(page, textLineHeight);
    engine.block.setPositionX(textLineHeight, 50);
    engine.block.setPositionY(textLineHeight, 150);
    engine.block.setWidth(textLineHeight, 700);
    engine.block.setHeightMode(textLineHeight, "Auto");
    engine.block.replaceText(
      textLineHeight,
      "Design your ideas\nBring them to life"
    );
    engine.block.setTextFontSize(textLineHeight, 48);

    // Set line height - controls vertical distance between lines
    // Values are multipliers of font size (1.5 = 150% of font size)
    engine.block.setFloat(textLineHeight, "text/lineHeight", 1.8);

    // Read current line height value
    const lineHeight = engine.block.getFloat(textLineHeight, "text/lineHeight");
    console.log("Line height:", lineHeight);

    // Text block 3: Paragraph Spacing Demo
    const textParagraphSpacing = engine.block.create("text");
    engine.block.appendChild(page, textParagraphSpacing);
    engine.block.setPositionX(textParagraphSpacing, 50);
    engine.block.setPositionY(textParagraphSpacing, 350);
    engine.block.setWidth(textParagraphSpacing, 700);
    engine.block.setHeightMode(textParagraphSpacing, "Auto");
    engine.block.replaceText(
      textParagraphSpacing,
      "Start Creating\nJoin Today"
    );
    engine.block.setTextFontSize(textParagraphSpacing, 48);

    // Set paragraph spacing - adds space after paragraph breaks
    engine.block.setFloat(textParagraphSpacing, "text/paragraphSpacing", 4);

    // Read current paragraph spacing value
    const paragraphSpacing = engine.block.getFloat(
      textParagraphSpacing,
      "text/paragraphSpacing"
    );
    console.log("Paragraph spacing:", paragraphSpacing);

    // Zoom to show all text blocks
    engine.scene.zoomToBlock(page, { padding: 40 });
  }
}

export default Example;
