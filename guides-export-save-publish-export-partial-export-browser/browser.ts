import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Partial Export Guide
 *
 * This example demonstrates:
 * - Exporting individual design blocks
 * - Exporting grouped elements
 * - Exporting with different formats and options
 * - Understanding block hierarchy in exports
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Create a design scene using CE.SDK cesdk method
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Set page dimensions for demo (smaller for reasonable export sizes)
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Set page background to light gray
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 0.95,
      g: 0.95,
      b: 0.95,
      a: 1.0
    });

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Sample image URI for demonstrations
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Create design elements for demonstration
    // Create first image block
    const imageBlock1 = await engine.block.addImage(imageUri, {
      size: { width: blockWidth, height: blockHeight }
    });
    engine.block.appendChild(page, imageBlock1);

    // Create second image block with different styling
    const imageBlock2 = await engine.block.addImage(imageUri, {
      size: { width: blockWidth, height: blockHeight },
      cornerRadius: 20
    });
    engine.block.appendChild(page, imageBlock2);

    // Create a shape block
    const shapeBlock = engine.block.create('//ly.img.ubq/graphic');
    const shape = engine.block.createShape('star');
    engine.block.setShape(shapeBlock, shape);
    engine.block.setWidth(shapeBlock, blockWidth);
    engine.block.setHeight(shapeBlock, blockHeight);

    // Add a color fill to the shape
    const shapeFill = engine.block.createFill('color');
    engine.block.setFill(shapeBlock, shapeFill);
    engine.block.setColor(shapeFill, 'fill/color/value', {
      r: 1.0,
      g: 0.7,
      b: 0.0,
      a: 1.0
    });
    engine.block.appendChild(page, shapeBlock);

    // Create two shapes for grouping demonstration
    const groupShape1 = engine.block.create('//ly.img.ubq/graphic');
    const rect = engine.block.createShape('rect');
    engine.block.setShape(groupShape1, rect);
    engine.block.setWidth(groupShape1, blockWidth * 0.4);
    engine.block.setHeight(groupShape1, blockHeight * 0.4);
    const groupFill1 = engine.block.createFill('color');
    engine.block.setFill(groupShape1, groupFill1);
    engine.block.setColor(groupFill1, 'fill/color/value', {
      r: 0.3,
      g: 0.6,
      b: 0.9,
      a: 1.0
    });
    engine.block.appendChild(page, groupShape1);

    const groupShape2 = engine.block.create('//ly.img.ubq/graphic');
    const ellipse = engine.block.createShape('ellipse');
    engine.block.setShape(groupShape2, ellipse);
    engine.block.setWidth(groupShape2, blockWidth * 0.4);
    engine.block.setHeight(groupShape2, blockHeight * 0.4);
    const groupFill2 = engine.block.createFill('color');
    engine.block.setFill(groupShape2, groupFill2);
    engine.block.setColor(groupFill2, 'fill/color/value', {
      r: 0.9,
      g: 0.3,
      b: 0.5,
      a: 1.0
    });
    engine.block.appendChild(page, groupShape2);

    // Group the two shapes together
    const group = engine.block.group([groupShape1, groupShape2]);

    // Position all blocks in grid layout for visualization
    const allBlocks = [
      imageBlock1,
      imageBlock2,
      shapeBlock,
      group,
      groupShape1 // Note: groupShape1 is inside group, positioning group will position children
    ];

    allBlocks.forEach((block, index) => {
      if (index < 6) {
        // Only position first 6 blocks (group contains 2)
        const pos = getPosition(index);
        engine.block.setPositionX(block, pos.x);
        engine.block.setPositionY(block, pos.y);
      }
    });

    // Position grouped shapes relative to group
    const groupPos = getPosition(4);
    engine.block.setPositionX(group, groupPos.x);
    engine.block.setPositionY(group, groupPos.y);
    engine.block.setPositionX(groupShape1, 10);
    engine.block.setPositionY(groupShape1, 10);
    engine.block.setPositionX(groupShape2, 60);
    engine.block.setPositionY(groupShape2, 60);

    // Helper function: Download blob and show notification
    const downloadWithNotification = async (
      blob: Blob,
      filename: string,
      mimeType: string,
      exportType: string
    ) => {
      await cesdk.utils.downloadFile(blob, mimeType as any);

      // Show notification after successful download
      cesdk.ui.showNotification({
        message: `Export "${exportType}" completed`,
        type: 'info',
        duration: 'infinite'
      });
    };

    // Override exportDesign action to export selected block or page
    cesdk.actions.register('exportDesign', async () => {
      // eslint-disable-next-line no-console
      console.log('🚀 Export action triggered');

      const selectedBlocks = engine.block.findAllSelected();
      // eslint-disable-next-line no-console
      console.log(`📦 Selected blocks: ${selectedBlocks.length}`);

      let blockToExport: number;
      if (selectedBlocks.length > 0) {
        // Export first selected block (or group them if multiple)
        blockToExport =
          selectedBlocks.length === 1
            ? selectedBlocks[0]
            : engine.block.group(selectedBlocks);
        // eslint-disable-next-line no-console
        console.log(
          `✅ Exporting selected block(s): ${selectedBlocks.length === 1 ? 'single block' : 'grouped blocks'}`
        );
      } else {
        // No selection - export current page
        const pages = engine.block.findByType('page');
        blockToExport = pages[0];
        // eslint-disable-next-line no-console
        console.log('📄 No selection - exporting current page');
      }

      // eslint-disable-next-line no-console
      console.log(`📸 Exporting block ID: ${blockToExport}`);

      // Export the block with high compression
      const blob = await engine.block.export(blockToExport, {
        mimeType: 'image/png',
        pngCompressionLevel: 9 // Maximum compression for smaller file size
      });

      // eslint-disable-next-line no-console
      console.log(
        `✨ Export complete - size: ${(blob.size / 1024).toFixed(2)} KB`
      );

      // Download the blob
      await downloadWithNotification(blob, 'export.png', 'image/png', 'Design');

      // eslint-disable-next-line no-console
      console.log('💾 Download complete');
    });

    // Helper function: Export individual block
    const exportIndividualBlock = async () => {
      // eslint-disable-next-line no-console
      console.log('🚀 Starting individual block export...');

      // Show loading dialog before export
      const exportDialog = cesdk.utils.showLoadingDialog({
        title: 'Exporting Block',
        message: 'Processing export...',
        progress: 'indeterminate'
      });

      // Find a specific block to export
      const blockToExport = imageBlock1;

      // Export the block as PNG with high compression and target size
      const individualBlob = await engine.block.export(blockToExport, {
        mimeType: 'image/png',
        pngCompressionLevel: 9, // Maximum compression for smaller file size
        targetWidth: 800, // Limit export resolution for faster exports
        targetHeight: 600
      });

      // eslint-disable-next-line no-console
      console.log(
        `✅ Individual block exported - size: ${(individualBlob.size / 1024).toFixed(2)} KB`
      );

      // Close the export dialog
      exportDialog.close();

      // Download the exported block
      await downloadWithNotification(
        individualBlob,
        'block-export.png',
        'image/png',
        'Block'
      );
    };

    // Helper function: Create and export a group
    const exportGroupExample = async () => {
      // eslint-disable-next-line no-console
      console.log('🚀 Starting group export...');

      // Show loading dialog before export
      const exportDialog = cesdk.utils.showLoadingDialog({
        title: 'Exporting Group',
        message: 'Processing export...',
        progress: 'indeterminate'
      });

      // Group the blocks together (shapes already created above)
      const exportGroup = engine.block.group([groupShape1, groupShape2]);

      // Export the group (includes all children) with high compression and target size
      const groupBlob = await engine.block.export(exportGroup, {
        mimeType: 'image/png',
        pngCompressionLevel: 9, // Maximum compression for smaller file size
        targetWidth: 800, // Limit export resolution for faster exports
        targetHeight: 600
      });

      // eslint-disable-next-line no-console
      console.log(
        `✅ Group exported - size: ${(groupBlob.size / 1024).toFixed(2)} KB`
      );

      // Close the export dialog
      exportDialog.close();

      // Download the exported group
      await downloadWithNotification(
        groupBlob,
        'group-export.png',
        'image/png',
        'Group'
      );
    };

    // Helper function: Export current page
    const exportCurrentPage = async () => {
      // Check export limits before exporting
      const maxExportSize = engine.editor.getMaxExportSize();
      const availableMemory = engine.editor.getAvailableMemory();

      // eslint-disable-next-line no-console
      console.log('🚀 Starting page export...');
      // eslint-disable-next-line no-console
      console.log(
        `📊 Export limits - Max size: ${maxExportSize}px, Available memory: ${availableMemory} bytes`
      );

      // Show loading dialog before export
      const exportDialog = cesdk.utils.showLoadingDialog({
        title: 'Exporting Page',
        message: 'Processing export...',
        progress: 'indeterminate'
      });

      // Export the entire page with high compression and target size
      const pageBlob = await engine.block.export(page, {
        mimeType: 'image/png',
        pngCompressionLevel: 9, // Maximum compression for smaller file size
        targetWidth: 800, // Limit export resolution for faster exports
        targetHeight: 600
      });

      // eslint-disable-next-line no-console
      console.log(
        `✅ Page exported - size: ${(pageBlob.size / 1024).toFixed(2)} KB`
      );

      // Close the export dialog
      exportDialog.close();

      // Download the exported page
      await downloadWithNotification(
        pageBlob,
        'page-export.png',
        'image/png',
        'Page'
      );
    };

    // Configure navigation bar layout
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        onClick: async () => await exportCurrentPage(),
        key: 'export-page',
        label: 'Export Page',
        icon: '@imgly/Save',
        variant: 'plain',
        color: 'accent'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: async () => await exportGroupExample(),
        key: 'export-group',
        label: 'Export Group',
        icon: '@imgly/Group',
        color: 'accent'
      },
      {
        id: 'ly.img.action.navigationBar',
        onClick: async () => await exportIndividualBlock(),
        key: 'export-block',
        label: 'Export Block',
        icon: '@imgly/Image',
        variant: 'plain',
        color: 'accent'
      }
    ]);

    // Show notification to guide users
    cesdk.ui.showNotification({
      message:
        'Use the export buttons on the right to try different export options (Export Page, Export Group, Export Block)',
      type: 'info',
      duration: 'infinite'
    });

    // eslint-disable-next-line no-console
    console.log('Partial export examples initialized successfully');
  }
}

export default Example;
