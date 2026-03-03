// @ts-nocheck
import { loadSampleVideo } from './completeWorkflow.js';
import { downloadAudioBlob, exportAudioWithUI } from './exportAudio.js';
import { findAudioSources, selectAudioSource } from './findAudioSources.js';
import { importCaptionsToScene } from './importCaptions.js';
import { initializeCESDK, setupAudioScene } from './initializeEngine.js';
import { transcribeAudio } from './transcriptionService.js';

// Global variables
let cesdk = null;
let currentAudioBlob = null;
let currentTranscription = null;
let selectedSourceId = null;
let currentVideoFillId = null;
let audioTrackInfo = null;

// Initialize the application
async function initializeApp() {
  const statusText = document.getElementById('statusText');

  try {
    // Initialize CE.SDK
    statusText.textContent = 'Initializing CE.SDK...';
    cesdk = await initializeCESDK('#cesdk-container');
    await setupAudioScene(cesdk);

    // Expose cesdk to window for hero image capture
    (window as any).cesdk = cesdk;

    statusText.textContent = 'CE.SDK initialized successfully';

    // Enable buttons
    document.getElementById('loadSampleVideo').disabled = false;
    document.getElementById('findAudioSources').disabled = false;
    document.getElementById('runFullWorkflow').disabled = false;

    // Set up event handlers
    setupEventHandlers();
  } catch (error) {
    console.error('Failed to initialize CE.SDK:', error);
    statusText.textContent = `Initialization failed: ${error.message}`;
  }
}

