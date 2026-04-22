import type {
  CreativeEngine,
  EditorPlugin,
  EditorPluginContext
} from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { VideoEditorConfig } from './video-editor/plugin';
import packageJson from './package.json';

import { exportHtml, injectGsapPlayer } from '@imgly/html-exporter';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load the video editor config (provides full UI: navigation, dock, inspector, canvas, panels)
    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins (populates editor panels with content)
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: ['ly.img.image.*']
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    // Create a video scene (enables animation timeline)
    await cesdk.actions.run('scene.create', { mode: 'Video' });

    const engine = cesdk.engine;

    // Register an "Export HTML5" button in the navigation bar
    let isExporting = false;

    cesdk.ui.registerComponent(
      'ly.img.html5-export.navigationBar',
      ({ builder }) => {
        builder.Button('html5-export-preview', {
          color: 'accent',
          variant: 'regular',
          label: 'Export and Preview HTML5',
          isLoading: isExporting,
          isDisabled: isExporting,
          onClick: async () => {
            if (isExporting) return;
            isExporting = true;
            try {
              await previewHtml5(engine);
            } finally {
              isExporting = false;
            }
          }
        });
        builder.Button('html5-export-download', {
          variant: 'regular',
          label: 'Download ZIP',
          isLoading: isExporting,
          isDisabled: isExporting,
          onClick: async () => {
            if (isExporting) return;
            isExporting = true;
            try {
              await downloadHtml5Zip(engine);
            } finally {
              isExporting = false;
            }
          }
        });
      }
    );

    // Add the export buttons to the navigation bar
    cesdk.ui.setNavigationBarOrder([
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      'ly.img.zoom.navigationBar',
      'ly.img.html5-export.navigationBar'
    ]);
  }
}

async function previewHtml5(engine: CreativeEngine) {
  // Export as a single self-contained HTML file (base64-embedded assets)
  const embeddedResult = await exportHtml(engine, {
    format: 'embedded',
    pageIndex: 0
  });

  // Inject the GSAP library to make animations playable
  const htmlFile = embeddedResult.files.get('index.html');
  const htmlContent =
    typeof htmlFile!.content === 'string'
      ? htmlFile!.content
      : new TextDecoder().decode(htmlFile!.content);

  const playableHtml = injectGsapPlayer(htmlContent);

  // Open a preview in a new browser tab
  const previewBlob = new Blob([playableHtml], { type: 'text/html' });
  window.open(URL.createObjectURL(previewBlob), '_blank');
}

async function downloadHtml5Zip(engine: CreativeEngine) {
  const page = engine.block.findByType('page')[0];

  // Export the first page as an external HTML5 bundle (HTML + separate assets)
  const externalResult = await exportHtml(engine, {
    format: 'external',
    pageIndex: 0
  });

  // The result contains a FileMap with all generated files
  console.log('External export files:');
  for (const [path] of externalResult.files) {
    console.log(`  ${path}`);
  }

  // Check for warnings or errors during export
  if (externalResult.messages && externalResult.messages.length > 0) {
    for (const msg of externalResult.messages) {
      console.log(`[${msg.type}] ${msg.message}`);
    }
  }

  // Read the index.html from the external export and inject metadata
  let html = externalResult.files.get('index.html')!.content as string;

  // Inject an ad.size meta tag into the <head>
  const pageWidth = Math.round(engine.block.getWidth(page));
  const pageHeight = Math.round(engine.block.getHeight(page));
  html = html.replace(
    '</head>',
    `  <meta name="ad.size" content="width=${pageWidth},height=${pageHeight}">\n</head>`
  );

  // Inject a click-tracking script before </body>
  const clickScript = `
<script>
  var clickTag = "https://example.com";
  document.addEventListener("click", function() {
    window.open(clickTag, "_blank");
  });
</script>`;
  html = html.replace('</body>', clickScript + '\n</body>');

  // Write the modified HTML back to the FileMap
  externalResult.files.set('index.html', {
    content: html,
    mimeType: 'text/html'
  });

  // Add a manifest.json describing the bundle
  externalResult.files.set('manifest.json', {
    content: JSON.stringify(
      {
        version: '1.0',
        title: 'My Creative',
        width: pageWidth,
        height: pageHeight,
        source: 'index.html'
      },
      null,
      2
    ),
    mimeType: 'application/json'
  });

  // Generate a static backup image and add it to the bundle
  const backupBlob = await engine.block.export(page, {
    mimeType: 'image/jpeg',
    jpegQuality: 0.8,
    targetWidth: pageWidth,
    targetHeight: pageHeight
  });
  const backupBytes = new Uint8Array(await backupBlob.arrayBuffer());
  externalResult.files.set('backup.jpg', {
    content: backupBytes,
    mimeType: 'image/jpeg'
  });

  // Package all files as a ZIP and trigger a browser download
  const zip = await externalResult.files.toZip();
  const downloadBlob = new Blob([zip.buffer as ArrayBuffer], {
    type: 'application/zip'
  });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(downloadBlob);
  a.download = 'html5-export.zip';
  a.click();
}

export default Example;
