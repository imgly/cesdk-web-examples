// @ts-nocheck
import { exportAudioFromBlock } from './exportAudio.js';
import { findAudioSources, selectAudioSource } from './findAudioSources.js';
import { importCaptionsToScene } from './importCaptions.js';
import { transcribeAudio } from './transcriptionService.js';

export async function runCompleteAudioToCaptionWorkflow(
  cesdk: any,
  options: any = {}
) {
  const workflow = {
    audioSources: [],
    selectedSource: null,
    audioBlob: null,
    transcription: null,
    captionBlocks: []
  };

  try {
    // Step 1: Find available audio sources
    updateStatus('Finding audio sources...');
    workflow.audioSources = findAudioSources(cesdk);

    if (workflow.audioSources.length === 0) {
      throw new Error('No audio sources found in the scene');
    }

    console.log(`Found ${workflow.audioSources.length} audio sources`);

    // Step 2: Select an audio source (prioritize video/audio blocks over page)
    updateStatus('Selecting audio source...');
    if (options.sourceId) {
      workflow.selectedSource = options.sourceId;
    } else {
      // Prioritize video fills and audio blocks over page
      const preferredSource =
        workflow.audioSources.find(
          (source) => source.type === 'video' || source.type === 'audio'
        ) || workflow.audioSources[0];
      workflow.selectedSource = preferredSource.id;
    }
    await selectAudioSource(cesdk, workflow.selectedSource);

    // Step 3: Export audio from the selected source
    updateStatus('Exporting audio...');
    workflow.audioBlob = await exportAudioFromBlock(
      cesdk,
      workflow.selectedSource,
      {
        mimeType: options.audioFormat || 'audio/wav',
        onProgress: (rendered, encoded, total) => {
          const progress = Math.round((encoded / total) * 100);
          updateStatus(`Exporting audio: ${progress}%`);
          if (options.onExportProgress) {
            options.onExportProgress(progress);
          }
        }
      }
    );

    console.log(`Audio exported: ${workflow.audioBlob.size} bytes`);

    // Step 4: Send to transcription service
    updateStatus('Transcribing audio...');

    // Get the source name for language-specific transcription
    const sourceObject = workflow.audioSources.find(
      (s) => s.id === workflow.selectedSource
    );
    const sourceName = sourceObject?.name || 'Unknown Source';

    workflow.transcription = await transcribeAudio(workflow.audioBlob, {
      useMockService: options.useMockService !== false,
      assemblyAIKey: options.assemblyAIKey,
      sourceName
    });

    console.log(
      `Transcription complete: ${workflow.transcription.content.length} characters`
    );

    // Step 5: Import captions back to the scene
    updateStatus('Importing captions...');
    workflow.captionBlocks = await importCaptionsToScene(
      cesdk,
      workflow.transcription.content,
      workflow.selectedSource
    );

    console.log(
      `Added ${workflow.captionBlocks.length} caption blocks to the scene`
    );

    updateStatus('Workflow complete!');
    return workflow;
  } catch (error) {
    updateStatus(`Workflow failed: ${error.message}`);
    console.error('Workflow error:', error);
    throw error;
  }
}

function updateStatus(message) {
  console.log(`[Workflow] ${message}`);
  // Update UI if status element exists
  const statusElement = document.getElementById('statusText');
  if (statusElement) {
    statusElement.textContent = message;
  }
}

export async function runWorkflowWithUI(cesdk, uiElements) {
  const { statusText, progressBar, sourcesList } = uiElements;

  // Create options with UI callbacks
  const options = {
    onExportProgress: (progress) => {
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    },
    useMockService: true // Use mock service for demo
  };

  // Check if user has selected a source from the UI
  const selectedSourceElement = sourcesList?.querySelector('.selected');
  if (selectedSourceElement) {
    options.sourceId = parseInt(selectedSourceElement.dataset.blockId, 10);
  }

  try {
    // Show progress bar
    if (progressBar) {
      progressBar.parentElement.style.display = 'block';
      progressBar.style.width = '0%';
    }

    const result = await runCompleteAudioToCaptionWorkflow(cesdk, options);

    // Hide progress bar
    if (progressBar) {
      progressBar.parentElement.style.display = 'none';
    }

    // Update status
    if (statusText) {
      statusText.textContent = `Success! Added ${result.captionBlocks.length} captions to the scene`;
    }

    return result;
  } catch (error) {
    // Hide progress bar on error
    if (progressBar) {
      progressBar.parentElement.style.display = 'none';
    }

    if (statusText) {
      statusText.textContent = `Error: ${error.message}`;
    }

    throw error;
  }
}

// Utility function to load sample video with audio
export async function loadSampleVideo(cesdk) {
  const page = cesdk.engine.scene.getCurrentPage();
  const pageWidth = cesdk.engine.block.getWidth(page);
  const pageHeight = cesdk.engine.block.getHeight(page);

  // Set sample video URL (multitrack audio video from CDN)
  const sampleVideoUrl =
    'https://img.ly/static/ubq_video_samples/multitrack_output.mp4';

  // Use addVideo API to properly create video block with fill
  // Make video fill the entire page (16:9 format)
  const video = await cesdk.engine.block.addVideo(
    sampleVideoUrl,
    pageWidth,
    pageHeight
  );

  // Position the video at the top-left corner to fill the entire page
  cesdk.engine.block.setPositionX(video, 0);
  cesdk.engine.block.setPositionY(video, 0);

  // Move the video to the background track
  // This creates a background track if it doesn't exist and moves the video there
  cesdk.engine.block.moveToBackgroundTrack(video);

  // Get the video fill
  const videoFill = cesdk.engine.block.getFill(video);
  cesdk.engine.block.setMuted(videoFill, true);

  // Load the video resource to ensure audio info is available
  await cesdk.engine.block.forceLoadAVResource(videoFill);

  const totalDuration =
    cesdk.engine.block.getAVResourceTotalDuration(videoFill);

  // Trim the video to 10 seconds
  cesdk.engine.block.setDuration(video, totalDuration);
  cesdk.engine.block.setTrimOffset(videoFill, 0);
  cesdk.engine.block.setTrimLength(videoFill, totalDuration);

  console.log(
    'Loaded sample video with audio (16:9 format, on background track, full duration, looping enabled)'
  );

  return videoFill;
}
