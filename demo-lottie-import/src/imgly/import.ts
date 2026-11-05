import type CreativeEditorSDK from '@cesdk/cesdk-js';
import {
  LottieImporter,
  type LottieImportResult
} from '@imgly/lottie-importer';

export interface ImportState {
  phase: 'ready' | 'importing' | 'error';
  message: string;
  result?: LottieImportResult;
}

export const MAX_LOTTIE_BYTES = 100_000_000;
export const FILE_SIZE_ERROR = 'Choose an animation no larger than 100 MB.';

/** Serializes file reads and imports so repeated drops cannot overlap. */
export function createImporter(
  cesdk: CreativeEditorSDK,
  onState: (state: ImportState) => void
) {
  let busy = false;
  let disposed = false;

  return {
    async run(name: string, read: () => Promise<ArrayBuffer>) {
      if (busy || disposed) {
        return;
      }
      busy = true;
      onState({ phase: 'importing', message: `Importing ${name}…` });
      try {
        if (!/\.(json|lottie)$/i.test(name)) {
          throw new Error('Choose a Lottie .json or .lottie file.');
        }
        const bytes = await read();
        if (disposed) {
          return;
        }
        if (bytes.byteLength === 0) {
          throw new Error('This file is empty. Choose another animation.');
        }
        if (bytes.byteLength > MAX_LOTTIE_BYTES) {
          throw new Error(FILE_SIZE_ERROR);
        }
        const { engine } = cesdk;
        engine.scene.setPlaying(false);
        const result = await LottieImporter.fromFile(engine, bytes);
        if (disposed) {
          return;
        }
        const page = engine.scene.getCurrentPage();
        if (page !== null) {
          engine.block.setPlaybackTime(page, 0);
        }
        engine.block.select(result.block);
        engine.editor.addUndoStep();
        onState({
          phase: 'ready',
          message: `${name} imported. Double-click a layer to edit it.`,
          result
        });
        return result;
      } catch (error) {
        if (!disposed) {
          onState({
            phase: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'The animation could not be imported. Try another file.'
          });
        }
      } finally {
        busy = false;
      }
    },
    dispose() {
      disposed = true;
    }
  };
}
