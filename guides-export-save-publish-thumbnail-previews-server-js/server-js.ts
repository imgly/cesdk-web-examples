import CreativeEngine, { type DesignBlockId } from '@cesdk/node';
import { config } from 'dotenv';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

config();

/**
 * CE.SDK Server Guide: Thumbnail Previews
 *
 * Demonstrates the streaming audio waveform API on @cesdk/node:
 * - Accumulating chunks from generateAudioThumbnailSequence into one envelope
 * - Reading an interleaved stereo envelope
 * - Cancelling an in-flight request with the returned closure
 */

const OUTPUT_DIR = './output';
const AUDIO_URI =
  'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/dance_harder.m4a';
const CLIP_DURATION = 8;

// Draw the envelope as ASCII art, mirrored around a centerline. The values are
// already normalized to [0, 1], so no scaling or peak-finding is needed.
function renderWaveform(
  envelope: Float32Array,
  columns: number,
  rows: number
): string {
  const half = Math.floor(rows / 2);
  const samplesPerColumn = envelope.length / columns;
  const buckets: number[] = [];

  for (let column = 0; column < columns; column++) {
    const start = Math.floor(column * samplesPerColumn);
    const end = Math.min(
      Math.ceil((column + 1) * samplesPerColumn),
      envelope.length
    );
    let sum = 0;
    for (let i = start; i < end; i++) sum += envelope[i];
    buckets.push(end > start ? sum / (end - start) : 0);
  }

  const lines: string[] = [];
  for (let row = -half; row <= half; row++) {
    const line = buckets
      .map((value) => (Math.abs(row) <= Math.round(value * half) ? '#' : ' '))
      .join('');
    lines.push(line.trimEnd());
  }
  return lines.join('\n');
}

console.log('Initializing engine...');

const engine = await CreativeEngine.init({
});

try {
  const scene = engine.scene.create();

  const page = engine.block.create('page');
  engine.block.setWidth(page, 1280);
  engine.block.setHeight(page, 720);
  engine.block.setDuration(page, CLIP_DURATION);
  engine.block.appendChild(scene, page);

  const audioBlock = engine.block.create('audio');
  engine.block.appendChild(page, audioBlock);
  engine.block.setString(audioBlock, 'audio/fileURI', AUDIO_URI);

  // Both paths wait for the resource, but loading it up front avoids a first
  // request that returns before the audio is ready.
  await engine.block.forceLoadAVResource(audioBlock);
  engine.block.setDuration(audioBlock, CLIP_DURATION);

  console.log('Generating waveform...');

  const collectWaveform = (
    block: DesignBlockId,
    samplesPerChunk: number,
    timeBegin: number,
    timeEnd: number,
    numberOfSamples: number,
    numberOfChannels: number
  ): Promise<Float32Array> => {
    const chunkCount = Math.ceil(numberOfSamples / samplesPerChunk);
    const envelope = new Float32Array(numberOfSamples * numberOfChannels);
    const arrived = new Set<number>();

    return new Promise((resolve, reject) => {
      engine.block.generateAudioThumbnailSequence(
        block,
        samplesPerChunk,
        timeBegin,
        timeEnd,
        numberOfSamples,
        numberOfChannels,
        (chunkIndex, result) => {
          // An error ends the sequence; no further chunks follow.
          if (result instanceof Error) {
            reject(result);
            return;
          }
          // The samples are a view into engine memory. Copy them out
          // synchronously, and key the offset off the reported index rather
          // than the arrival order.
          envelope.set(result, chunkIndex * samplesPerChunk * numberOfChannels);
          arrived.add(chunkIndex);
          // There is no completion callback, so count the chunks instead.
          if (arrived.size === chunkCount) resolve(envelope);
        }
      );
    });
  };

  const monoEnvelope = await collectWaveform(
    audioBlock,
    64,
    0,
    CLIP_DURATION,
    512,
    1
  );

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  writeFileSync(
    `${OUTPUT_DIR}/waveform.txt`,
    `${renderWaveform(monoEnvelope, 96, 15)}\n`
  );
  console.log(`Wrote ${OUTPUT_DIR}/waveform.txt`);

  const peak = monoEnvelope.reduce((max, value) => Math.max(max, value), 0);
  const mean =
    monoEnvelope.reduce((sum, value) => sum + value, 0) / monoEnvelope.length;
  console.log(
    `Mono envelope: ${monoEnvelope.length} values, peak ${peak.toFixed(3)}, mean ${mean.toFixed(3)}`
  );

  // numberOfSamples counts samples per channel, so a stereo request returns
  // twice as many floats, interleaved left-then-right.
  const stereoEnvelope = await collectWaveform(
    audioBlock,
    64,
    0,
    CLIP_DURATION,
    512,
    2
  );

  let leftPeak = 0;
  let rightPeak = 0;
  for (let i = 0; i < stereoEnvelope.length; i += 2) {
    leftPeak = Math.max(leftPeak, stereoEnvelope[i]);
    rightPeak = Math.max(rightPeak, stereoEnvelope[i + 1]);
  }

  console.log(
    `Stereo peaks: left ${leftPeak.toFixed(3)}, right ${rightPeak.toFixed(3)}`
  );

  let deliveredChunks = 0;

  const cancel = engine.block.generateAudioThumbnailSequence(
    audioBlock,
    64,
    0,
    CLIP_DURATION,
    4096,
    1,
    (_chunkIndex, result) => {
      if (!(result instanceof Error)) deliveredChunks += 1;
    }
  );

  // Cancelling takes effect on the next engine tick and delivers nothing of its
  // own: no final chunk, no error. Calling it again is a safe no-op.
  cancel();
  cancel();

  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Chunks delivered by the cancelled request: ${deliveredChunks}`);
} finally {
  engine.dispose();
}
