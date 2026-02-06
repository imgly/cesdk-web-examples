import CreativeEngine from '@cesdk/node';
import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Load environment variables from .env file
config();

// Helper function to create a WAV file from audio samples
function createWavFile(
  samples: Float32Array,
  sampleRate: number,
  numChannels: number
): Uint8Array {
  const bytesPerSample = 2; // 16-bit audio
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const fileSize = 44 + dataSize; // WAV header is 44 bytes

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize - 8, true); // File size minus RIFF header
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bytesPerSample * 8, true); // BitsPerSample

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // Write audio samples as 16-bit PCM
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    // Convert float (-1 to 1) to 16-bit integer
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

async function main(): Promise<void> {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a video scene - required for audio blocks
    await engine.scene.createVideo();

    // Get the page (first container in video scenes)
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Create a buffer and get its URI
    const bufferUri = engine.editor.createBuffer();
    console.log('Buffer URI:', bufferUri);

    // Generate sine wave audio samples
    const sampleRate = 44100;
    const duration = 2; // 2 seconds
    const frequency = 440; // A4 note
    const numChannels = 2; // Stereo

    // Create Float32Array for audio samples (interleaved stereo)
    const numSamples = sampleRate * duration * numChannels;
    const samples = new Float32Array(numSamples);

    // Generate a 440 Hz sine wave
    for (let i = 0; i < numSamples; i += numChannels) {
      const sampleIndex = i / numChannels;
      const time = sampleIndex / sampleRate;
      const value = Math.sin(2 * Math.PI * frequency * time) * 0.5; // 50% amplitude

      // Write to both left and right channels
      samples[i] = value; // Left channel
      samples[i + 1] = value; // Right channel
    }

    // Convert samples to WAV format and write to buffer
    const wavData = createWavFile(samples, sampleRate, numChannels);
    engine.editor.setBufferData(bufferUri, 0, wavData);

    // Verify the buffer length
    const bufferLength = engine.editor.getBufferLength(bufferUri);
    console.log('Buffer length:', bufferLength, 'bytes');

    // Create an audio block
    const audioBlock = engine.block.create('audio');

    // Assign the buffer URI to the audio block
    engine.block.setString(audioBlock, 'audio/fileURI', bufferUri);

    // Set audio duration to match the generated samples
    engine.block.setDuration(audioBlock, duration);

    // Append the audio block to the page
    engine.block.appendChild(page, audioBlock);

    // Demonstrate reading buffer data back
    const readData = engine.editor.getBufferData(bufferUri, 0, 100);
    console.log('First 100 bytes of buffer data:', readData);

    // Demonstrate resizing a buffer with a separate demo buffer
    const demoBuffer = engine.editor.createBuffer();
    engine.editor.setBufferData(
      demoBuffer,
      0,
      new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
    );

    const demoLength = engine.editor.getBufferLength(demoBuffer);
    console.log('Demo buffer length before resize:', demoLength);

    engine.editor.setBufferLength(demoBuffer, demoLength / 2);
    console.log(
      'Demo buffer length after resize:',
      engine.editor.getBufferLength(demoBuffer)
    );

    engine.editor.destroyBuffer(demoBuffer);

    // Find all transient resources (including our buffer)
    const transientResources = engine.editor.findAllTransientResources();
    console.log('Transient resources in scene:');
    for (const resource of transientResources) {
      console.log(`  URL: ${resource.URL}, Size: ${resource.size} bytes`);
    }

    // Demonstrate persisting buffer data to a file
    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const bufferData = engine.editor.getBufferData(bufferUri, 0, bufferLength);
    const outputPath = `${outputDir}/generated-audio.wav`;
    writeFileSync(outputPath, Buffer.from(bufferData));
    console.log('Buffer data saved to:', outputPath);

    // Update all references from buffer:// to the file path
    // In production, use a CDN URL instead of a local file path
    const absolutePath = `file://${process.cwd()}/${outputPath}`;
    engine.editor.relocateResource(bufferUri, absolutePath);
    console.log('Buffer relocated to:', absolutePath);

    console.log('Buffers example completed successfully');
  } finally {
    // Always dispose the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
