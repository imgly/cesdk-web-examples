import type { EditorPlugin,EditorPluginContext } from "@cesdk/cesdk-js";

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
 * CE.SDK Plugin: Text Decorations Guide
 *
 * Demonstrates text decoration capabilities:
 * - Toggling underline, strikethrough, and overline
 * - Querying current decorations
 * - Setting custom decoration styles, colors, and thickness
 * - Applying decorations to character ranges
 * - Combining multiple decoration types
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
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ["ly.img.image.upload"] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          "ly.img.templates.blank.*",
          "ly.img.templates.presentation.*",
          "ly.img.templates.print.*",
          "ly.img.templates.social.*",
          "ly.img.image.*",
        ],
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


    // Create a text block to demonstrate decorations
    const text = engine.block.create("text");
    engine.block.appendChild(page, text);
    engine.block.setPositionX(text, 100);
    engine.block.setPositionY(text, 100);
    engine.block.setWidthMode(text, "Auto");
    engine.block.setHeightMode(text, "Auto");
    engine.block.replaceText(text, "Hello CE.SDK");

    // Toggle underline on the entire text
    engine.block.toggleTextDecorationUnderline(text);

    // Toggle strikethrough on the entire text
    engine.block.toggleTextDecorationStrikethrough(text);

    // Toggle overline on the entire text
    engine.block.toggleTextDecorationOverline(text);

    // Calling toggle again removes the decoration
    engine.block.toggleTextDecorationOverline(text);
    // Query the current decoration configurations
    // Returns a list of unique TextDecorationConfig objects in the range
    const decorations = engine.block.getTextDecorations(text);
    // Each config contains: lines, style, underlineColor, underlineThickness, underlineOffset, skipInk

    // Set a specific decoration style
    // Available styles: 'Solid', 'Double', 'Dotted', 'Dashed', 'Wavy'
    engine.block.setTextDecoration(text, {
      lines: ["Underline"],
      style: "Dashed",
    });

    // Set a custom underline color (only applies to underlines)
    // Strikethrough and overline always use the text color
    engine.block.setTextDecoration(text, {
      lines: ["Underline"],
      underlineColor: { r: 1, g: 0, b: 0, a: 1 },
    });

    // Adjust the underline thickness
    // Default is 1.0, values above 1.0 make the line thicker
    engine.block.setTextDecoration(text, {
      lines: ["Underline"],
      underlineThickness: 2.0,
    });

    // Adjust the underline position relative to the font default
    // 0 = font default, positive values move further from baseline, negative values move closer
    engine.block.setTextDecoration(text, {
      lines: ["Underline"],
      underlineOffset: 0.1,
    });

    // Apply decorations to a specific character range using UTF-16 indices
    // Toggle underline on characters 0-5 ("Hello")
    engine.block.toggleTextDecorationUnderline(text, 0, 5);

    // Set strikethrough on characters 6-12 ("CE.SDK")
    engine.block.setTextDecoration(text, { lines: ["Strikethrough"] }, 6, 12);

    // Query decorations in a specific range
    const subrangeDecorations = engine.block.getTextDecorations(text, 0, 5);

    // Combine multiple decoration lines on the same text
    // All active lines share the same style and thickness
    engine.block.setTextDecoration(text, {
      lines: ["Underline", "Strikethrough"],
      style: "Solid",
    });

    // Remove all decorations
    engine.block.setTextDecoration(text, { lines: ["None"] });

    // Select the text block to show it in the inspector
    engine.block.setSelected(text, true);

    // Suppress unused variable warnings
    void decorations;
    void subrangeDecorations;
  }
}

export default Example;
