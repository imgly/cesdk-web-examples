import CreativeEditorSDK from '@cesdk/cesdk-js';
import type { ConversionRuntime } from '@imgly/pdf-conversion-utils';
import { ARTWORK_FRAME, EPSGalleryPlugin, initEditor } from './imgly';
import './styles.css';


function element<T extends HTMLElement>(id: string): T {
  const result = document.getElementById(id);
  if (!result) throw new Error(`Missing demo element: ${id}`);
  return result as T;
}

const upload = element<HTMLButtonElement>('upload');
const sample = element<HTMLButtonElement>('sample');
const fileInput = element<HTMLInputElement>('file-input');
const destination = element<HTMLFieldSetElement>('destination');
const replaceMode = element<HTMLInputElement>('replace-mode');
const showPlaceholder = element<HTMLButtonElement>('select-placeholder');
const dropZone = element<HTMLDivElement>('drop-zone');
const status = element<HTMLParagraphElement>('status');
const statusRegion = element<HTMLElement>('status-region');
const progress = element<HTMLProgressElement>('progress');
const cancel = element<HTMLButtonElement>('cancel');
const retry = element<HTMLButtonElement>('retry');
const exportButton = element<HTMLButtonElement>('export');
const diagnostics = element<HTMLDetailsElement>('diagnostics');
const diagnosticsList = element<HTMLUListElement>('diagnostics-list');

type ImportRequest = { file: File; replacePlaceholder: boolean };
let cesdk: CreativeEditorSDK;
let gallery: EPSGalleryPlugin;
let page: number;
let runtime: ConversionRuntime | undefined;
let activeImport: AbortController | undefined;
let lastRequest: ImportRequest | undefined;
let ready = false;
let busy = true;
let disposed = false;
let unsubscribeBlocks: (() => void) | undefined;

function setStatus(message: string, state: 'ready' | 'busy' | 'error') {
  status.textContent = message;
  statusRegion.dataset.state = state;
  statusRegion.setAttribute('aria-busy', String(state === 'busy'));
  progress.hidden = state !== 'busy';
}

// Undo can restore the slot with a different block ID. Resolve its metadata
// whenever the user starts an action; the replacement group shares the metadata
// but is deliberately excluded because it is no longer a graphic placeholder.
function findPlaceholder() {
  const { block } = cesdk.engine;
  return block
    .findByType('graphic')
    .find(
      (id) =>
        block.hasMetadata(id, 'eps-demo/slot') &&
        block.getMetadata(id, 'eps-demo/slot') === 'artwork' &&
        block.isPlaceholderEnabled(id)
    );
}

function selectPlaceholder() {
  if (!ready) return;
  const target = findPlaceholder();
  if (target != null) cesdk.engine.block.select(target);
  refreshControls();
}

function refreshControls() {
  upload.disabled = !ready || busy;
  sample.disabled = !ready || busy;
  destination.disabled = !ready || busy;
  exportButton.disabled = !ready || busy;
  const hasPlaceholder = ready && findPlaceholder() != null;
  replaceMode.disabled = !hasPlaceholder;
  showPlaceholder.disabled = !hasPlaceholder;
  if (!hasPlaceholder) {
    document.querySelector<HTMLInputElement>('input[value="place"]')!.checked =
      true;
  }
  cancel.hidden = !activeImport;
}

function addToGallery(file: File) {
  if (!ready || busy) return;
  try {
    gallery.addFile(file);
  } catch (error) {
    setStatus(
      error instanceof Error ? error.message : 'Could not add EPS file.',
      'error'
    );
  }
}

