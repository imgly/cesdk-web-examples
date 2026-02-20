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
 * CE.SDK Plugin: Edit Text Guide
 *
 * Demonstrates text editing capabilities:
 * - Replacing and removing text content
 * - Applying formatting to text ranges
 * - Managing cursor position and selection
 * - Querying line information
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


    // Create a text block
    const text = engine.block.create("text");
    engine.block.appendChild(page, text);
    engine.block.setPositionX(text, 50);
    engine.block.setPositionY(text, 100);
    engine.block.setWidthMode(text, "Auto");
    engine.block.setHeightMode(text, "Auto");

    // Define a typeface with bold variant support
    const typeface = {
      name: "Roboto",
      fonts: [
        {
          uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf",
          subFamily: "Regular",
        },
        {
          uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf",
          subFamily: "Bold",
          weight: "bold" as const,
        },
      ],
    };

    // Set the font (required for bold weight support)
    engine.block.setFont(text, typeface.fonts[0].uri, typeface);

    // Replace the entire text content
    engine.block.replaceText(text, "Hello World!");

    // Replace "World" with "CE.SDK" (positions 6-11)
    engine.block.replaceText(text, "CE.SDK", 6, 11);

    // Insert " Guide" before the exclamation mark (position 12)
    engine.block.replaceText(text, " Guide", 12, 12);

    // Remove "Hello " to get "CE.SDK Guide!" (positions 0-6)
    engine.block.removeText(text, 0, 6);

    // Apply bold formatting to "CE.SDK" (positions 0-6)
    engine.block.setTextFontWeight(text, "bold", 0, 6);

    // Apply color to "Guide" (positions 7-12)
    engine.block.setTextColor(text, { r: 0.2, g: 0.6, b: 1.0, a: 1.0 }, 7, 12);

    // Set font size for the entire block
    engine.block.setTextFontSize(text, 240);

    // Query formatting properties
    const colors = engine.block.getTextColors(text);
    const weights = engine.block.getTextFontWeights(text);
    const sizes = engine.block.getTextFontSizes(text);

    console.log("Text colors:", colors);
    console.log("Font weights:", weights);
    console.log("Font sizes:", sizes);

    // Query line information
    const lineCount = engine.block.getTextVisibleLineCount(text);
    console.log("Line count:", lineCount);

    if (lineCount > 0) {
      const lineContent = engine.block.getTextVisibleLineContent(text, 0);
      console.log("First line content:", lineContent);

      const lineBounds = engine.block.getTextVisibleLineGlobalBoundingBoxXYWH(
        text,
        0
      );
      console.log("First line bounds:", lineBounds);
    }

    // Enable auto-fit zoom to keep the page visible when resizing
    engine.scene.zoomToBlock(page);
    engine.scene.enableZoomAutoFit(page, "Both", 40, 40);

    // Select the text block to show it in the inspector
    engine.block.select(text);
  }
}

export default Example;