function setupEventHandlers() {
  // Listen to editor selection changes to sync with audio sources list
  cesdk.engine.block.onSelectionChanged(() => {
    syncAudioSourceSelection();
  });

  // Load Sample Video button
  document
    .getElementById('loadSampleVideo')
    .addEventListener('click', async () => {
      const statusText = document.getElementById('statusText');
      try {
        statusText.textContent = 'Loading sample video...';
        currentVideoFillId = await loadSampleVideo(cesdk);

        // Auto-select the video fill as the audio source
        selectedSourceId = currentVideoFillId;

        statusText.textContent = 'Sample video loaded and selected';

        // Enable export and multi-track audio buttons
        document.getElementById('exportAudio').disabled = false;
        document.getElementById('findAudioSources').disabled = false;
        document.getElementById('getAudioTrackCount').disabled = false;
        document.getElementById('getAudioTrackInfo').disabled = false;
        document.getElementById('createAudioFromVideo').disabled = false;

        // Automatically find and display audio sources
        document.getElementById('findAudioSources').click();
      } catch (error) {
        statusText.textContent = `Failed to load video: ${error.message}`;
      }
    });

  // Find Audio Sources button
  document.getElementById('findAudioSources').addEventListener('click', () => {
    const sources = findAudioSources(cesdk);
    displayAudioSources(sources);

    if (sources.length > 0) {
      document.getElementById('exportAudio').disabled = false;
      document.getElementById(
        'statusText'
      ).textContent = `Found ${sources.length} audio sources`;
    } else {
      document.getElementById('statusText').textContent =
        'No audio sources found';
    }
  });

  // Export Audio button
  document.getElementById('exportAudio').addEventListener('click', async () => {
    if (!selectedSourceId) {
      document.getElementById('statusText').textContent =
        'Please select an audio source first';
      return;
    }

    const progressBar = document.getElementById('progressBar');
    progressBar.style.display = 'block';

    try {
      // Determine the block to export from
      let exportBlockId = selectedSourceId;
      const blockType = cesdk.engine.block.getType(selectedSourceId);

      // If it's a video fill, we need to export from the parent graphic block
      if (blockType === '//ly.img.ubq/fill/video') {
        // Find the parent block that has this fill
        const allBlocks = cesdk.engine.block.findAll();
        const parentBlock = allBlocks.find((block) => {
          try {
            const fill = cesdk.engine.block.getFill(block);
            return fill === selectedSourceId;
          } catch {
            return false;
          }
        });

        if (parentBlock) {
          exportBlockId = parentBlock;
          console.log(
            'Exporting from parent graphic block:',
            exportBlockId,
            'instead of fill:',
            selectedSourceId
          );
        }
      }

      currentAudioBlob = await exportAudioWithUI(
        cesdk,
        exportBlockId,
        progressBar
      );

      // Enable transcription button
      document.getElementById('transcribeAudio').disabled = false;

      // Option to download the audio
      const shouldDownload = window.confirm(
        'Audio exported! Do you want to download it?'
      );
      if (shouldDownload) {
        downloadAudioBlob(currentAudioBlob, 'cesdk-export.wav');
      }
    } catch (error) {
      document.getElementById(
        'statusText'
      ).textContent = `Export failed: ${error.message}`;
      console.error('Export error:', error);
    } finally {
      progressBar.style.display = 'none';
    }
  });

  // Transcribe Audio button
  document
    .getElementById('transcribeAudio')
    .addEventListener('click', async () => {
      if (!currentAudioBlob) {
        document.getElementById('statusText').textContent =
          'Please export audio first';
        return;
      }

      const statusText = document.getElementById('statusText');
      statusText.textContent = 'Transcribing audio (using mock service)...';

      try {
        // Get the source name for language-specific transcription
        const sourceName = selectedSourceId
          ? cesdk.engine.block.getName(selectedSourceId)
          : 'Unknown';

        currentTranscription = await transcribeAudio(currentAudioBlob, {
          useMockService: true,
          sourceName
        });

        statusText.textContent = 'Transcription complete!';

        // Show transcription preview
        console.log('Transcription result:', currentTranscription.content);

        // Enable caption import button
        document.getElementById('addCaptions').disabled = false;
      } catch (error) {
        statusText.textContent = `Transcription failed: ${error.message}`;
      }
    });

  // Add Captions button
  document.getElementById('addCaptions').addEventListener('click', async () => {
    if (!currentTranscription) {
      document.getElementById('statusText').textContent =
        'Please transcribe audio first';
      return;
    }

    const statusText = document.getElementById('statusText');
    statusText.textContent = 'Adding captions to scene...';

    try {
      const captionBlocks = await importCaptionsToScene(
        cesdk,
        currentTranscription.content,
        selectedSourceId
      );
      statusText.textContent = `Added ${captionBlocks.length} captions to the scene`;
    } catch (error) {
      statusText.textContent = `Failed to add captions: ${error.message}`;
    }
  });

  // Get Audio Track Count button
  document
    .getElementById('getAudioTrackCount')
    .addEventListener('click', async () => {
      if (!currentVideoFillId) {
        document.getElementById('statusText').textContent =
          'Please load a video first';
        return;
      }

      const statusText = document.getElementById('statusText');
      try {
        const trackCount =
          cesdk.engine.block.getAudioTrackCountFromVideo(currentVideoFillId);
        statusText.textContent = `Video has ${trackCount} audio track${
          trackCount !== 1 ? 's' : ''
        }`;
        console.log('Audio track count:', trackCount);
      } catch (error) {
        statusText.textContent = `Failed to get audio track count: ${error.message}`;
      }
    });

  // Get Audio Track Info button
  document
    .getElementById('getAudioTrackInfo')
    .addEventListener('click', async () => {
      if (!currentVideoFillId) {
        document.getElementById('statusText').textContent =
          'Please load a video first';
        return;
      }

      const statusText = document.getElementById('statusText');
      const trackInfoContainer = document.getElementById(
        'audioTrackInfoContainer'
      );
      const trackInfoElement = document.getElementById('audioTrackInfo');

      try {
        audioTrackInfo =
          cesdk.engine.block.getAudioInfoFromVideo(currentVideoFillId);
        statusText.textContent = `Retrieved information for ${
          audioTrackInfo.length
        } audio track${audioTrackInfo.length !== 1 ? 's' : ''}`;

        // Display track information
        trackInfoElement.innerHTML = '';
        audioTrackInfo.forEach((track, index) => {
          const trackItem = document.createElement('div');
          trackItem.className = 'track-info-item';
          trackItem.innerHTML = `
          <strong>Track ${index}:</strong><br>
          Channels: ${track.channels}<br>
          Sample Rate: ${track.sampleRate} Hz<br>
          ${track.language ? `Language: ${track.language}<br>` : ''}
          ${track.label ? `Label: ${track.label}` : ''}
        `;
          trackInfoElement.appendChild(trackItem);
        });

        trackInfoContainer.style.display = 'block';
        console.log('Audio track info:', audioTrackInfo);
      } catch (error) {
        statusText.textContent = `Failed to get audio track info: ${error.message}`;
        trackInfoContainer.style.display = 'none';
      }
    });

  // Create Audio Block from Video button
  document
    .getElementById('createAudioFromVideo')
    .addEventListener('click', async () => {
      if (!currentVideoFillId) {
        document.getElementById('statusText').textContent =
          'Please load a video first';
        return;
      }

      const statusText = document.getElementById('statusText');
      try {
        statusText.textContent =
          'Creating audio blocks from all video tracks...';

        // Get the current page
        const page = cesdk.engine.scene.getCurrentPage();
        const pageWidth = cesdk.engine.block.getWidth(page);
        const pageHeight = cesdk.engine.block.getHeight(page);

        // Create audio blocks from all tracks
        const audioBlocks =
          cesdk.engine.block.createAudiosFromVideo(currentVideoFillId);

        // Position the audio blocks below other content
        audioBlocks.forEach((audioBlock, index) => {
          // Add the audio block to the scene
          cesdk.engine.block.appendChild(page, audioBlock);

          // Stack audio blocks vertically if there are multiple
          const yOffset = pageHeight * 0.8 + index * 50;
          cesdk.engine.block.setPositionX(audioBlock, pageWidth * 0.1);
          cesdk.engine.block.setPositionY(audioBlock, yOffset);
          cesdk.engine.block.setWidth(audioBlock, pageWidth * 0.8);
        });

        statusText.textContent = `Created ${audioBlocks.length} audio block${
          audioBlocks.length !== 1 ? 's' : ''
        } from video tracks`;

        // Refresh audio sources list
        document.getElementById('findAudioSources').click();

        console.log('Created audio blocks:', audioBlocks);
      } catch (error) {
        statusText.textContent = `Failed to create audio blocks: ${error.message}`;
      }
    });

  // Run Full Workflow button
  document
    .getElementById('runFullWorkflow')
    .addEventListener('click', async () => {
      const statusText = document.getElementById('statusText');
      const progressBar = document.getElementById('progressBar');

      try {
        // Step 1: Load Sample Video
        statusText.textContent = 'Step 1/4: Loading sample video...';
        currentVideoFillId = await loadSampleVideo(cesdk);
        selectedSourceId = currentVideoFillId;

        // Enable step 2 button and auto-find sources
        document.getElementById('exportAudio').disabled = false;
        document.getElementById('findAudioSources').click();
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        }); // Brief pause for UI update

        // Step 2: Export Audio
        statusText.textContent = 'Step 2/4: Exporting audio...';
        progressBar.style.display = 'block';

        // Find the parent graphic block for export
        let exportBlockId = currentVideoFillId;
        const blockType = cesdk.engine.block.getType(currentVideoFillId);
        if (blockType === '//ly.img.ubq/fill/video') {
          const allBlocks = cesdk.engine.block.findAll();
          const parentBlock = allBlocks.find((block) => {
            try {
              const fill = cesdk.engine.block.getFill(block);
              return fill === currentVideoFillId;
            } catch {
              return false;
            }
          });
          if (parentBlock) exportBlockId = parentBlock;
        }

        currentAudioBlob = await exportAudioWithUI(
          cesdk,
          exportBlockId,
          progressBar
        );
        progressBar.style.display = 'none';

        // Enable step 3 button
        document.getElementById('transcribeAudio').disabled = false;
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        // Step 3: Transcribe Audio
        statusText.textContent = 'Step 3/4: Transcribing audio...';

        // Get the source name for language-specific transcription
        const sourceName = selectedSourceId
          ? cesdk.engine.block.getName(selectedSourceId)
          : 'Unknown';

        currentTranscription = await transcribeAudio(currentAudioBlob, {
          useMockService: true,
          sourceName
        });

        // Enable step 4 button
        document.getElementById('addCaptions').disabled = false;
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });

        // Step 4: Add Captions
        statusText.textContent = 'Step 4/4: Adding captions...';
        const captionBlocks = await importCaptionsToScene(
          cesdk,
          currentTranscription.content,
          selectedSourceId
        );

        statusText.textContent = `Workflow complete! Added ${captionBlocks.length} captions to the scene`;
      } catch (error) {
        console.error('Workflow failed:', error);
        statusText.textContent = `Workflow failed: ${error.message}`;
        progressBar.style.display = 'none';
      }
    });
}

