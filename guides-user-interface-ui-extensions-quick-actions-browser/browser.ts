import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal-web';
import VectorizerPlugin from '@imgly/plugin-vectorizer-web';
import CutoutLibraryPlugin from '@imgly/plugin-cutout-library-web';
import QRCodePlugin from '@imgly/plugin-qr-code-web';

export default class QuickActionsExample implements EditorPlugin {
  name = 'QuickActionsExample';
  version = '1.0.0';

  async initialize({ cesdk }: EditorPluginContext) {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    // Load assets and create scene
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Add background removal plugin with canvas menu button
    await cesdk.addPlugin(
      BackgroundRemovalPlugin({
        ui: {
          locations: ['canvasMenu']
        }
      })
    );

    // Add vectorizer plugin with canvas menu button
    await cesdk.addPlugin(
      VectorizerPlugin({
        ui: {
          locations: 'canvasMenu'
        }
      })
    );

    // Add cutout library plugin for print workflows (dock only, no canvas menu)
    await cesdk.addPlugin(CutoutLibraryPlugin());

    // Add cutout library to the dock for easy access
    const cutoutAssetEntry = cesdk.ui.getAssetLibraryEntry('ly.img.cutout.entry');
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      {
        id: 'ly.img.assetLibrary.dock',
        label: 'Cutout',
        key: 'ly.img.assetLibrary.dock',
        icon: cutoutAssetEntry?.icon,
        entries: ['ly.img.cutout.entry']
      },
    ]);

    // Add QR code plugin (adds canvas menu button automatically)
    await cesdk.addPlugin(QRCodePlugin());

    // Add QR code generator to the dock
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'ly.img.spacer',
      'ly.img.generate-qr.dock'
    ]);

    // Create scene with gradient background and text
    await cesdk.createDesignScene();

    const page = engine.block.findByType('page')[0];
    const pageWidth = 800;
    const pageHeight = 600;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);

    // Add gradient background to the page
    const pageFill = engine.block.createFill('gradient/linear');
    engine.block.setGradientColorStops(pageFill, 'fill/gradient/colors', [
      { stop: 0, color: { r: 0.18, g: 0.1, b: 0.4, a: 1 } },
      { stop: 1, color: { r: 0.55, g: 0.25, b: 0.6, a: 1 } }
    ]);
    engine.block.setFloat(pageFill, 'fill/gradient/linear/startPointX', 0);
    engine.block.setFloat(pageFill, 'fill/gradient/linear/startPointY', 0);
    engine.block.setFloat(pageFill, 'fill/gradient/linear/endPointX', 1);
    engine.block.setFloat(pageFill, 'fill/gradient/linear/endPointY', 1);
    engine.block.setFill(page, pageFill);

    // Add main title text with auto height
    const titleBlock = engine.block.create('text');
    engine.block.setString(titleBlock, 'text/text', 'Explore Quick Actions');
    engine.block.setFloat(titleBlock, 'text/fontSize', 100);
    engine.block.setEnum(titleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(titleBlock, pageWidth);
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);

    // Set title text color to white
    engine.block.setTextColor(titleBlock, { r: 1, g: 1, b: 1, a: 1 });

    // Add subtitle text with auto height
    const subtitleBlock = engine.block.create('text');
    engine.block.setString(subtitleBlock, 'text/text', 'IMG.LY');
    engine.block.setFloat(subtitleBlock, 'text/fontSize', 64);
    engine.block.setEnum(subtitleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(subtitleBlock, pageWidth);
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.appendChild(page, subtitleBlock);

    // Set subtitle text color to white
    engine.block.setTextColor(subtitleBlock, { r: 1, g: 1, b: 1, a: 1 });

    // Add a sample image to demonstrate quick actions
    const imageBlock = engine.block.create('graphic');

    // Set shape for the graphic block
    const rectShape = engine.block.createShape('rect');
    engine.block.setShape(imageBlock, rectShape);

    // Set image fill
    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(imageBlock, imageFill);

    const imageSize = 250;
    engine.block.setWidth(imageBlock, imageSize);
    engine.block.setHeight(imageBlock, imageSize);
    engine.block.appendChild(page, imageBlock);

    // Position all elements - text at top, image below
    const titleHeight = engine.block.getFrameHeight(titleBlock);
    const subtitleHeight = engine.block.getFrameHeight(subtitleBlock);
    const textSpacing = 10;
    const imageGap = 80;

    // Position content vertically centered with offset
    const totalHeight =
      titleHeight + textSpacing + subtitleHeight + imageGap + imageSize;
    const startY = (pageHeight - totalHeight) / 2 + 40;

    engine.block.setPositionX(titleBlock, 0);
    engine.block.setPositionY(titleBlock, startY);
    engine.block.setPositionX(subtitleBlock, 0);
    engine.block.setPositionY(subtitleBlock, startY + titleHeight + textSpacing);
    engine.block.setPositionX(imageBlock, (pageWidth - imageSize) / 2);
    engine.block.setPositionY(
      imageBlock,
      startY + titleHeight + textSpacing + subtitleHeight + imageGap
    );

    // Select the image to show the canvas menu with quick actions
    engine.block.select(imageBlock);

    // Open the cutout library panel
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.cutout.entry'],
        title: 'Cutout'
      }
    });
  }
}
