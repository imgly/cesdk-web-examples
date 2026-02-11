import type { EditorPlugin, EditorPluginContext } from "@cesdk/cesdk-js";
import packageJson from "./package.json";

/**
 * CE.SDK Plugin: Text Styling Guide
 *
 * Demonstrates programmatic text styling capabilities:
 * - Editing text content
 * - Applying colors to character ranges
 * - Adding styled backgrounds
 * - Text case transformations
 * - Managing typefaces and fonts
 * - Toggling font weights and styles
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error("CE.SDK instance is required for this plugin");
    }

    // Initialize CE.SDK with Design mode and load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: "Design",
    });
    await cesdk.actions.run("scene.create", {
      page: { width: 800, height: 600, unit: "Pixel" },
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType("page")[0];


    // Create a text block to demonstrate styling
    const text = engine.block.create("text");
    engine.block.appendChild(page, text);
    engine.block.setPositionX(text, 100);
    engine.block.setPositionY(text, 100);
    engine.block.setWidthMode(text, "Auto");
    engine.block.setHeightMode(text, "Auto");

    // Edit text content using replaceText()
    engine.block.replaceText(text, "Hello World");

    // Add a "!" at the end by inserting at position 11
    engine.block.replaceText(text, "!", 11);

    // Replace "World" with "CE.SDK"
    engine.block.replaceText(text, "CE.SDK", 6, 11);

    // Remove "Hello " (first 6 characters)
    engine.block.removeText(text, 0, 6);

    // Apply colors to the entire text
    engine.block.setTextColor(text, { r: 1.0, g: 0.65, b: 0.0, a: 1.0 }); // Orange

    // Apply different color to a specific range (characters 0-2)
    engine.block.setTextColor(text, { r: 0.2, g: 0.6, b: 1.0, a: 1.0 }, 0, 2); // Blue

    // Enable and configure text background
    engine.block.setBool(text, "backgroundColor/enabled", true);

    // Set background color
    engine.block.setColor(text, "backgroundColor/color", {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0,
    }); // Light gray

    // Configure padding on all sides
    engine.block.setFloat(text, "backgroundColor/paddingLeft", 10);
    engine.block.setFloat(text, "backgroundColor/paddingRight", 10);
    engine.block.setFloat(text, "backgroundColor/paddingTop", 8);
    engine.block.setFloat(text, "backgroundColor/paddingBottom", 8);

    // Add rounded corners
    engine.block.setFloat(text, "backgroundColor/cornerRadius", 8);

    // Background inherits text block animations when writing style is 'Block'
    const animation = engine.block.createAnimation("slide");
    engine.block.setEnum(animation, "textAnimationWritingStyle", "Block");
    engine.block.setInAnimation(text, animation);

    // Apply text case transformation (doesn't modify the string value)
    engine.block.setTextCase(text, "Uppercase");

    // Define a typeface with multiple font variants
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
        {
          uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-Italic.ttf",
          subFamily: "Italic",
          style: "italic" as const,
        },
        {
          uri: "https://cdn.img.ly/assets/v2/ly.img.typeface/fonts/Roboto/Roboto-BoldItalic.ttf",
          subFamily: "Bold Italic",
          weight: "bold" as const,
          style: "italic" as const,
        },
      ],
    };

    // Change font and reset formatting
    engine.block.setFont(text, typeface.fonts[0].uri, typeface);

    engine.block.setTextFontSize(text, 320);

    // Toggle bold font weight
    if (engine.block.canToggleBoldFont(text)) {
      engine.block.toggleBoldFont(text);
    }

    // Toggle italic font style on a specific range
    if (engine.block.canToggleItalicFont(text, 0, 2)) {
      engine.block.toggleItalicFont(text, 0, 2);
    }

    // Zoom to show the text block
    engine.scene.zoomToBlock(text, { padding: 40 });

    // Select the text block to show it in the inspector
    engine.block.setSelected(text, true);
  }
}

export default Example;
