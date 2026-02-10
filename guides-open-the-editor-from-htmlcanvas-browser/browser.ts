import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (cesdk == null) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    const engine = cesdk.engine;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      throw new Error('Could not get 2D context');
    }

    // Draw a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, '#4158D0');
    gradient.addColorStop(0.5, '#C850C0');
    gradient.addColorStop(1, '#FFCC70');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Draw "img.ly" text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('img.ly', 256, 256);

    const dataURL = canvas.toDataURL();

    // Second parameter is DPI: 72 for screen, 300 for print (default)
    await engine.scene.createFromImage(dataURL);

    // Enable auto-fit zoom on the page
    const pages = engine.block.findByType('page');
    if (pages.length > 0) {
      engine.scene.enableZoomAutoFit(pages[0], 'Both', 40, 40, 40, 40);
    }
  }
}

export default Example;
