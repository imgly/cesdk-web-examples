import CreativeEngine from "@cesdk/node";
import { config } from "dotenv";
import { writeFileSync, mkdirSync, existsSync } from "fs";

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Adjust Text Spacing
 *
 * Demonstrates programmatic text spacing capabilities:
 * - Letter spacing (tracking)
 * - Line height (leading)
 * - Paragraph spacing
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
    "text/letterSpacing",
  );
  console.log("Letter spacing:", letterSpacing);

  // Text block 2: Line Height Demo
  const textLineHeight = engine.block.create("text");
  engine.block.appendChild(page, textLineHeight);
  engine.block.setPositionX(textLineHeight, 50);
  engine.block.setPositionY(textLineHeight, 150);
  engine.block.setWidth(textLineHeight, 700);
  engine.block.setHeightMode(textLineHeight, "Auto");
  engine.block.replaceText(textLineHeight, "Design your ideas\nBring them to life");
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
  engine.block.replaceText(textParagraphSpacing, "Start Creating\nJoin Today");
  engine.block.setTextFontSize(textParagraphSpacing, 48);

  // Set paragraph spacing - adds space after paragraph breaks
  engine.block.setFloat(textParagraphSpacing, "text/paragraphSpacing", 4);

  // Read current paragraph spacing value
  const paragraphSpacing = engine.block.getFloat(
    textParagraphSpacing,
    "text/paragraphSpacing",
  );
  console.log("Paragraph spacing:", paragraphSpacing);

  // Zoom to show all text blocks
  engine.scene.zoomToBlock(page, { padding: 40 });

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: "image/png" });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync("output")) {
    mkdirSync("output");
  }

  // Save to file
  writeFileSync("output/text-spacing.png", buffer);
  console.log("Exported text with spacing to output/text-spacing.png");
} finally {
  engine.dispose();
}
