import CreativeEngine from "@cesdk/node";
import { config } from "dotenv";
import { writeFileSync, mkdirSync, existsSync } from "fs";

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Edit Text
 *
 * Demonstrates text editing capabilities:
 * - Replacing and removing text content
 * - Applying formatting to text ranges
 * - Querying text properties
 * - Querying line information
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create("VerticalStack", {
    page: { size: { width: 800, height: 600 } },
  });
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
      0,
    );
    console.log("First line bounds:", lineBounds);
  }

  // Zoom to fit the page
  engine.scene.zoomToBlock(page);

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: "image/png" });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync("output")) {
    mkdirSync("output");
  }

  // Save to file
  writeFileSync("output/text-edit.png", buffer);
  console.log("✅ Exported styled text to output/text-edit.png");
} finally {
  engine.dispose();
}
