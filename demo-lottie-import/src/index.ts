import { initEditor } from './imgly';
import { DEMO_ASSETS_BASE_URL } from './imgly/demo-assets';
import {
  createImporter,
  FILE_SIZE_ERROR,
  MAX_LOTTIE_BYTES,
  type ImportState
} from './imgly/import';
import './styles.css';


function element<T extends HTMLElement>(id: string): T {
  const value = document.getElementById(id);
  if (!value) {
    throw new Error(`Missing showcase element: ${id}`);
  }
  return value as T;
}

const upload = element<HTMLButtonElement>('upload');
const fileInput = element<HTMLInputElement>('file-input');
const dropZone = element<HTMLDivElement>('drop-zone');
const status = element<HTMLParagraphElement>('status');
const statusRegion = element<HTMLElement>('status-region');
const report = element<HTMLElement>('report');
const fallbackSummary = element<HTMLParagraphElement>('fallback-summary');
const fallbackLayers = element<HTMLUListElement>('fallback-layers');
const archiveNote = element<HTMLParagraphElement>('archive-note');
const samples = [
  ...document.querySelectorAll<HTMLButtonElement>('[data-sample]')
];
const editorLifetime = new AbortController();
let importer: ReturnType<typeof createImporter> | undefined;
let disposed = false;

function renderState({ phase, message, result }: ImportState) {
  status.textContent = message;
  statusRegion.dataset.state = phase;
  statusRegion.setAttribute('aria-busy', String(phase === 'importing'));
  upload.disabled = phase === 'importing';
  for (const button of samples) {
    button.disabled = phase === 'importing';
  }
  dropZone.classList.remove('drag-over');
  if (!result) {
    return;
  }
  fallbackSummary.textContent =
    result.fallbackLayers.length === 0
      ? 'Every layer imported as editable blocks.'
      : 'Some layers play as an animation fill. Their content cannot be edited; the other layers stay editable.';
  fallbackLayers.replaceChildren();
  for (const layer of result.fallbackLayers) {
    const item = document.createElement('li');
    item.textContent = `${layer.name || `Layer ${layer.layerIndex}`}: ${
      layer.reason
    }`;
    fallbackLayers.append(item);
  }
  archiveNote.textContent =
    result.ignoredArchiveEntries.length > 0
      ? `Archive entries not imported: ${result.ignoredArchiveEntries.join(
          ', '
        )}.`
      : '';
  report.hidden = false;
}

function importFile(file: File) {
  if (upload.disabled || disposed) {
    return;
  }
  if (file.size > MAX_LOTTIE_BYTES) {
    renderState({ phase: 'error', message: FILE_SIZE_ERROR });
    return;
  }
  void importer?.run(file.name, () => file.arrayBuffer());
}

upload.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  fileInput.value = '';
  if (file) {
    importFile(file);
  }
});
for (const button of samples) {
  button.addEventListener('click', () => {
    const name = button.dataset.sample!;
    void importer?.run(name, async () => {
      const response = await fetch(`${DEMO_ASSETS_BASE_URL}/${name}`);
      if (!response.ok) {
        throw new Error(
          'The sample could not be loaded. Try again or choose a file.'
        );
      }
      return response.arrayBuffer();
    });
  });
}
for (const event of ['dragenter', 'dragover'] as const) {
  dropZone.addEventListener(event, (e) => {
    e.preventDefault();
    if (!upload.disabled) {
      dropZone.classList.add('drag-over');
    }
  });
}
dropZone.addEventListener('dragleave', (event) => {
  if (!dropZone.contains(event.relatedTarget as Node | null)) {
    dropZone.classList.remove('drag-over');
  }
});
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = event.dataTransfer?.files[0];
  if (file) {
    importFile(file);
  }
});

async function initialize() {
  const cesdk = await initEditor(editorLifetime.signal);
  if (!cesdk) {
    return;
  }
  importer = createImporter(cesdk, renderState);
  renderState({
    phase: 'ready',
    message: 'Choose a sample or drop a .json or .lottie file to begin.'
  });
}

window.addEventListener('pagehide', () => {
  disposed = true;
  importer?.dispose();
  editorLifetime.abort();
});

void initialize().catch((error: unknown) => {
  status.textContent = `The editor could not be opened. ${
    error instanceof Error ? error.message : 'Reload to try again.'
  }`;
  statusRegion.dataset.state = 'error';
  statusRegion.setAttribute('aria-busy', 'false');
});
