import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * CE.SDK Server Guide: Text Animators
 *
 * Demonstrates how to animate parts of a text with text animators:
 * - Creating a text animator and attaching it to a text block
 * - Glyph properties and the range selector
 * - Keyframes on the range
 * - The order of several animators, and removing one
 * - Keyframes on the text content
 */
async function main() {
  // Initialize the headless Creative Engine
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE
  });

  try {
    // Create a scene with a page
    const scene = engine.scene.create('DepthStack');
    const page = engine.block.create('page');
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);
    engine.block.appendChild(scene, page);

    // A 5 second headline in the middle of the page
    const text = engine.block.create('text');
    engine.block.replaceText(text, 'Text animators move every letter');
    engine.block.setTextFontSize(text, 120);
    engine.block.setEnum(text, 'text/horizontalAlignment', 'Center');
    engine.block.setWidth(text, 1600);
    engine.block.setHeightMode(text, 'Auto');
    engine.block.setPositionX(text, 160);
    engine.block.setPositionY(text, 380);
    engine.block.appendChild(page, text);
    engine.block.setDuration(text, 5);

    console.log(engine.block.supportsTextAnimators(text)); // true
    console.log(engine.block.supportsTextAnimators(page)); // false

    // The covered glyphs sit 60 units lower and are hidden
    const reveal = engine.block.createTextAnimator();
    engine.block.setFloat(reveal, 'text_animator/positionY', 60);
    engine.block.setBool(reveal, 'text_animator/opacityEnabled', true);
    engine.block.setFloat(reveal, 'text_animator/opacity', 0);
    engine.block.appendTextAnimator(text, reveal);

    // Move the start of the range from 0 to 1 in the first half of the
    // text's duration. The uncovered glyphs rise and fade in, left to right.
    engine.block.setKeyframes(reveal, 'text_animator/selectorStart', [
      {
        time: 0,
        value: { type: 'Float', value: 0 },
        easing: { type: 'Preset', preset: 'EaseOut' }
      },
      { time: 0.5, value: { type: 'Float', value: 1 } }
    ]);

    // Cover the second word only: words are counted from 0 in index units
    const highlight = engine.block.createTextAnimator();
    engine.block.setEnum(highlight, 'text_animator/selectorBasedOn', 'Words');
    engine.block.setEnum(highlight, 'text_animator/selectorUnits', 'Index');
    engine.block.setFloat(highlight, 'text_animator/selectorStart', 1);
    engine.block.setFloat(highlight, 'text_animator/selectorEnd', 2);

    // Color and scale the covered glyphs
    engine.block.setBool(highlight, 'text_animator/fillColorEnabled', true);
    engine.block.setColor(highlight, 'text_animator/fillColor', {
      r: 1,
      g: 0.5,
      b: 0,
      a: 1
    });
    engine.block.setFloat(highlight, 'text_animator/scaleX', 1.2);
    engine.block.setFloat(highlight, 'text_animator/scaleY', 1.2);

    // Insert the highlight before the reveal
    engine.block.insertTextAnimator(text, highlight, 0);
    console.log(engine.block.getTextAnimators(text)); // [highlight, reveal]

    // A triangle covers a quarter of the characters and peaks in its middle
    const wave = engine.block.createTextAnimator();
    engine.block.setEnum(wave, 'text_animator/selectorShape', 'Triangle');
    engine.block.setFloat(wave, 'text_animator/selectorEnd', 0.25);
    engine.block.setFloat(wave, 'text_animator/positionY', -40);
    engine.block.setFloat(wave, 'text_animator/rotation', -0.2);

    // Move the range across the text over the whole duration
    engine.block.setKeyframes(wave, 'text_animator/selectorOffset', [
      { time: 0, value: { type: 'Float', value: -0.25 } },
      { time: 1, value: { type: 'Float', value: 1 } }
    ]);
    engine.block.appendTextAnimator(text, wave);

    // Remove the highlight at index 0. The animator stays valid.
    engine.block.removeTextAnimator(text, 0);
    console.log(engine.block.isValid(highlight)); // true

    // Append it again so that it applies last
    engine.block.appendTextAnimator(text, highlight);
    console.log(engine.block.getTextAnimators(text)); // [reveal, wave, highlight]

    // A second text block counts down from 3 to 1
    const countdown = engine.block.create('text');
    engine.block.replaceText(countdown, '3');
    engine.block.setTextFontSize(countdown, 160);
    engine.block.setWidthMode(countdown, 'Auto');
    engine.block.setHeightMode(countdown, 'Auto');
    engine.block.setPositionX(countdown, 900);
    engine.block.setPositionY(countdown, 700);
    engine.block.appendChild(page, countdown);
    engine.block.setDuration(countdown, 5);

    engine.block.setKeyframes(countdown, 'text/text', [
      { time: 0, value: { type: 'Discrete', value: '3' } },
      { time: 0.33, value: { type: 'Discrete', value: '2' } },
      { time: 0.67, value: { type: 'Discrete', value: '1' } }
    ]);

    try {
      // The reveal already belongs to the headline
      engine.block.appendTextAnimator(countdown, reveal);
    } catch (error) {
      // Engine errors carry a stable catalog id in `code`
      const { code } = error as { code?: string };
      console.log(code); // 'BLOCK.TEXT_ANIMATOR_ALREADY_ATTACHED'
    }

    // Export the frame at 2 seconds, during the reveal
    engine.block.setPlaybackTime(page, 2);

    const outputDir = './output';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const blob = await engine.block.export(page, { mimeType: 'image/png' });
    const buffer = Buffer.from(await blob.arrayBuffer());
    writeFileSync(`${outputDir}/text-animators.png`, buffer);

    console.log('Exported result to output/text-animators.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
