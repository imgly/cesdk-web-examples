import CreativeEngine, { ColorRenderingIntent } from '@cesdk/node';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

async function main() {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    engine.scene.create('VerticalStack', {
      page: { size: { width: 800, height: 600 } }
    });
    const page = engine.block.findByType('page')[0];

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Calculate block sizes for three columns
    const margin = 40;
    const spacing = 30;
    const availableWidth = pageWidth - 2 * margin - 2 * spacing;
    const blockWidth = availableWidth / 3;
    const blockHeight = pageHeight - 2 * margin;

    // Create three blocks to demonstrate each color space

    // Block 1: sRGB color (for screen display)
    const srgbBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      srgbBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const srgbFill = engine.block.createFill('//ly.img.ubq/fill/color');
    // Set fill color using RGBAColor object (values 0.0-1.0)
    engine.block.setColor(srgbFill, 'fill/color/value', {
      r: 0.2,
      g: 0.4,
      b: 0.9,
      a: 1.0
    });
    engine.block.setFill(srgbBlock, srgbFill);
    engine.block.setWidth(srgbBlock, blockWidth);
    engine.block.setHeight(srgbBlock, blockHeight);
    engine.block.appendChild(page, srgbBlock);

    // Block 2: CMYK color (for print workflows)
    const cmykBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      cmykBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const cmykFill = engine.block.createFill('//ly.img.ubq/fill/color');
    // Set fill color using CMYKColor object (values 0.0-1.0, tint scales ink)
    engine.block.setColor(cmykFill, 'fill/color/value', {
      c: 0.0,
      m: 0.8,
      y: 0.95,
      k: 0.0,
      tint: 1.0
    });
    engine.block.setFill(cmykBlock, cmykFill);
    engine.block.setWidth(cmykBlock, blockWidth);
    engine.block.setHeight(cmykBlock, blockHeight);
    engine.block.appendChild(page, cmykBlock);

    // Define a spot color with RGB approximation for screen preview
    engine.editor.setSpotColorRGB('MyBrand Red', 0.95, 0.25, 0.21);

    // Block 3: Spot color (for specialized printing)
    const spotBlock = engine.block.create('//ly.img.ubq/graphic');
    engine.block.setShape(
      spotBlock,
      engine.block.createShape('//ly.img.ubq/shape/rect')
    );
    const spotFill = engine.block.createFill('//ly.img.ubq/fill/color');
    // Set fill color using SpotColor object (references the defined spot color)
    engine.block.setColor(spotFill, 'fill/color/value', {
      name: 'MyBrand Red',
      tint: 1.0,
      externalReference: ''
    });
    engine.block.setFill(spotBlock, spotFill);
    engine.block.setWidth(spotBlock, blockWidth);
    engine.block.setHeight(spotBlock, blockHeight);
    engine.block.appendChild(page, spotBlock);

    // Add strokes to demonstrate stroke color property
    engine.block.setStrokeEnabled(srgbBlock, true);
    engine.block.setStrokeWidth(srgbBlock, 4);
    engine.block.setColor(srgbBlock, 'stroke/color', {
      r: 0.1,
      g: 0.2,
      b: 0.5,
      a: 1.0
    });

    engine.block.setStrokeEnabled(cmykBlock, true);
    engine.block.setStrokeWidth(cmykBlock, 4);
    engine.block.setColor(cmykBlock, 'stroke/color', {
      c: 0.0,
      m: 0.5,
      y: 0.6,
      k: 0.2,
      tint: 1.0
    });

    engine.block.setStrokeEnabled(spotBlock, true);
    engine.block.setStrokeWidth(spotBlock, 4);
    engine.block.setColor(spotBlock, 'stroke/color', {
      name: 'MyBrand Red',
      tint: 0.7,
      externalReference: ''
    });

    // Position all color blocks
    engine.block.setPositionX(srgbBlock, margin);
    engine.block.setPositionY(srgbBlock, margin);

    engine.block.setPositionX(cmykBlock, margin + blockWidth + spacing);
    engine.block.setPositionY(cmykBlock, margin);

    engine.block.setPositionX(spotBlock, margin + 2 * (blockWidth + spacing));
    engine.block.setPositionY(spotBlock, margin);

    // Retrieve and log color values to demonstrate getColor()
    const srgbColor = engine.block.getColor(srgbFill, 'fill/color/value');
    const cmykColor = engine.block.getColor(cmykFill, 'fill/color/value');
    const spotColor = engine.block.getColor(spotFill, 'fill/color/value');

    console.log('sRGB Color:', srgbColor);
    console.log('CMYK Color:', cmykColor);
    console.log('Spot Color:', spotColor);

    const swatches = [
      { label: 'sRGB', color: srgbColor },
      { label: 'CMYK', color: cmykColor },
      { label: 'Spot Color', color: spotColor }
    ];

    await engine.editor.loadCMYKProfile();

    const logConversions = (step: string) => {
      const values = swatches.map(({ label, color }) => {
        const { r, g, b } = engine.editor.convertColorToColorSpace(
          color,
          'sRGB'
        );
        return { label, r: +r.toFixed(3), g: +g.toFixed(3), b: +b.toFixed(3) };
      });
      console.log(step);
      console.table(values);
    };

    logConversions('Bundled default profile');

    const profileUrl = new URL(
      './assets/ISOcoated_v2_eci.icc',
      import.meta.url
    );
    await engine.scene.setCMYKProfile(profileUrl.href);
    const { contentHash } = engine.scene.getCMYKProfileInfo();
    console.log('Document profile hash:', contentHash);
    logConversions('ISOcoated_v2_eci.icc');

    const profileBytes = new Uint8Array(readFileSync(profileUrl));
    engine.scene.setCMYKProfileFromData(profileBytes);
    console.log(
      'Same profile:',
      engine.scene.getCMYKProfileInfo().contentHash === contentHash
    );

    engine.scene.setColorRenderingIntent(ColorRenderingIntent.Perceptual);
    engine.scene.setBlackPointCompensationEnabled(false);
    logConversions('Perceptual intent, black point compensation off');

    const scene = engine.scene.get()!;
    const mode = engine.block.getEnum(scene, 'scene/colorConversionMode');
    console.log('Color conversion mode:', mode);

    engine.block.setEnum(scene, 'scene/colorConversionMode', 'Legacy');
    logConversions('Legacy mode');
    engine.block.setEnum(scene, 'scene/colorConversionMode', 'Managed');

    mkdirSync('output', { recursive: true });

    const png = await engine.block.export(page, { mimeType: 'image/png' });
    writeFileSync(
      'output/color-basics.png',
      Buffer.from(await png.arrayBuffer())
    );

    const pdf = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithDeviceCMYK: true
    });
    writeFileSync(
      'output/color-basics.pdf',
      Buffer.from(await pdf.arrayBuffer())
    );
    console.log('Exported output/color-basics.png and .pdf');

    console.log('Color Basics example completed successfully');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