async function importArtwork(request: ImportRequest) {
  if (!ready || busy) return;
  lastRequest = request;
  busy = true;
  const controller = new AbortController();
  activeImport = controller;
  cancel.disabled = false;
  retry.hidden = true;
  diagnostics.hidden = true;
  diagnosticsList.replaceChildren();
  refreshControls();
  setStatus(`Preparing ${request.file.name}…`, 'busy');

  try {
    const target = request.replacePlaceholder ? findPlaceholder() : undefined;
    if (request.replacePlaceholder && target == null) {
      throw new Error(
        'The artwork placeholder no longer exists. Undo to restore it before retrying.'
      );
    }
    const [{ placeEPS, replaceEPS }, { createConversionRuntime }] =
      await Promise.all([
        import('@imgly/eps-importer'),
        import('@imgly/pdf-conversion-utils')
      ]);
    controller.signal.throwIfAborted();
    runtime ??= createConversionRuntime({
      assetBaseURL:
        new URL('pdf-conversion/', document.baseURI)
    });
    setStatus(`Importing ${request.file.name}…`, 'busy');
    const result =
      target == null
        ? await placeEPS(cesdk.engine, request.file, {
            parent: page,
            frame: ARTWORK_FRAME,
            runtime,
            signal: controller.signal
          })
        : await replaceEPS(cesdk.engine, request.file, {
            target,
            runtime,
            signal: controller.signal
          });
    cesdk.engine.block.select(result.group);

    setStatus(
      `${
        request.file.name
      } imported as one group. ${result.sourceBounds.width.toFixed(
        1
      )} × ${result.sourceBounds.height.toFixed(1)} pt.`,
      'ready'
    );
    for (const diagnostic of result.diagnostics) {
      const item = document.createElement('li');
      item.textContent = `${diagnostic.severity}: ${diagnostic.message}`;
      diagnosticsList.append(item);
    }
    diagnostics.hidden = result.diagnostics.length === 0;
    return result.group;
  } catch (error) {
    if (disposed) return;
    const cancelled = controller.signal.aborted;
    setStatus(
      cancelled
        ? 'Import cancelled. Your design is ready to edit.'
        : error instanceof Error
          ? error.message
          : 'The EPS import failed. Please try again.',
      cancelled ? 'ready' : 'error'
    );
    retry.hidden = false;
  } finally {
    activeImport = undefined;
    busy = false;
    if (!disposed) refreshControls();
  }
}

upload.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  fileInput.value = '';
  if (file) addToGallery(file);
});
sample.addEventListener('click', () => gallery.open());
cancel.addEventListener('click', () => {
  activeImport?.abort();
  cancel.disabled = true;
  setStatus('Cancelling import…', 'busy');
});
retry.addEventListener('click', () => {
  cancel.disabled = false;
  if (lastRequest) void importArtwork(lastRequest);
});
showPlaceholder.addEventListener('click', selectPlaceholder);
replaceMode.addEventListener('change', () => {
  if (replaceMode.checked) selectPlaceholder();
});

for (const event of ['dragenter', 'dragover'] as const) {
  dropZone.addEventListener(event, (e) => {
    e.preventDefault();
    if (!busy && ready) dropZone.classList.add('drag-over');
  });
}
dropZone.addEventListener('dragleave', () =>
  dropZone.classList.remove('drag-over')
);
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = event.dataTransfer?.files[0];
  if (file) addToGallery(file);
});

exportButton.addEventListener('click', () => {
  if (!ready || busy) return;
  busy = true;
  retry.hidden = true;
  refreshControls();
  setStatus('Exporting PDF…', 'busy');
  void cesdk.engine.block
    .export(page, {
      mimeType: 'application/pdf',
      exportPdfWithDeviceCMYK: true
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'eps-artwork.pdf';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus('Your PDF is ready.', 'ready');
    })
    .catch((error: Error) => setStatus(error.message, 'error'))
    .finally(() => {
      busy = false;
      if (!disposed) refreshControls();
    });
});

async function initialize() {
  cesdk = await CreativeEditorSDK.create('#cesdk-container', {
    userId: 'eps-import-demo'
  });
  if (disposed) {
    cesdk.dispose();
    return;
  }
  ({ page } = initEditor(cesdk));
  await cesdk.actions.run('zoom.toBlock', page, {
    padding: 36,
    animate: false,
    autoFit: true
  });
  gallery = new EPSGalleryPlugin({
    importFile: (file) =>
      importArtwork({
        file,
        replacePlaceholder: replaceMode.checked
      }),
    onAdded: (name) => {
      if (!busy) {
        setStatus(
          `${name} added to the Gallery. Select it to insert artwork.`,
          'ready'
        );
      }
    }
  });
  await cesdk.addPlugin(gallery);
  ready = true;
  busy = false;
  unsubscribeBlocks = cesdk.engine.event.subscribe([], (events) => {
    if (events.some(({ type }) => type === 'Created' || type === 'Destroyed')) {
      refreshControls();
    }
  });
  setStatus(
    'Select artwork in the EPS Gallery, or upload your own EPS file.',
    'ready'
  );
  gallery.open();
  refreshControls();
}

window.addEventListener('pagehide', () => {
  disposed = true;
  activeImport?.abort();
  unsubscribeBlocks?.();
  gallery?.dispose();
  runtime?.dispose();
  cesdk?.dispose();
});

void initialize().catch((error: Error) => {
  setStatus(`The editor could not be opened. ${error.message}`, 'error');
});
