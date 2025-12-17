import CreativeEngine from "@cesdk/node";
import { config } from "dotenv";
import { writeFileSync, mkdirSync, existsSync } from "fs";

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Text and Language Support
 */

// Typeface definitions
const ROBOTO_BOLD = {
  name: "Roboto",
  fonts: [
    {
      uri: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAw.ttf",
      subFamily: "Bold",
      weight: "bold" as const,
      style: "normal" as const,
    },
  ],
};

const NOTO_NASKH_ARABIC = {
  name: "Noto Naskh Arabic",
  fonts: [
    {
      uri: new URL("./assets/NotoNaskhArabic-Regular.ttf", import.meta.url)
        .href,
      subFamily: "Regular",
      weight: "normal" as const,
      style: "normal" as const,
    },
  ],
};

const NOTO_SANS_KR = {
  name: "Noto Sans KR",
  fonts: [
    {
      uri: new URL("./assets/NotoSansKR-VariableFont_wght.ttf", import.meta.url)
        .href,
      subFamily: "Regular",
      weight: "normal" as const,
      style: "normal" as const,
    },
  ],
};

// Layout configuration
const LAYOUT = {
  PAGE: { width: 800, height: 1200 },
  TEXT: { x: 50, width: 700, defaultHeight: 140, fontSize: 20 },
  SPACING: { gap: 16, startY: 50 },
};

// Typeface interface
interface Typeface {
  name: string;
  fonts: Array<{
    uri: string;
    subFamily: string;
    weight: "normal" | "bold";
    style: "normal" | "italic";
  }>;
}

// Helper function to create text blocks
function createTextBlock(
  engine: CreativeEngine,
  page: number,
  text: string,
  typeface: Typeface,
  yPosition: number,
  height: number = LAYOUT.TEXT.defaultHeight,
  alignment: "Left" | "Center" | "Right" = "Left",
): void {
  const textBlock = engine.block.create("text");
  engine.block.setString(textBlock, "text/text", text);
  engine.block.appendChild(page, textBlock);
  engine.block.setPositionX(textBlock, LAYOUT.TEXT.x);
  engine.block.setPositionY(textBlock, yPosition);
  engine.block.setWidth(textBlock, LAYOUT.TEXT.width);
  engine.block.setHeight(textBlock, height);
  engine.block.setFloat(textBlock, "text/fontSize", LAYOUT.TEXT.fontSize);
  engine.block.setTypeface(textBlock, typeface);
  if (alignment !== "Left") {
    engine.block.setEnum(textBlock, "text/horizontalAlignment", alignment);
  }
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

// Create a design scene with specific page dimensions
engine.scene.create("VerticalStack", {
  page: { size: { width: LAYOUT.PAGE.width, height: LAYOUT.PAGE.height } },
});
const page = engine.block.findByType("page")[0];

try {
  // Create four text elements demonstrating multilingual font support
  const textElements = [
    { text: "RTL Arabic", typeface: ROBOTO_BOLD, height: 140 },
    {
      text: "هذا مثال.",
      typeface: NOTO_NASKH_ARABIC,
      height: 160,
      alignment: "Right" as const,
    },
    { text: "Korean", typeface: ROBOTO_BOLD, height: 140 },
    { text: "이는 한 예입니다.", typeface: NOTO_SANS_KR, height: 140 },
  ];

  let currentY = LAYOUT.SPACING.startY;
  for (const element of textElements) {
    createTextBlock(
      engine,
      page,
      element.text,
      element.typeface,
      currentY,
      element.height,
      element.alignment,
    );
    currentY += element.height + LAYOUT.SPACING.gap;
  }

  // Zoom to show all content
  engine.scene.zoomToBlock(page, { padding: 40 });

  // Export the scene to PNG
  const blob = await engine.block.export(page, { mimeType: "image/png" });
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Ensure output directory exists
  if (!existsSync("output")) {
    mkdirSync("output");
  }

  // Save to file
  writeFileSync("output/text-language-support.png", buffer);
  console.log(
    "✅ Exported multilingual text to output/text-language-support.png",
  );
} finally {
  engine.dispose();
}
