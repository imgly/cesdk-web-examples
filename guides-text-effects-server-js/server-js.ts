import CreativeEngine from "@cesdk/node";
import { config } from "dotenv";
import { writeFileSync, mkdirSync, existsSync } from "fs";

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Text Effects
 *
 * Demonstrates applying visual effects to text blocks:
 * - Drop shadows for depth
 * - Outline effect for text borders
 */

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

try {
  // Create a design scene with specific page dimensions
  engine.scene.create("VerticalStack", {
    page: { size: { width: 800, height: 500 } },
  });
  const page = engine.block.findByType("page")[0];

  // Create a text block with drop shadow
  const shadowText = engine.block.create("text");
  engine.block.replaceText(shadowText, "Drop Shadow");
  engine.block.setTextFontSize(shadowText, 90);
  engine.block.setWidthMode(shadowText, "Auto");
  engine.block.setHeightMode(shadowText, "Auto");
  engine.block.setPositionX(shadowText, 50);
  engine.block.setPositionY(shadowText, 50);
  engine.block.appendChild(page, shadowText);

  // Enable and configure drop shadow
  engine.block.setDropShadowEnabled(shadowText, true);
  engine.block.setDropShadowColor(shadowText, {
    r: 0,
    g: 0,
    b: 0,
    a: 0.6,
  });
  engine.block.setDropShadowOffsetX(shadowText, 5);
  engine.block.setDropShadowOffsetY(shadowText, 5);
  engine.block.setDropShadowBlurRadiusX(shadowText, 10);
  engine.block.setDropShadowBlurRadiusY(shadowText, 10);

  // Create a text block with stroke outline
  const outlineText = engine.block.create("text");
  engine.block.replaceText(outlineText, "Outline");
  engine.block.setTextFontSize(outlineText, 90);
  engine.block.setWidthMode(outlineText, "Auto");
  engine.block.setHeightMode(outlineText, "Auto");
  engine.block.setPositionX(outlineText, 50);
  engine.block.setPositionY(outlineText, 180);
  engine.block.appendChild(page, outlineText);

  // Enable and configure stroke
  engine.block.setStrokeEnabled(outlineText, true);
  engine.block.setStrokeWidth(outlineText, 2);
  engine.block.setStrokeColor(outlineText, {
    r: 0.2,
    g: 0.4,
    b: 0.9,
    a: 1.0,
  });
  engine.block.setStrokeStyle(outlineText, "Solid");
  engine.block.setStrokePosition(outlineText, "Center");

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: "image/png" });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync("output")) {
    mkdirSync("output");
  }

  // Save to file
  writeFileSync("output/text-effects.png", buffer);
  console.log("✅ Exported text effects to output/text-effects.png");
} finally {
  engine.dispose();
}
