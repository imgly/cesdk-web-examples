import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import type { AssetDefinition } from '@cesdk/engine';
import { DEMO_ASSETS_BASE_URL } from '../demo-assets';

const SOURCE = 'eps-artwork';
const ENTRY = 'eps-artwork-library';
const MIME = 'application/postscript';

interface EPSGalleryOptions {
  /** The host chooses placement, replacement, progress and cancellation. */
  importFile: (file: File) => Promise<number | undefined>;
  onAdded?: (filename: string) => void;
}

/** Session-local Gallery integration using public editor APIs only. */
export class EPSGalleryPlugin implements EditorPlugin {
  readonly name = 'eps-artwork-gallery';
  readonly version = '1.0.0';
  private cesdk?: CreativeEditorSDK;
  private readonly urls = new Set<string>();
  private readonly lifetime = new AbortController();
  private applying = false;

  constructor(private readonly options: EPSGalleryOptions) {}

  initialize({ cesdk, engine }: EditorPluginContext) {
    if (!cesdk) throw new Error('EPS Gallery requires the editor UI.');
    this.cesdk = cesdk;
    engine.asset.addLocalSource(SOURCE, [MIME], async (asset) => {
      if (this.applying) throw new Error('Wait for the current EPS import.');
      this.applying = true;
      try {
        const response = await fetch(asset.meta!.uri!, {
          signal: this.lifetime.signal
        });
        if (!response.ok) throw new Error('The EPS file could not be loaded.');
        const file = new File(
          [await response.blob()],
          asset.meta?.filename ?? asset.label ?? 'artwork.eps',
          { type: MIME }
        );
        this.lifetime.signal.throwIfAborted();
        return await this.options.importFile(file);
      } finally {
        this.applying = false;
      }
    });

    // Intercept only our source. Existing image/video uploads keep their handler.
    const upload = cesdk.actions.get('uploadFile');
    cesdk.actions.register('uploadFile', async (file, onProgress, context) => {
      if (context?.sourceId !== SOURCE) {
        if (!upload) throw new Error('No upload handler is configured.');
        return upload(file, onProgress, context);
      }
      const asset = this.createAsset(file);
      onProgress(1);
      this.options.onAdded?.(file.name);
      return asset;
    });
    const restriction = engine.editor.getSetting('upload/supportedMimeTypes');
    if (restriction && !restriction.split(',').includes(MIME)) {
      engine.editor.setSetting(
        'upload/supportedMimeTypes',
        `${restriction},${MIME}`
      );
    }
    cesdk.ui.addAssetLibraryEntry({
      id: ENTRY,
      sourceIds: [SOURCE],
      title: 'EPS Artwork',
      canAdd: true,
      canRemove: false,
      gridColumns: 2,
      gridItemHeight: 'square',
      cardLabel: (asset) => asset.label ?? 'EPS artwork',
      cardLabelPosition: () => 'below'
    });
    const order = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...order,
      {
        id: 'ly.img.assetLibrary.dock',
        key: SOURCE,
        label: 'EPS Artwork',
        icon: '@imgly/Upload',
        entries: [ENTRY]
      }
    ]);
    engine.asset.addAssetToSource(SOURCE, {
      id: 'eps-sample',
      label: { en: 'Cyan, black & white' },
      meta: {
        uri: new URL('artwork.eps', DEMO_ASSETS_BASE_URL).href,
        thumbUri: new URL('artwork.svg', DEMO_ASSETS_BASE_URL).href,
        filename: 'artwork.eps',
        mimeType: MIME
      }
    });
  }

  /** Also accepts DOS EPS/EPSI files whose MIME type browsers cannot detect. */
  addFile(file: File) {
    if (!this.cesdk) throw new Error('Initialize EPS Gallery first.');
    this.cesdk.engine.asset.addAssetToSource(SOURCE, this.createAsset(file));
    this.options.onAdded?.(file.name);
    this.open();
  }

  open() {
    this.cesdk?.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: { entries: [ENTRY], title: 'EPS Artwork' }
    });
  }

  /** Call before disposing the editor. Uploaded assets live for this session. */
  dispose() {
    this.lifetime.abort();
    for (const url of this.urls) URL.revokeObjectURL(url);
    this.urls.clear();
  }

  private createAsset(file: File): AssetDefinition {
    if (!/\.eps[fi]?$/i.test(file.name)) {
      throw new Error('Choose an EPS, EPSF or EPSI file.');
    }
    if (file.size === 0) throw new Error('The EPS file is empty.');
    const uri = URL.createObjectURL(file);
    this.urls.add(uri);
    return {
      id: crypto.randomUUID(),
      label: { en: file.name },
      meta: {
        uri,
        filename: file.name,
        mimeType: MIME,
        thumbUri: new URL('eps-file.svg', DEMO_ASSETS_BASE_URL).href
      }
    };
  }
}
