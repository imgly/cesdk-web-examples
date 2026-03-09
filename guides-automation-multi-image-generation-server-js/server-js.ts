import CreativeEngine, { isRGBAColor, type RGBAColor } from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Multi-Image Generation
 *
 * Demonstrates generating multiple image variants from a single data record:
 * - Processing multiple templates sequentially (square, portrait, landscape)
 * - Setting text variables from structured data
 * - Replacing images dynamically by block name
 * - Applying brand colors across template elements
 * - Exporting variants to different formats
 */

// Define the data structure for a restaurant review card
// In production, this would come from an API, database, or JSON file
interface RestaurantData {
  name: string;
  price: string;
  reviewCount: number;
  rating: number;
  imageUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

// Define template configurations for different formats
// Each template targets a different aspect ratio for various platforms
interface TemplateConfig {
  label: string;
  width: number;
  height: number;
}

// Helper function to convert hex color to RGBA (0-1 range)
function hexToRgba01(hex: string): RGBAColor {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) throw new Error(`Invalid hex color: ${hex}`);
  return {
    r: parseInt(m[1], 16) / 255,
    g: parseInt(m[2], 16) / 255,
    b: parseInt(m[3], 16) / 255,
    a: 1
  };
}

// Helper to check if color is black (r=0, g=0, b=0)
function isBlackColor(color: unknown): boolean {
  if (!isRGBAColor(color as RGBAColor)) return false;
  const c = color as RGBAColor;
  return c.r === 0 && c.g === 0 && c.b === 0;
}

// Helper to check if color is white (r=1, g=1, b=1)
function isWhiteColor(color: unknown): boolean {
  if (!isRGBAColor(color as RGBAColor)) return false;
  const c = color as RGBAColor;
  return c.r === 1 && c.g === 1 && c.b === 1;
}

// Initialize CE.SDK engine in headless mode
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE, // Optional (trial mode available)
});

// Helper function to apply text variables from data
function applyVariables(data: RestaurantData): void {
  const safeName = data.name?.trim() || 'Restaurant';
  const safePrice = data.price?.trim() || '$';
  const safeCount =
    data.reviewCount !== undefined && data.reviewCount !== null
      ? data.reviewCount.toString()
      : '0';

  engine.variable.setString('Name', safeName);
  engine.variable.setString('Price', safePrice);
  engine.variable.setString('Count', safeCount);
}

// Helper function to replace an image by block name
function replaceImageByName(
  blockName: string,
  newUrl: string,
  mode: 'Cover' | 'Contain' = 'Cover'
): void {
  const blocks = engine.block.findByName(blockName);
  if (blocks.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`Block "${blockName}" not found`);
    return;
  }

  const imageBlock = blocks[0];
  let fill = engine.block.getFill(imageBlock);

  if (!fill) {
    fill = engine.block.createFill('image');
    engine.block.setFill(imageBlock, fill);
  }

  engine.block.setString(fill, 'fill/image/imageFileURI', newUrl);
  engine.block.resetCrop(imageBlock);
  engine.block.setContentFillMode(imageBlock, mode);
}

// Helper function to apply brand colors to template elements
function applyBrandColors(primaryHex: string, secondaryHex: string): void {
  const primary = hexToRgba01(primaryHex);
  const secondary = hexToRgba01(secondaryHex);
  const blocks = engine.block.findAll();

  for (const id of blocks) {
    const type = engine.block.getType(id);

    // Text blocks: swap black/white text colors
    if (type === '//ly.img.ubq/text') {
      const colors = engine.block.getTextColors(id) || [];
      colors.forEach((c, i) => {
        if (isBlackColor(c)) {
          engine.block.setTextColor(id, primary, i, colors.length);
        } else if (isWhiteColor(c)) {
          engine.block.setTextColor(id, secondary, i, colors.length);
        }
      });
      continue;
    }

    // Shapes: swap black/white fills
    if (engine.block.supportsFill(id)) {
      const fill = engine.block.getFill(id);
      if (fill && engine.block.getType(fill) === '//ly.img.ubq/fill/color') {
        const fillColor = engine.block.getColor(fill, 'fill/color/value');
        if (isBlackColor(fillColor)) {
          engine.block.setColor(fill, 'fill/color/value', primary);
        } else if (isWhiteColor(fillColor)) {
          engine.block.setColor(fill, 'fill/color/value', secondary);
        }
      }
    }
  }
}

// Helper function to visualize rating with colored indicators
function applyRating(rating: number, maxRating: number = 5): void {
  const onColor = hexToRgba01('#FFD700'); // Gold for active
  const offColor = hexToRgba01('#E0E0E0'); // Gray for inactive

  for (let i = 1; i <= maxRating; i++) {
    const blocks = engine.block.findByName(`Rating${i}`);
    if (blocks.length === 0) continue;

    const ratingBlock = blocks[0];
    if (engine.block.supportsFill(ratingBlock)) {
      const fill = engine.block.getFill(ratingBlock);
      if (fill) {
        const color = i <= rating ? onColor : offColor;
        engine.block.setColor(fill, 'fill/color/value', color);
      }
    }
  }
}

