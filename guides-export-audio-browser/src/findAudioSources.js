export function findAudioSources(cesdk) {
  const audioSources = [];

  // Find audio blocks
  const audioBlocks = cesdk.engine.block.findByType('audio');
  audioBlocks.forEach(block => {
    audioSources.push({
      id: block,
      name: cesdk.engine.block.getName(block) || 'Audio Block'
    });
  });

  // Find video fills with audio
  const videoFills = cesdk.engine.block.findByType('//ly.img.ubq/fill/video');
  videoFills.forEach(block => {
    try {
      const audioInfo = cesdk.engine.block.getAudioInfoFromVideo(block);
      if (audioInfo && audioInfo.length > 0) {
        audioSources.push({
          id: block,
          name: cesdk.engine.block.getName(block) || 'Video Block'
        });
      }
    } catch (error) {
      // Video has no audio
    }
  });

  return audioSources;
}

export async function selectAudioSource(cesdk, sourceOrBlockId) {
  cesdk.engine.block.deselectAll();

  // Handle both source objects {id: ...} and plain block IDs
  const blockId = typeof sourceOrBlockId === 'object' ? sourceOrBlockId.id : sourceOrBlockId;

  // If it's a fill, select the parent block instead
  const blockType = cesdk.engine.block.getType(blockId);
  const blockToSelect = blockType.includes('/fill/')
    ? cesdk.engine.block.findByType('graphic').find(graphic =>
        cesdk.engine.block.getFill(graphic) === blockId)
    : blockId;

  if (blockToSelect) {
    cesdk.engine.block.select(blockToSelect);
    await cesdk.engine.block.forceLoadAVResource(blockToSelect);
  }
}
