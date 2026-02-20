import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { VideoEditorConfig } from './video-editor/plugin';
import packageJson from './package.json';

/**
 * Creates a WAV file buffer from audio parameters and a sample generator function.
 *
 * @param sampleRate - Sample rate in Hz (e.g., 48000)
 * @param durationSeconds - Duration of the audio in seconds
 * @param generator - Function that generates sample values (-1.0 to 1.0) for each time point
 * @returns Uint8Array containing a stereo WAV file
 */
function createWavBuffer(
  sampleRate: number,
  durationSeconds: number,
  /* eslint-disable-next-line no-unused-vars -- Parameter name documents callback signature */
  generator: (time: number) => number
): Uint8Array {
  const bitsPerSample = 16;
  const channels = 2; // Stereo output
  const numSamples = Math.floor(durationSeconds * sampleRate);
  const dataSize = numSamples * channels * (bitsPerSample / 8);

  // Create WAV file buffer (44-byte header + audio data)
  const wavBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(wavBuffer);

  // RIFF chunk descriptor
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + dataSize, true); // File size - 8
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // fmt sub-chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
  view.setUint16(20, 1, true); // Audio format (1 = PCM)
  view.setUint16(22, channels, true); // Number of channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * channels * (bitsPerSample / 8), true);
  view.setUint16(32, channels * (bitsPerSample / 8), true); // Block align
  view.setUint16(34, bitsPerSample, true); // Bits per sample

  // data sub-chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true); // Data size

  // Generate audio samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const time = i / sampleRate;
    // Generate mono sample and duplicate to both channels
    const value = generator(time);
    const sample = Math.max(-32768, Math.min(32767, Math.round(value * 32767)));
    view.setInt16(offset, sample, true); // Left channel
    view.setInt16(offset + 2, sample, true); // Right channel
    offset += 4;
  }

  return new Uint8Array(wavBuffer);
}

/**
 * Calculates an ADSR (Attack-Decay-Sustain-Release) envelope value for a note.
 * The envelope shapes the volume over time, creating natural-sounding tones.
 *
 * @param time - Current time in seconds
 * @param noteStart - When the note starts (seconds)
 * @param noteDuration - Total note duration including release (seconds)
 * @param attack - Time to reach peak volume (seconds)
 * @param decay - Time to fall from peak to sustain level (seconds)
 * @param sustain - Held volume level (0.0 to 1.0)
 * @param release - Time to fade to silence (seconds)
 * @returns Envelope amplitude (0.0 to 1.0)
 */
function adsr(
  time: number,
  noteStart: number,
  noteDuration: number,
  attack: number,
  decay: number,
  sustain: number,
  release: number
): number {
  const t = time - noteStart;
  if (t < 0) return 0;

  const noteEnd = noteDuration - release;

  if (t < attack) {
    // Attack phase: ramp up from 0 to 1
    return t / attack;
  } else if (t < attack + decay) {
    // Decay phase: ramp down from 1 to sustain level
    return 1 - ((t - attack) / decay) * (1 - sustain);
  } else if (t < noteEnd) {
    // Sustain phase: hold at sustain level
    return sustain;
  } else if (t < noteDuration) {
    // Release phase: ramp down from sustain to 0
    return sustain * (1 - (t - noteEnd) / release);
  }
  return 0;
}

// Musical note frequencies (Hz) for the 4th and 5th octaves
const NOTE_FREQUENCIES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5
};

// Sound effect 1: Ascending "success" fanfare (2 seconds)
// Creates a triumphant feeling with overlapping notes building to a chord
const SUCCESS_CHIME = {
  notes: [
    // Quick ascending arpeggio
    { freq: NOTE_FREQUENCIES.C4, start: 0.0, duration: 0.3 },
    { freq: NOTE_FREQUENCIES.E4, start: 0.1, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.G4, start: 0.2, duration: 0.5 },
    // Sustained major chord
    { freq: NOTE_FREQUENCIES.C5, start: 0.35, duration: 1.65 },
    { freq: NOTE_FREQUENCIES.E5, start: 0.4, duration: 1.6 },
    { freq: NOTE_FREQUENCIES.G5, start: 0.45, duration: 1.55 }
  ],
  totalDuration: 2.0
};

