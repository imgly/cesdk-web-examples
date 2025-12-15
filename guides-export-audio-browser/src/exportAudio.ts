export async function exportAudioFromBlock(cesdk, blockId) {
  const audioBlob = await cesdk.engine.block.exportAudio(blockId, {
    mimeType: 'audio/wav',
    sampleRate: 48000,
    numberOfChannels: 2
  });

  console.log(`Audio exported: ${audioBlob.size} bytes`);
  return audioBlob;
}

export async function exportAudioWithUI(cesdk, blockId, progressBar) {
  const audioBlob = await cesdk.engine.block.exportAudio(blockId, {
    mimeType: 'audio/wav',
    sampleRate: 48000,
    numberOfChannels: 2,
    onProgress: (rendered, encoded, total) => {
      const progress = total > 0 ? (rendered / total) * 100 : 0;
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    }
  });

  return audioBlob;
}

export function downloadAudioBlob(audioBlob, filename = 'audio.wav') {
  const url = URL.createObjectURL(audioBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
