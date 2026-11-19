import CreativeEngine, { type DesignBlockId } from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config(); // Load .env file

/**
 * CE.SDK Server Example: Folded Cards Guide
 *
 * Builds a bi-fold greeting card and a tri-fold leaflet from page slices:
 * - One page per printed side, one page slice per panel
 * - Clipped panels on the outside, a photo across the fold inside
 * - A content-aware resize to another paper format
 * - A PDF of each sheet with crop and fold marks
 */
async function main(): Promise<void> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    engine.scene.create('VerticalStack');
    engine.scene.setDesignUnit('Millimeter');
    const [stack] = engine.block.findByType('stack');

    type Panel = { name: string; width: number; height: number };
    const createSheet = (panels: Panel[]): DesignBlockId => {
      const page = engine.block.create('page');
      engine.block.setName(page, panels.map((panel) => panel.name).join(' | '));
      engine.block.appendChild(stack, page);

      // A 3 mm bleed on every side of the sheet
      engine.block.setBool(page, 'page/marginEnabled', true);
      for (const side of ['top', 'bottom', 'left', 'right']) {
        engine.block.setFloat(page, `page/margin/${side}`, 3);
      }

      for (const { name, width, height } of panels) {
        const pageSlice = engine.block.create('pageSlice');
        // Size the page slice before it joins the page.
        engine.block.setWidth(pageSlice, width);
        engine.block.setHeight(pageSlice, height);
        engine.block.setName(pageSlice, name);
        engine.block.appendChild(page, pageSlice);
      }
      return page;
    };

    // An A5 card folds to A6: two panels of 105 × 148 mm on each side.
    const outside = createSheet([
      { name: 'Back', width: 105, height: 148 },
      { name: 'Front', width: 105, height: 148 }
    ]);
    const inside = createSheet([
      { name: 'Inside Left', width: 105, height: 148 },
      { name: 'Inside Right', width: 105, height: 148 }
    ]);
    const [, front] = engine.block.getPageSlices(outside);

    // The inside flap is 3 mm narrower, so it fits inside without buckling.
    // The inside sheet holds the same widths in the opposite order.
    const leafletOutside = createSheet([
      { name: 'Inside Flap', width: 97, height: 210 },
      { name: 'Back', width: 100, height: 210 },
      { name: 'Cover', width: 100, height: 210 }
    ]);
    const leafletInside = createSheet([
      { name: 'Inside Left', width: 100, height: 210 },
      { name: 'Inside Middle', width: 100, height: 210 },
      { name: 'Inside Right', width: 97, height: 210 }
    ]);

    engine.update();
    console.log('Leaflet width (mm):', engine.block.getWidth(leafletOutside));

    const frontFill = engine.block.createFill('color');
    engine.block.setColor(frontFill, 'fill/color/value', {
      r: 0.55,
      g: 0.12,
      b: 0.2,
      a: 1
    });
    engine.block.setFill(front, frontFill);

    // Content is a child of the page, in the coordinates of the sheet.
    const title = engine.block.create('text');
    engine.block.appendChild(outside, title);
    engine.block.replaceText(title, 'Happy Birthday');
    engine.block.setTextFontSize(title, 24, { unit: 'Point' });
    engine.block.setTextColor(title, { r: 1, g: 1, b: 1, a: 1 });
    engine.block.setWidth(title, 85);
    engine.block.setHeightMode(title, 'Auto');
    engine.block.setPositionX(title, 115);
    engine.block.setPositionY(title, 60);

    // One photo across the inside, bleed included, centered on the fold
    const photo = engine.block.create('graphic');
    engine.block.setShape(photo, engine.block.createShape('rect'));
    const photoFill = engine.block.createFill('image');
    engine.block.setString(
      photoFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(photo, photoFill);
    engine.block.appendChild(inside, photo);
    engine.block.setPositionX(photo, -3);
    engine.block.setPositionY(photo, -3);
    engine.block.setWidth(photo, 216);
    engine.block.setHeight(photo, 154);

    // A band on the leaflet cover that reaches 20 mm onto the back and 3 mm
    // into the bleed
    const band = engine.block.create('graphic');
    engine.block.setShape(band, engine.block.createShape('rect'));
    const bandFill = engine.block.createFill('color');
    engine.block.setColor(bandFill, 'fill/color/value', {
      r: 0.13,
      g: 0.36,
      b: 0.6,
      a: 1
    });
    engine.block.setFill(band, bandFill);
    engine.block.appendChild(leafletOutside, band);
    engine.block.setPositionX(band, 177);
    engine.block.setPositionY(band, 20);
    engine.block.setWidth(band, 123);
    engine.block.setHeight(band, 40);

    // A clipped panel cuts the blocks that it owns at its folds, so the band
    // stops at the fold between the back and the cover of the leaflet.
    for (const sheet of [outside, leafletOutside]) {
      for (const panel of engine.block.getPageSlices(sheet)) {
        engine.block.setClipped(panel, true);
      }
    }
    // The inside panels stay open, so the photo crosses the fold.
    const photoOwner = engine.block.getOwningPageSlice(photo);
    if (photoOwner !== null) {
      console.log('The photo belongs to:', engine.block.getName(photoOwner));
    }

    // Pass the size of the whole sheet: half US Letter, landscape.
    engine.block.resizeContentAware([outside, inside], 215.9, 139.7);
    const titleOwner = engine.block.getOwningPageSlice(title);
    console.log('The title stays on the front:', titleOwner === front);

    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // One flat sheet per printed side, with crop and fold marks
    for (const [fileName, sheet] of [
      ['card-outside.pdf', outside],
      ['card-inside.pdf', inside],
      ['leaflet-outside.pdf', leafletOutside],
      ['leaflet-inside.pdf', leafletInside]
    ] as const) {
      const pdf = await engine.block.export(sheet, {
        mimeType: 'application/pdf',
        exportPdfWithCropMarks: true,
        exportPdfWithFoldMarks: true,
        // The marks start at the edge of the 3 mm bleed.
        printMarkOffset: 3
      });
      writeFileSync(
        `${outputDir}/${fileName}`,
        Buffer.from(await pdf.arrayBuffer())
      );
    }

    console.log('Exported four PDFs to ./output');
  } finally {
    engine.dispose();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