function syncAudioSourceSelection() {
  // Get currently selected blocks in the editor
  const selectedBlocks = cesdk.engine.block.findAllSelected();
  if (selectedBlocks.length === 0) return;

  const selectedBlock = selectedBlocks[0];
  const blockType = cesdk.engine.block.getType(selectedBlock);

  // Check if it's a video block or audio block
  let audioSourceId = null;

  if (blockType === '//ly.img.ubq/graphic') {
    // It's a video block - get its fill
    const fill = cesdk.engine.block.getFill(selectedBlock);
    const fillType = cesdk.engine.block.getType(fill);
    if (fillType === '//ly.img.ubq/fill/video') {
      audioSourceId = fill;
      console.log('Video block selected, audio source ID:', audioSourceId);
    }
  } else if (blockType === '//ly.img.ubq/audio') {
    // It's an audio block
    audioSourceId = selectedBlock;
    console.log('Audio block selected, ID:', audioSourceId);
  }

  // If we found an audio source, update the UI selection
  if (audioSourceId) {
    const list = document.getElementById('audioSourcesList');
    const sourceItems = list.querySelectorAll('.source-item');

    let found = false;
    sourceItems.forEach((item) => {
      const itemBlockId = parseInt(item.dataset.blockId, 10);
      if (itemBlockId === audioSourceId) {
        found = true;
        // Remove previous selections
        sourceItems.forEach((el) => el.classList.remove('selected'));

        // Select this item
        item.classList.add('selected');
        selectedSourceId = audioSourceId;

        // If this is a video fill, enable multi-track operations
        if (blockType === '//ly.img.ubq/graphic') {
          currentVideoFillId = audioSourceId;
          document.getElementById('getAudioTrackCount').disabled = false;
          document.getElementById('getAudioTrackInfo').disabled = false;
          document.getElementById('createAudioFromVideo').disabled = false;
        }

        // Enable export button
        document.getElementById('exportAudio').disabled = false;
        console.log('Audio source synced in UI, export enabled');
      }
    });

    if (!found) {
      console.log(
        'Audio source not found in list. Available sources:',
        sourceItems.length
      );
    }
  }
}

