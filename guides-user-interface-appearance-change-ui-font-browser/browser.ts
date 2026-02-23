import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { PagePresetsAssetSource } from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';

export async function initialize(cesdk: CreativeEditorSDK) {
  await cesdk.addPlugin(new DesignEditorConfig());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  // Create a design scene to showcase the UI font customization
  await cesdk.actions.run('scene.create', {
    page: {
      sourceId: 'ly.img.page.presets',
      assetId: 'ly.img.page.presets.print.iso.a6.landscape'
    }
  });

  // Add a text block to demonstrate the design canvas
  const page = cesdk.engine.block.findByType('page')[0];
  const text = cesdk.engine.block.create('text');
  cesdk.engine.block.setString(text, 'text/text', 'Monospace UI Font');
  cesdk.engine.block.setWidth(text, 400);
  cesdk.engine.block.setPositionX(
    text,
    cesdk.engine.block.getWidth(page) / 2 - 200
  );
  cesdk.engine.block.setPositionY(
    text,
    cesdk.engine.block.getHeight(page) / 2 - 50
  );
  cesdk.engine.block.appendChild(page, text);

  // You can verify the current theme and scale settings
  const currentTheme = cesdk.ui.getTheme(); // 'light' or 'dark'
  const currentScale = cesdk.ui.getScale(); // 'normal', 'large', or 'modern'
  console.log('Current theme:', currentTheme);
  console.log('Current scale:', currentScale);

  // Optional: Change theme to see font in different contexts
  // Uncomment to test:
  // cesdk.ui.setTheme('dark');
  // cesdk.ui.setScale('large');

  // Zoom to fit the page
  await cesdk.engine.scene.zoomToBlock(page);
}
