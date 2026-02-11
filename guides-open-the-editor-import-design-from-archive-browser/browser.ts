import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load default asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });

    // Start with a blank design scene
    await cesdk.actions.run('scene.create', {
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;

    // ===== Method 1: Load Archive from URL =====
    // Archives are self-contained ZIP files containing both the scene
    // structure and all referenced assets (images, fonts, videos, etc.)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _archiveUrl = 'https://example.com/designs/project-bundle.zip';

    // Load the archive using loadFromArchiveURL
    // await engine.scene.loadFromArchiveURL(_archiveUrl);

    // The scene is now loaded with all bundled assets

    // ===== Method 2: Load Archive from User Upload =====
    // For user-uploaded archive files, create an object URL from the File

    // Pattern for handling user uploads (attach to a button in your UI):
    const handleFileUpload = async (file: File) => {
      const userArchiveUrl = URL.createObjectURL(file);

      try {
        await engine.scene.loadFromArchiveURL(userArchiveUrl);
        console.log('User archive loaded successfully');
      } catch (error) {
        console.error('Failed to load user archive:', error);
      } finally {
        URL.revokeObjectURL(userArchiveUrl);
      }
    };

    // Example: Create file input for user uploads
    // In production, attach this to your UI button
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.zip';
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleFileUpload(file);
      }
    };

    // ===== Method 3: Load Archive from Blob =====
    // When you have an archive as a Blob (from fetch, API, or database),
    // create an object URL and load it

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _loadArchiveFromBlob = async (archiveBlob: Blob): Promise<void> => {
      const blobUrl = URL.createObjectURL(archiveBlob);

      try {
        await engine.scene.loadFromArchiveURL(blobUrl);
        console.log('Archive loaded from blob successfully');
      } catch (error) {
        console.error('Failed to load archive from blob:', error);
        throw error;
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    };

    // In production, this blob would come from your API or storage
    // await _loadArchiveFromBlob(archiveBlob);

    // ===== Method 4: Modify Loaded Archive =====
    // After loading an archive, the scene is immediately editable
    // All blocks and assets from the archive are available

    // const textBlocks = engine.block.findByType('text');
    // if (textBlocks.length > 0) {
    //   engine.block.setString(textBlocks[0], 'text/text', 'Loaded from Archive');
    //   // Archive loads can be undone: engine.editor.undo();
    // }

    // ===== Understanding Archive Contents =====
    // Archives contain:
    // 1. scene.json - The scene structure and properties
    // 2. Asset directories (images/, fonts/, videos/, audio/)
    // 3. Relative asset references like "./images/photo-123.jpg"

    // This self-contained structure makes archives portable:
    // - No external URL dependencies
    // - All assets bundled together
    // - Works offline or across different environments

    // Create a visual demonstration showing the archive loading workflow
    const page = engine.block.findByType('page')[0];

    const layout = calculateGridLayout(1920, 1080, 3, {
      spacing: 40,
      margin: 80
    });

    // Create visual elements showing the workflow
    const step1Block = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      {
        ...layout.getPosition(0),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    const step2Block = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      {
        ...layout.getPosition(1),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    const step3Block = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      {
        ...layout.getPosition(2),
        size: { width: layout.blockWidth, height: layout.blockHeight }
      }
    );

    engine.block.appendChild(page, step1Block);
    engine.block.appendChild(page, step2Block);
    engine.block.appendChild(page, step3Block);

    // Add labels
    const labels = ['1. Create Archive', '2. Store Archive', '3. Load Archive'];

    const blocks = [step1Block, step2Block, step3Block];
    blocks.forEach((block, index) => {
      engine.block.appendChild(page, block);

      const label = engine.block.create('text');
      const pos = layout.getPosition(index);

      engine.block.setString(label, 'text/text', labels[index]);
      engine.block.setWidth(label, layout.blockWidth);
      engine.block.setPositionX(label, pos.x);
      engine.block.setPositionY(label, pos.y + layout.blockHeight + 20);
      engine.block.setFloat(label, 'text/fontSize', 32);
      engine.block.setColor(label, 'fill/solid/color', {
        r: 0.2,
        g: 0.2,
        b: 0.2,
        a: 1.0
      });

      engine.block.appendChild(page, label);
    });

    // Zoom to show full canvas
    await engine.scene.zoomToBlock(page, {
      padding: 40
    });
  }
}

export default Example;