function displayAudioSources(sources) {
  const container = document.getElementById('audioSourcesContainer');
  const list = document.getElementById('audioSourcesList');

  // Clear existing list
  list.innerHTML = '';

  if (sources.length === 0) {
    container.style.display = 'none';
    return;
  }

  // Show container
  container.style.display = 'block';

  // Add source items
  sources.forEach((source, index) => {
    const item = document.createElement('div');
    item.className = 'source-item';
    item.dataset.blockId = source.id;
    item.innerHTML = `
      <strong>${source.name}</strong> (${source.type})
      ${source.tracks ? ` - ${source.tracks.length} audio tracks` : ''}
    `;

    // Click handler to select source
    item.addEventListener('click', async () => {
      // Remove previous selection
      list.querySelectorAll('.source-item').forEach((el) => {
        el.classList.remove('selected');
      });

      // Select this item
      item.classList.add('selected');
      selectedSourceId = source.id;

      // If this is a video fill, store it for multi-track operations
      if (source.type === 'video') {
        currentVideoFillId = source.id;
        // Enable multi-track audio buttons
        document.getElementById('getAudioTrackCount').disabled = false;
        document.getElementById('getAudioTrackInfo').disabled = false;
        document.getElementById('createAudioFromVideo').disabled = false;
      }

      // Select in CE.SDK
      await selectAudioSource(cesdk, source.id);

      // Enable export button
      document.getElementById('exportAudio').disabled = false;
      document.getElementById(
        'statusText'
      ).textContent = `Selected: ${source.name}`;
    });

    // Auto-select first non-page item, or first item if page is the only source
    const shouldAutoSelect =
      (index === 0 && source.type !== 'page') || // First item and not a page
      (index === 0 && sources.length === 1) || // Only one source (even if it's a page)
      (index === 1 && sources[0].type === 'page'); // Second item if first is a page

    if (shouldAutoSelect && source.type !== 'page') {
      item.click();
    } else if (index === 0 && sources.length === 1) {
      item.click();
    }

    list.appendChild(item);
  });
}

// Start the application when the page loads
window.addEventListener('DOMContentLoaded', initializeApp);
