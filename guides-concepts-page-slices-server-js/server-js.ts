import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

config(); // Load .env file

/**
 * CE.SDK Server Example: Folded Products and Spreads Guide
 *
 * Builds the outside of a tri-fold leaflet from three page slices:
 * - Sizes each page slice before it joins the page
 * - Gives one panel a background color
 * - Finds the panel that owns a block, and the blocks of a panel
 * - Moves a panel out to its own page and back in, with undo steps
 * - Exports one panel, and the whole sheet with crop and fold marks
 */
async function main(): Promise<void> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    engine.scene.create('VerticalStack');
    engine.scene.setDesignUnit('Millimeter');
    const [stack] = engine.block.findByType('stack');

    const page = engine.block.create('page');
    engine.block.appendChild(stack, page);

    // A 3 mm bleed on every side of the sheet
    engine.block.setBool(page, 'page/marginEnabled', true);
    for (const side of ['top', 'bottom', 'left', 'right']) {
      engine.block.setFloat(page, `page/margin/${side}`, 3);
    }

    // The outside of a tri-fold: the inside flap, the back and the cover
    const panelNames = ['Inside Flap', 'Back', 'Cover'];
    const panels = panelNames.map((panelName) => {
      const panel = engine.block.create('pageSlice');
      // Size the page slice before it joins the page.
      engine.block.setWidth(panel, 99);
      engine.block.setHeight(panel, 210);
      engine.block.setName(panel, panelName);
      engine.block.appendChild(page, panel);
      return panel;
    });
    const [flap, , cover] = panels;

    const coverFill = engine.block.createFill('color');
    engine.block.setColor(coverFill, 'fill/color/value', {
      r: 0.13,
      g: 0.36,
      b: 0.6,
      a: 1
    });
    // setFill on a page slice also turns its fill on.
    engine.block.setFill(cover, coverFill);

    // Content is a child of the page, in the coordinates of the page.
    const title = engine.block.create('text');
    engine.block.appendChild(page, title);
    engine.block.replaceText(title, 'Summer Workshops');
    engine.block.setTextFontSize(title, 28, { unit: 'Point' });
    engine.block.setTextColor(title, { r: 1, g: 1, b: 1, a: 1 });
    engine.block.setWidth(title, 79);
    engine.block.setHeightMode(title, 'Auto');
    engine.block.setPositionX(title, 208);
    engine.block.setPositionY(title, 30);

    const flapNote = engine.block.create('graphic');
    engine.block.setShape(flapNote, engine.block.createShape('rect'));
    const noteFill = engine.block.createFill('color');
    engine.block.setColor(noteFill, 'fill/color/value', {
      r: 0.95,
      g: 0.75,
      b: 0.2,
      a: 1
    });
    engine.block.setFill(flapNote, noteFill);
    engine.block.appendChild(page, flapNote);
    engine.block.setWidth(flapNote, 79);
    engine.block.setHeight(flapNote, 60);
    engine.block.setPositionX(flapNote, 10);
    engine.block.setPositionY(flapNote, 140);

    // Run the layout before you read a size or a position after a change.
    engine.update();
    console.log('Sheet width in mm:', engine.block.getWidth(page));

    // The page slice under the center of a block owns it.
    const titleOwner = engine.block.getOwningPageSlice(title);
    if (titleOwner !== null) {
      console.log('The title is on:', engine.block.getName(titleOwner));
    }

    // The blocks of one panel: filter the children of the page.
    const coverBlocks = engine.block
      .getChildren(page)
      .filter((child) => engine.block.getOwningPageSlice(child) === cover);
    console.log('Blocks on the cover:', coverBlocks.length);

    // Reading order, hidden page slices too
    const readingOrder = engine.block
      .getPageSlices(page)
      .map((panel) => engine.block.getName(panel));
    console.log('Panels in reading order:', readingOrder.join(', '));

    // Take the flap out as its own page, after the leaflet.
    const flapPage = engine.block.movePageSliceOutOfPage(flap, 1);
    engine.editor.addUndoStep();

    // Put it back as the first panel. The id changes on each move.
    const flapAgain = engine.block.movePageSliceIntoPage(flapPage, page, 0);
    engine.editor.addUndoStep();
    const noteOwner = engine.block.getOwningPageSlice(flapNote);
    console.log('The note is on the flap again:', noteOwner === flapAgain);

    // The scene has one page, so index 9 is a bug in the calling code.
    try {
      engine.block.movePageSliceOutOfPage(flapAgain, 9);
    } catch (error) {
      const code =
        error instanceof Error && 'code' in error ? error.code : undefined;
      if (code !== 'BLOCK.PAGE_SLICE_MOVE_INDEX_INVALID') {
        throw error;
      }
      console.log('Refused move:', code);
    }

    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // One panel, with the bleed of the page on all four sides
    const coverImage = await engine.block.export(cover, {
      mimeType: 'image/png'
    });
    writeFileSync(
      `${outputDir}/cover.png`,
      Buffer.from(await coverImage.arrayBuffer())
    );

    // The whole sheet, as a printer wants a folded leaflet
    const sheet = await engine.block.export(page, {
      mimeType: 'application/pdf',
      exportPdfWithCropMarks: true,
      exportPdfWithFoldMarks: true
    });
    writeFileSync(
      `${outputDir}/tri-fold-outside.pdf`,
      Buffer.from(await sheet.arrayBuffer())
    );

    console.log('Exported cover.png and tri-fold-outside.pdf to ./output');
  } finally {
    engine.dispose();
  }
}

main().catch(console.error);
