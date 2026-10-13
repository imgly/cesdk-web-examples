import CreativeEngine from '@cesdk/node';
import { checkPDFX, convertToPDFX, exportPDFX } from '@imgly/pdfx-exporter';
import { config } from 'dotenv';
import { mkdir, writeFile } from 'node:fs/promises';

config();
const engine = await CreativeEngine.init({
  // license: process.env.CESDK_LICENSE,
});

try {
  const scene = engine.scene.create();
  engine.scene.setDesignUnit('Millimeter');
  engine.block.setFloat(scene, 'scene/dpi', 300);
  engine.block.setName(scene, 'Print-ready postcard');

  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  engine.block.setWidth(page, 148);
  engine.block.setHeight(page, 105);

  const artwork = engine.block.create('graphic');
  engine.block.setShape(artwork, engine.block.createShape('rect'));
  const fill = engine.block.createFill('color');
  engine.block.setColor(fill, 'fill/color/value', {
    c: 0.8,
    m: 0.3,
    y: 0,
    k: 0.1,
    tint: 1
  });
  engine.block.setFill(artwork, fill);
  engine.block.appendChild(page, artwork);
  engine.block.setPositionX(artwork, -3);
  engine.block.setPositionY(artwork, -3);
  engine.block.setWidth(artwork, 154);
  engine.block.setHeight(artwork, 38);

  const text = engine.block.create('text');
  engine.block.appendChild(page, text);
  engine.block.replaceText(text, 'Made for print\nPDF/X-4 with 3 mm bleed');
  engine.block.setTextFontSize(text, 9);
  engine.block.setWidth(text, 124);
  engine.block.setHeightMode(text, 'Auto');
  engine.block.setPositionX(text, 12);
  engine.block.setPositionY(text, 48);

  engine.block.setBool(page, 'page/marginEnabled', true);
  engine.block.setFloat(page, 'page/margin/top', 3);
  engine.block.setFloat(page, 'page/margin/bottom', 3);
  engine.block.setFloat(page, 'page/margin/left', 3);
  engine.block.setFloat(page, 'page/margin/right', 3);

  const printReadyPDF = await exportPDFX(engine, {
    outputStandard: 'PDF/X-4',
    outputProfile: 'fogra39',
    nonPrinterProfile: 'reject',
    title: 'Print-ready postcard'
  });

  const findings = await checkPDFX(printReadyPDF, 'PDF/X-4');
  if (findings.length > 0) {
    console.error(findings);
    throw new Error('The exported PDF has PDF/X conformance findings.');
  }

  const outputDirectory = new URL('./output/', import.meta.url);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(
    new URL('postcard-pdfx4.pdf', outputDirectory),
    new Uint8Array(await printReadyPDF.arrayBuffer())
  );

  const existingPDF = await engine.block.export(page, {
    mimeType: 'application/pdf'
  });
  const convertedPDF = await convertToPDFX(existingPDF, {
    outputStandard: 'PDF/X-4',
    outputProfile: 'fogra39',
    nonPrinterProfile: 'reject',
    title: 'Converted postcard'
  });
  const conversionFindings = await checkPDFX(convertedPDF, 'PDF/X-4');
  if (conversionFindings.length > 0) {
    console.error(conversionFindings);
    throw new Error('The converted PDF has PDF/X conformance findings.');
  }
  await writeFile(
    new URL('postcard-converted-pdfx4.pdf', outputDirectory),
    new Uint8Array(await convertedPDF.arrayBuffer())
  );
  console.info('Saved two PDF/X-4 files to output/.');
} finally {
  engine.dispose();
}