// Sound effect 2: Gentle notification melody (2 seconds)
// A musical phrase that resolves pleasantly
const NOTIFICATION_MELODY = {
  notes: [
    { freq: NOTE_FREQUENCIES.E5, start: 0.0, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.G5, start: 0.25, duration: 0.5 },
    { freq: NOTE_FREQUENCIES.A5, start: 0.6, duration: 0.3 },
    { freq: NOTE_FREQUENCIES.G5, start: 0.85, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.E5, start: 1.15, duration: 0.85 }
  ],
  totalDuration: 2.0
};

// Sound effect 3: Alert/warning tone (2 seconds)
// Descending pattern that grabs attention
const ALERT_TONE = {
  notes: [
    // Attention-grabbing high notes
    { freq: NOTE_FREQUENCIES.A5, start: 0.0, duration: 0.25 },
    { freq: NOTE_FREQUENCIES.A5, start: 0.3, duration: 0.25 },
    // Descending resolution
    { freq: NOTE_FREQUENCIES.F5, start: 0.6, duration: 0.4 },
    { freq: NOTE_FREQUENCIES.D5, start: 0.9, duration: 0.5 },
    { freq: NOTE_FREQUENCIES.A4, start: 1.3, duration: 0.7 }
  ],
  totalDuration: 2.0
};

