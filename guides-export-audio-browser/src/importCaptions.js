export async function importCaptionsToScene(cesdk, srtContent, sourceId = null) {
  // Debug: Log the SRT content being imported
  console.log('Importing SRT content (length: ' + srtContent.length + ' chars):', srtContent.substring(0, 100) + '...');

  try {
    // Get the page
    const page = cesdk.engine.scene.getCurrentPage();
    const pageWidth = cesdk.engine.block.getWidth(page);
    const pageHeight = cesdk.engine.block.getHeight(page);

    // Destroy existing caption track FIRST, before creating new captions
    let captionTrack = getCaptionTrack(cesdk);
    if (captionTrack) {
      // Destroy the existing caption track completely to avoid CE.SDK caching old caption blocks
      console.log('Destroying existing caption track');
      cesdk.engine.block.destroy(captionTrack);
      captionTrack = null;
    }

    // Use data URL with base64 encoding for proper UTF-8 support (handles special characters)
    // Convert UTF-8 string to base64 properly using TextEncoder
    const utf8Bytes = new TextEncoder().encode(srtContent);
    const base64SRT = btoa(String.fromCharCode(...utf8Bytes));
    const captionURI = `data:text/srt;charset=utf-8;base64,${base64SRT}`;
    console.log('Created base64 data URL with mime type: text/srt, length:', captionURI.length);
    console.log('Base64 encoded SRT (first 100 chars):', base64SRT.substring(0, 100));

    // Verify decoding works correctly
    const decodedBytes = Uint8Array.from(atob(base64SRT), c => c.charCodeAt(0));
    const decodedText = new TextDecoder().decode(decodedBytes);
    console.log('Decoded back to verify:', decodedText.substring(0, 100));

    // Import captions from the URI AFTER destroying old track
    const captionBlocks = await cesdk.engine.block.createCaptionsFromURI(captionURI);
    console.log('Created', captionBlocks.length, 'caption blocks from URI');

    // Verify what CE.SDK actually created by checking the first caption's text
    if (captionBlocks.length > 0) {
      try {
        const firstCaptionText = cesdk.engine.block.getString(captionBlocks[0], 'text/text');
        console.log('First caption block text from CE.SDK:', firstCaptionText);
      } catch (e) {
        console.log('Could not read first caption text:', e.message);
      }
    }

    // Always create a fresh caption track
    captionTrack = cesdk.engine.block.create('//ly.img.ubq/captionTrack');
    cesdk.engine.block.appendChild(page, captionTrack);
    console.log('Created new caption track');

    // Add caption blocks to the track (not to the page)
    captionBlocks.forEach(captionBlock => {
      // Add the caption block to the caption track (this makes it visible in the timeline)
      cesdk.engine.block.appendChild(captionTrack, captionBlock);

      // Style the caption text
      styleCaptionBlock(cesdk, captionBlock);
    });

    console.log(`Imported and added ${captionBlocks.length} caption blocks to the caption track`);

    // Apply the "Comic" caption preset to all captions
    try {
      await applyComicPresetToCaptions(cesdk, captionBlocks);
    } catch (error) {
      console.warn('Failed to apply Comic preset to captions:', error);
    }

    // Position captions at top-left (0, 0)
    captionBlocks.forEach(captionBlock => {
      cesdk.engine.block.setPositionX(captionBlock, 0);
      cesdk.engine.block.setPositionY(captionBlock, 0);
    });

    // Mute all audio sources except the one corresponding to these captions
    if (sourceId) {
      muteAllAudioSourcesExcept(cesdk, sourceId);
    }

    return captionBlocks;
  } catch (error) {
    console.error('Failed to import captions:', error);
    throw error;
  }
}

// Helper function to mute all audio sources except the specified one
function muteAllAudioSourcesExcept(cesdk, activeSourceId) {
  console.log('Muting all audio sources except:', activeSourceId);

  // Get all blocks in the scene
  const allBlocks = cesdk.engine.block.findAll();

  allBlocks.forEach(blockId => {
    try {
      const blockType = cesdk.engine.block.getType(blockId);

      // Handle audio blocks
      if (blockType === '//ly.img.ubq/audio') {
        const shouldMute = blockId !== activeSourceId;
        cesdk.engine.block.setMuted(blockId, shouldMute);
        console.log(`${shouldMute ? 'Muted' : 'Unmuted'} audio block:`, blockId);
      }

      // Handle video fills (which contain audio)
      if (blockType === '//ly.img.ubq/fill/video') {
        const shouldMute = blockId !== activeSourceId;
        cesdk.engine.block.setMuted(blockId, shouldMute);
        console.log(`${shouldMute ? 'Muted' : 'Unmuted'} video fill:`, blockId);
      }

      // Handle graphic blocks with video fills
      if (blockType === '//ly.img.ubq/graphic') {
        try {
          const fill = cesdk.engine.block.getFill(blockId);
          const fillType = cesdk.engine.block.getType(fill);
          if (fillType === '//ly.img.ubq/fill/video') {
            // Check if this video fill is the active source
            const shouldMute = fill !== activeSourceId;
            cesdk.engine.block.setMuted(fill, shouldMute);
            console.log(`${shouldMute ? 'Muted' : 'Unmuted'} video fill from graphic:`, fill);
          }
        } catch (e) {
          // Block doesn't have a fill or other error
        }
      }
    } catch (error) {
      // Ignore blocks that don't support these operations
    }
  });
}

