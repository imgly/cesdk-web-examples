import CreativeEngine, { type DesignBlockId } from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config(); // Load .env file

/**
 * CE.SDK Server Example: Photobook Spreads Guide
 *
 * Builds a square photobook from spreads:
 * - A cover of back cover, spine and front cover
 * - Inside spreads of two facing pages
 * - One photo across the fold of a spread
 * - A page duplicated in its spread, and a page copied into another spread
 * - The cover as one sheet, and the inside pages as one PDF page each
 */
async function main(): Promise<void> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    const scene = engine.scene.create('VerticalStack');
    engine.scene.setDesignUnit('Millimeter');
    const [stack] = engine.block.findByType('stack');

    type SpreadPage = { name: string; width: number };
    const createSpread = (pages: SpreadPage[]): DesignBlockId => {
      const spread = engine.block.create('page');
      engine.block.appendChild(stack, spread);

      // A 3 mm bleed on every side of the spread
      engine.block.setBool(spread, 'page/marginEnabled', true);
      for (const side of ['top', 'bottom', 'left', 'right']) {
        engine.block.setFloat(spread, `page/margin/${side}`, 3);
      }

      for (const { name, width } of pages) {
        const pageSlice = engine.block.create('pageSlice');
        // Size the page slice before it joins the spread.
        engine.block.setWidth(pageSlice, width);
        engine.block.setHeight(pageSlice, 210);
        engine.block.setName(pageSlice, name);
        engine.block.appendChild(spread, pageSlice);
      }
      return spread;
    };

    // The print shop gives the spine width for a page count and a paper.
    const spineWidth = 12;
    const cover = createSpread([
      { name: 'Back Cover', width: 210 },
      { name: 'Spine', width: spineWidth },
      { name: 'Front Cover', width: 210 }
    ]);
    const [, spine] = engine.block.getPageSlices(cover);
    // A title longer or wider than the spine stops at its folds.
    engine.block.setClipped(spine, true);

    const spineTitle = engine.block.create('text');
    engine.block.appendChild(cover, spineTitle);
    engine.block.replaceText(spineTitle, 'Summer 2026');
    engine.block.setTextFontSize(spineTitle, 14, { unit: 'Point' });
    const titleWidth = 120;
    const titleHeight = 8;
    engine.block.setWidth(spineTitle, titleWidth);
    engine.block.setHeight(spineTitle, titleHeight);
    engine.block.setEnum(spineTitle, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(spineTitle, 'text/verticalAlignment', 'Center');
    // setRotation keeps the center and moves the position. After the turn,
    // the position is the top-right corner of the turned frame.
    engine.block.setRotation(spineTitle, Math.PI / 2);
    engine.block.setPositionX(
      spineTitle,
      210 + spineWidth / 2 + titleHeight / 2
    );
    engine.block.setPositionY(spineTitle, (210 - titleWidth) / 2);

    engine.update();
    console.log('Cover width (mm):', engine.block.getWidth(cover));

    const firstSpread = createSpread([
      { name: 'Lake Left', width: 210 },
      { name: 'Lake Right', width: 210 }
    ]);
    // The second spread gets its right page from a copy, the third from a
    // duplicate.
    const secondSpread = createSpread([{ name: 'Trip Left', width: 210 }]);
    const thirdSpread = createSpread([{ name: 'Notes Left', width: 210 }]);
    const [lakeLeft, lakeRight] = engine.block.getPageSlices(firstSpread);

    // One photo over both pages, bleed included, centered on the fold
    const photo = engine.block.create('graphic');
    engine.block.setShape(photo, engine.block.createShape('rect'));
    const photoFill = engine.block.createFill('image');
    engine.block.setString(
      photoFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(photo, photoFill);
    engine.block.appendChild(firstSpread, photo);
    engine.block.setPositionX(photo, -3);
    engine.block.setPositionY(photo, -3);
    engine.block.setWidth(photo, 426);
    engine.block.setHeight(photo, 216);

    // On the fold, the earlier page slice owns the photo.
    const photoOwner = engine.block.getOwningPageSlice(photo);
    console.log('The photo belongs to the left page:', photoOwner === lakeLeft);

    // A page slice fill and the blocks that a page slice owns go with a copy.
    const pageFill = engine.block.createFill('color');
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.1,
      g: 0.2,
      b: 0.3,
      a: 1
    });
    engine.block.setFill(lakeRight, pageFill);
    const caption = engine.block.create('text');
    engine.block.appendChild(firstSpread, caption);
    engine.block.replaceText(caption, 'At the lake');
    engine.block.setTextFontSize(caption, 12, { unit: 'Point' });
    engine.block.setTextColor(caption, { r: 1, g: 1, b: 1, a: 1 });
    engine.block.setWidth(caption, 190);
    engine.block.setHeight(caption, 10);
    engine.block.setPositionX(caption, 220);
    engine.block.setPositionY(caption, 180);

    const saved = await engine.block.saveToString([lakeRight]);
    const [copy] = await engine.block.loadFromString(saved);
    engine.block.setName(copy, 'Trip Right');
    // The copy becomes the right page. The next update puts the caption on it.
    engine.block.insertChild(secondSpread, copy, 1);

    const note = engine.block.create('text');
    engine.block.appendChild(thirdSpread, note);
    engine.block.replaceText(note, 'Notes');
    engine.block.setTextFontSize(note, 18, { unit: 'Point' });
    engine.block.setWidth(note, 190);
    engine.block.setHeight(note, 12);
    engine.block.setPositionX(note, 10);
    engine.block.setPositionY(note, 20);

    // The duplicate goes right after the left page, with a copy of the note.
    const [leftPage] = engine.block.getPageSlices(thirdSpread);
    const rightPage = engine.block.duplicate(leftPage);
    engine.block.setName(rightPage, 'Notes Right');
    console.log(
      'Pages in the third spread:',
      engine.block.getPageSlices(thirdSpread).length
    );

    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // The cover as one sheet, with crop marks and the two spine folds
    const coverPdf = await engine.block.export(cover, {
      mimeType: 'application/pdf',
      exportPdfWithCropMarks: true,
      exportPdfWithFoldMarks: true,
      printMarkOffset: 3,
      pdfImageQuality: 0.9
    });
    writeFileSync(
      `${outputDir}/photobook-cover.pdf`,
      Buffer.from(await coverPdf.arrayBuffer())
    );

    // The inside pages: one PDF page per page slice, without the cover
    // A hidden page is left out of a scene export.
    engine.block.setVisible(cover, false);
    let insidePdf: Blob;
    try {
      insidePdf = await engine.block.export(scene, {
        mimeType: 'application/pdf',
        exportPdfPageSlices: true,
        pdfImageQuality: 0.9
      });
    } finally {
      engine.block.setVisible(cover, true);
    }
    writeFileSync(
      `${outputDir}/photobook-inside.pdf`,
      Buffer.from(await insidePdf.arrayBuffer())
    );

    console.log(
      'Exported photobook-cover.pdf and photobook-inside.pdf to ./output'
    );
  } finally {
    engine.dispose();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