try {
  const restaurantData: RestaurantData = {
    name: 'The Golden Fork',
    price: '$$$',
    reviewCount: 127,
    rating: 4,
    imageUrl: 'https://img.ly/static/ubq_samples/sample_4.jpg',
    primaryColor: '#2D5A27',
    secondaryColor: '#F5E6D3'
  };

  const templates: TemplateConfig[] = [
    { label: 'square', width: 1080, height: 1080 }, // Instagram post (1:1)
    { label: 'portrait', width: 1080, height: 1920 }, // Instagram story (9:16)
    { label: 'landscape', width: 1200, height: 630 } // Facebook/X post (1.91:1)
  ];

  // Prepare output directory
  const outputDir = './output';
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Store results for summary
  const results: { label: string; filename: string }[] = [];

  // Process each template format sequentially
  for (const template of templates) {
    // Create a fresh scene for each template variant
    engine.scene.create('Free', {
      page: { size: { width: template.width, height: template.height } }
    });
    const page = engine.block.findByType('page')[0];

    // Create template content with text variables
    // In production, you would load a pre-designed template instead

    // Create background
    const bgRect = engine.block.create('graphic');
    engine.block.setShape(bgRect, engine.block.createShape('rect'));
    const bgFill = engine.block.createFill('color');
    engine.block.setColor(bgFill, 'fill/color/value', {
      r: 1,
      g: 1,
      b: 1,
      a: 1
    });
    engine.block.setFill(bgRect, bgFill);
    engine.block.setWidth(bgRect, template.width);
    engine.block.setHeight(bgRect, template.height);
    engine.block.setPositionX(bgRect, 0);
    engine.block.setPositionY(bgRect, 0);
    engine.block.appendChild(page, bgRect);

    // Create hero image block
    const heroBlock = engine.block.create('graphic');
    engine.block.setShape(heroBlock, engine.block.createShape('rect'));
    const heroFill = engine.block.createFill('image');
    engine.block.setString(
      heroFill,
      'fill/image/imageFileURI',
      restaurantData.imageUrl
    );
    engine.block.setFill(heroBlock, heroFill);
    engine.block.setName(heroBlock, 'HeroImage');

    // Adjust hero image size based on format
    const heroHeight = template.height * 0.5;
    engine.block.setWidth(heroBlock, template.width);
    engine.block.setHeight(heroBlock, heroHeight);
    engine.block.setPositionX(heroBlock, 0);
    engine.block.setPositionY(heroBlock, 0);
    engine.block.appendChild(page, heroBlock);

    // Create title text with variable binding
    const titleBlock = engine.block.create('text');
    engine.block.replaceText(titleBlock, '{{Name}}');
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.setFloat(titleBlock, 'text/fontSize', 48);
    engine.block.setPositionX(titleBlock, 40);
    engine.block.setPositionY(titleBlock, heroHeight + 30);
    engine.block.appendChild(page, titleBlock);

    // Create price and review count text
    const detailsBlock = engine.block.create('text');
    engine.block.replaceText(detailsBlock, '{{Price}} · {{Count}} reviews');
    engine.block.setWidthMode(detailsBlock, 'Auto');
    engine.block.setHeightMode(detailsBlock, 'Auto');
    engine.block.setFloat(detailsBlock, 'text/fontSize', 24);
    engine.block.setPositionX(detailsBlock, 40);
    engine.block.setPositionY(detailsBlock, heroHeight + 100);
    engine.block.appendChild(page, detailsBlock);

    // Create rating stars
    const starSize = 30;
    const starSpacing = 35;
    const starY = heroHeight + 150;
    for (let i = 1; i <= 5; i++) {
      const star = engine.block.create('graphic');
      engine.block.setShape(star, engine.block.createShape('rect'));
      const starFill = engine.block.createFill('color');
      engine.block.setColor(starFill, 'fill/color/value', {
        r: 0.88,
        g: 0.88,
        b: 0.88,
        a: 1
      });
      engine.block.setFill(star, starFill);
      engine.block.setWidth(star, starSize);
      engine.block.setHeight(star, starSize);
      engine.block.setPositionX(star, 40 + (i - 1) * starSpacing);
      engine.block.setPositionY(star, starY);
      engine.block.setName(star, `Rating${i}`);
      engine.block.appendChild(page, star);
    }

    // Apply data to the template
    applyVariables(restaurantData);
    replaceImageByName('HeroImage', restaurantData.imageUrl, 'Cover');
    applyBrandColors(
      restaurantData.primaryColor,
      restaurantData.secondaryColor
    );
    applyRating(restaurantData.rating);

    // Export the populated template
    const blob = await engine.block.export(page, {
      mimeType: 'image/png'
    });

    // Save to file system
    const filename = `restaurant-${template.label}.png`;
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/${filename}`, buffer);

    results.push({ label: template.label, filename });
    // eslint-disable-next-line no-console
    console.log(
      `✓ Exported ${filename} (${template.width}x${template.height})`
    );
  }

  // eslint-disable-next-line no-console
  console.log(
    `\n✓ Multi-image generation complete: ${results.length} variants exported to ${outputDir}/`
  );
  // eslint-disable-next-line no-console
  console.log('  Variants:', results.map((r) => r.label).join(', '));
} finally {
  // Always dispose the engine to free resources
  engine.dispose();
}