// Helper function to apply Comic preset to caption blocks
async function applyComicPresetToCaptions(cesdk, captionBlocks) {
  if (captionBlocks.length === 0) return;

  // The Comic preset asset ID from the caption presets source
  const comicPresetId = '//ly.img.captionPresets/comic';
  const captionPresetsSourceId = 'ly.img.captionPresets';

  try {
    // Query assets to find the Comic preset
    const result = await cesdk.engine.asset.findAssets(captionPresetsSourceId, {
      page: 0,
      perPage: 100
    });

    // Find the Comic preset in the results
    const comicAsset = result.assets.find(asset => asset.id === comicPresetId);

    if (!comicAsset) {
      console.warn('Comic preset not found in caption presets source');
      return;
    }

    // Apply the preset to the first caption block
    // This will apply to all captions in the track through the source's applyAssetToBlock callback
    await cesdk.engine.asset.applyToBlock(captionPresetsSourceId, comicAsset, captionBlocks[0]);

    console.log('Comic preset applied to captions');
  } catch (error) {
    console.error('Error applying Comic preset:', error);
  }
}

// Helper function to get existing caption track
function getCaptionTrack(cesdk) {
  const page = cesdk.engine.scene.getCurrentPage();
  if (!page) return null;

  const children = cesdk.engine.block.getChildren(page);
  return children.find(block =>
    cesdk.engine.block.getType(block) === '//ly.img.ubq/captionTrack'
  );
}

// Helper function to remove existing captions from caption track
function removeExistingCaptions(cesdk, captionTrack) {
  try {
    const children = cesdk.engine.block.getChildren(captionTrack);
    children.forEach(captionBlock => {
      try {
        cesdk.engine.block.destroy(captionBlock);
      } catch (error) {
        console.warn('Failed to remove caption block:', error);
      }
    });
    console.log(`Removed ${children.length} existing caption block(s)`);
  } catch (error) {
    console.warn('Failed to remove existing captions:', error);
  }
}

function styleCaptionBlock(cesdk, captionBlock) {
  // Apply default caption styling
  try {
    // Set text color to white
    try {
      cesdk.engine.block.setColor(captionBlock, 'text/color', {
        r: 1, g: 1, b: 1, a: 1
      });
    } catch (e) {
      // Property not supported on this block
    }

    // Set background with semi-transparent black
    try {
      cesdk.engine.block.setColor(captionBlock, 'backgroundColor', {
        r: 0, g: 0, b: 0, a: 0.7
      });
    } catch (e) {
      // Property not supported on this block
    }

    // Set font size
    try {
      cesdk.engine.block.setFloat(captionBlock, 'text/fontSize', 18);
    } catch (e) {
      // Property not supported on this block
    }

    // Center align text
    try {
      cesdk.engine.block.setEnum(captionBlock, 'text/horizontalAlignment', 'Center');
    } catch (e) {
      // Property not supported on this block
    }

    // Add padding
    try {
      cesdk.engine.block.setPadding(captionBlock, 10, 10, 10, 10);
    } catch (e) {
      // Property not supported on this block
    }
  } catch (error) {
    console.warn('Failed to style caption block:', error);
  }
}

export async function createCaptionsFromTranscription(cesdk, transcriptionResult) {
  if (transcriptionResult.format !== 'srt') {
    throw new Error('Only SRT format is supported for caption import');
  }

  // Validate the SRT format
  const validation = validateSRTContent(transcriptionResult.content);
  if (!validation.valid) {
    console.warn('SRT validation warnings:', validation.warnings);
  }

  // Import the captions
  const captionBlocks = await importCaptionsToScene(cesdk, transcriptionResult.content);

  // Add metadata to caption blocks
  captionBlocks.forEach((block, index) => {
    try {
      cesdk.engine.block.setName(block, `Caption ${index + 1}`);
    } catch (e) {
      // Property not supported on this block
    }

    // Store language information if available
    if (transcriptionResult.language) {
      try {
        cesdk.engine.block.setMetadata(block, 'language', transcriptionResult.language);
      } catch (e) {
        // Metadata not supported on this block
      }
    }
  });

  return captionBlocks;
}

function validateSRTContent(srtContent) {
  const lines = srtContent.trim().split('\n');
  const warnings = [];
  let hasValidCaptions = false;

  const timestampRegex = /^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for timestamp lines
    if (timestampRegex.test(line)) {
      hasValidCaptions = true;

      // Validate timestamp order
      const [start, end] = line.split(' --> ');
      if (start >= end) {
        warnings.push(`Line ${i + 1}: End time is not after start time`);
      }
    }
  }

  if (!hasValidCaptions) {
    warnings.push('No valid timestamp lines found in SRT content');
  }

  return {
    valid: hasValidCaptions,
    warnings: warnings
  };
}

export function updateCaptionPositions(cesdk, captionBlocks, position = 'bottom') {
  const page = cesdk.engine.scene.getCurrentPage();
  const pageWidth = cesdk.engine.block.getWidth(page);
  const pageHeight = cesdk.engine.block.getHeight(page);

  captionBlocks.forEach(block => {
    const captionWidth = cesdk.engine.block.getWidth(block);
    const captionHeight = cesdk.engine.block.getHeight(block);

    // Center horizontally
    const centerX = (pageWidth - captionWidth) / 2;
    cesdk.engine.block.setPositionX(block, centerX);

    // Position vertically based on preference
    let yPosition;
    switch (position) {
      case 'top':
        yPosition = pageHeight * 0.1;
        break;
      case 'middle':
        yPosition = (pageHeight - captionHeight) / 2;
        break;
      case 'bottom':
      default:
        yPosition = pageHeight - (pageHeight * 0.15) - captionHeight;
        break;
    }

    cesdk.engine.block.setPositionY(block, yPosition);
  });
}