import type CreativeEditorSDK from '@cesdk/cesdk-js';

export async function exportAudioFromBlock(
  cesdk: CreativeEditorSDK,
  blockId: number
): Promise<Blob> {
  const audioBlob = await cesdk.engine.block.exportAudio(blockId, {
    mimeType: 'audio/wav',
    sampleRate: 48000,
    numberOfChannels: 2
  });

  console.log(`Audio exported: ${audioBlob.size} bytes`);
  return audioBlob;
}

export async function exportAudioWithUI(
  cesdk: CreativeEditorSDK,
  blockId: number,
  progressBar?: HTMLElement | null
): Promise<Blob> {
  const audioBlob = await cesdk.engine.block.exportAudio(blockId, {
    mimeType: 'audio/wav',
    sampleRate: 48000,
    numberOfChannels: 2,
    onProgress: (rendered: number, encoded: number, total: number) => {
      const progress = total > 0 ? (rendered / total) * 100 : 0;
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    }
  });

  return audioBlob;
}

export function downloadAudioBlob(audioBlob: Blob, filename = 'audio.wav') {
  const url = URL.createObjectURL(audioBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