/**
 * CE.SDK Plugin: Add Sound Effects Guide
 *
 * This example demonstrates:
 * - Creating audio buffers with arbitrary data
 * - Generating sound effects programmatically (chimes, notifications)
 * - Using WAV format for in-memory audio
 * - Positioning sound effects on the timeline
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());
    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(
      new PagePresetsAssetSource({
        include: [
          'ly.img.page.presets.instagram.*',
          'ly.img.page.presets.facebook.*',
          'ly.img.page.presets.x.*',
          'ly.img.page.presets.linkedin.*',
          'ly.img.page.presets.pinterest.*',
          'ly.img.page.presets.tiktok.*',
          'ly.img.page.presets.youtube.*',
          'ly.img.page.presets.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());


    // Create a video scene (audio blocks require timeline support)
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.instagram.story'
      }
    });

    const engine = cesdk.engine;

    // Get the page (timeline)
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Calculate total duration: 3 effects × 2s + 2 gaps × 0.5s = 7s
    const effectDuration = 2.0;
    const gapDuration = 0.5;
    const totalDuration = 3 * effectDuration + 2 * gapDuration; // 7 seconds

    // Set page duration to match total effects length
    engine.block.setDuration(page, totalDuration);

    // Add a centered title text to the canvas
    const text = engine.block.create('text');
    engine.block.appendChild(page, text);
    engine.block.replaceText(text, 'Sound Effects Demo');
    engine.block.setTextColor(text, { r: 1, g: 1, b: 1, a: 1 });
    engine.block.setFloat(text, 'text/fontSize', 48);

    // Center the text on the canvas
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    engine.block.setWidth(text, pageWidth);
    engine.block.setHeight(text, 70);
    engine.block.setPositionX(text, 0);
    engine.block.setPositionY(text, pageHeight / 2 - 35);
    engine.block.setEnum(text, 'text/horizontalAlignment', 'Center');

    // Make text visible for the entire duration
    engine.block.setTimeOffset(text, 0);
    engine.block.setDuration(text, totalDuration);

    const sampleRate = 48000;

    // Create the "success chime" sound effect
    const chimeBuffer = engine.editor.createBuffer();

    // Generate the chime using our helper function
    const chimeWav = createWavBuffer(
      sampleRate,
      SUCCESS_CHIME.totalDuration,
      (time) => {
        let sample = 0;

        // Mix all notes together
        for (const note of SUCCESS_CHIME.notes) {
          // Calculate envelope for this note
          const envelope = adsr(
            time,
            note.start,
            note.duration,
            0.02, // Soft attack (20ms)
            0.08, // Gentle decay (80ms)
            0.7, // Sustain at 70%
            0.25 // Smooth release (250ms)
          );

          if (envelope > 0) {
            // Generate sine wave with slight harmonics for richness
            const fundamental = Math.sin(2 * Math.PI * note.freq * time);
            const harmonic2 = Math.sin(4 * Math.PI * note.freq * time) * 0.25;
            const harmonic3 = Math.sin(6 * Math.PI * note.freq * time) * 0.1;

            sample += (fundamental + harmonic2 + harmonic3) * envelope * 0.3;
          }
        }

        return sample;
      }
    );

    // Write WAV data to the buffer
    engine.editor.setBufferData(chimeBuffer, 0, chimeWav);

    // Create audio block for the chime (starts at 0s)
    const chimeBlock = engine.block.create('audio');
    engine.block.appendChild(page, chimeBlock);
    engine.block.setString(chimeBlock, 'audio/fileURI', chimeBuffer);
    engine.block.setTimeOffset(chimeBlock, 0);
    engine.block.setDuration(chimeBlock, SUCCESS_CHIME.totalDuration);
    engine.block.setVolume(chimeBlock, 0.8);

    // Create the "notification melody" sound effect
    const melodyBuffer = engine.editor.createBuffer();

    const melodyWav = createWavBuffer(
      sampleRate,
      NOTIFICATION_MELODY.totalDuration,
      (time) => {
        let sample = 0;

        for (const note of NOTIFICATION_MELODY.notes) {
          const envelope = adsr(
            time,
            note.start,
            note.duration,
            0.01, // Soft attack (10ms)
            0.06, // Gentle decay (60ms)
            0.6, // Sustain at 60%
            0.2 // Smooth release (200ms)
          );

          if (envelope > 0) {
            // Pure sine wave with light 2nd harmonic for gentle tone
            const fundamental = Math.sin(2 * Math.PI * note.freq * time);
            const harmonic2 = Math.sin(4 * Math.PI * note.freq * time) * 0.15;

            sample += (fundamental + harmonic2) * envelope * 0.4;
          }
        }

        return sample;
      }
    );

    engine.editor.setBufferData(melodyBuffer, 0, melodyWav);

    // Starts at 2.5s (after 2s effect + 0.5s gap)
    const melodyBlock = engine.block.create('audio');
    engine.block.appendChild(page, melodyBlock);
    engine.block.setString(melodyBlock, 'audio/fileURI', melodyBuffer);
    engine.block.setTimeOffset(melodyBlock, effectDuration + gapDuration); // 2.5s
    engine.block.setDuration(melodyBlock, NOTIFICATION_MELODY.totalDuration);
    engine.block.setVolume(melodyBlock, 0.8);

    // Create the "alert" sound effect
    const alertBuffer = engine.editor.createBuffer();

    const alertWav = createWavBuffer(
      sampleRate,
      ALERT_TONE.totalDuration,
      (time) => {
        let sample = 0;

        for (const note of ALERT_TONE.notes) {
          const envelope = adsr(
            time,
            note.start,
            note.duration,
            0.005, // Sharp attack (5ms)
            0.05, // Quick decay (50ms)
            0.5, // Sustain at 50%
            0.15 // Medium release (150ms)
          );

          if (envelope > 0) {
            // Slightly brighter tone for alert
            const fundamental = Math.sin(2 * Math.PI * note.freq * time);
            const harmonic2 = Math.sin(4 * Math.PI * note.freq * time) * 0.2;
            const harmonic3 = Math.sin(6 * Math.PI * note.freq * time) * 0.15;

            sample += (fundamental + harmonic2 + harmonic3) * envelope * 0.35;
          }
        }

        return sample;
      }
    );

    engine.editor.setBufferData(alertBuffer, 0, alertWav);

    // Starts at 5s (after 2 effects + 2 gaps)
    const alertBlock = engine.block.create('audio');
    engine.block.appendChild(page, alertBlock);
    engine.block.setString(alertBlock, 'audio/fileURI', alertBuffer);
    engine.block.setTimeOffset(alertBlock, 2 * (effectDuration + gapDuration)); // 5s
    engine.block.setDuration(alertBlock, ALERT_TONE.totalDuration);
    engine.block.setVolume(alertBlock, 0.75);

    // Select the chime block to show it in the UI
    engine.block.select(chimeBlock);

    // Zoom to fit the timeline
    await cesdk.actions.run('zoom.toPage', { autoFit: true });

    // eslint-disable-next-line no-console
    console.log(
      `Sound effects: Success (0s), Melody (2.5s), Alert (5s) - each 2s, total ${totalDuration}s`
    );
  }
}

export default Example;
