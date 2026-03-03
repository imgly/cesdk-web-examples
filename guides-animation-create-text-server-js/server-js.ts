import CreativeEngine from '@cesdk/node';
import { writeFile, mkdir } from 'fs/promises';
import { config } from 'dotenv';

config();

/**
 * CE.SDK Server Guide: Text Animations
 *
 * Demonstrates text-specific animation features in CE.SDK:
 * - Creating and applying animations to text blocks
 * - Text animation writing styles (line, word, character)
 * - Segment overlap configuration
 * - Combining with easing and duration properties
 */

async function main() {
  // Initialize CE.SDK engine in headless mode
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a video scene - required for animation support
    engine.scene.createVideo({
      page: { size: { width: 1920, height: 1080 } }
    });
    const page = engine.block.findByType('page')[0];

    // Set page duration to accommodate all animations
    engine.block.setDuration(page, 10);

    // Create a text block with a baseline animation
    const text1 = engine.block.create('text');
    engine.block.setWidth(text1, 600);
    engine.block.setHeight(text1, 200);
    engine.block.appendChild(page, text1);
    engine.block.setPositionX(text1, 100);
    engine.block.setPositionY(text1, 100);
    engine.block.replaceText(text1, 'Creating\nText\nAnimations');
    engine.block.setFloat(text1, 'text/fontSize', 48);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text1, 'text/verticalAlignment', 'Center');

    // Create an animation instance with the 'baseline' type
    const animation1 = engine.block.createAnimation('baseline');

    // Apply the animation to the text block's entrance
    engine.block.setInAnimation(text1, animation1);

    // Set basic animation properties
    engine.block.setDuration(animation1, 2.0);

    console.log('Created baseline animation attached to text block');

    // Writing Style: Line-by-line animation
    const text2 = engine.block.create('text');
    engine.block.setWidth(text2, 600);
    engine.block.setHeight(text2, 200);
    engine.block.appendChild(page, text2);
    engine.block.setPositionX(text2, 700);
    engine.block.setPositionY(text2, 100);
    engine.block.replaceText(text2, 'Line by line\nanimation\nfor text');
    engine.block.setFloat(text2, 'text/fontSize', 42);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text2, 'text/verticalAlignment', 'Center');

    const animation2 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text2, animation2);
    engine.block.setDuration(animation2, 2.0);

    // Set writing style to 'Line' for line-by-line animation
    engine.block.setEnum(animation2, 'textAnimationWritingStyle', 'Line');
    engine.block.setEnum(animation2, 'animationEasing', 'EaseOut');

    console.log('Created line-by-line animation');

    // Writing Style: Word-by-word animation
    const text3 = engine.block.create('text');
    engine.block.setWidth(text3, 600);
    engine.block.setHeight(text3, 200);
    engine.block.appendChild(page, text3);
    engine.block.setPositionX(text3, 1300);
    engine.block.setPositionY(text3, 100);
    engine.block.replaceText(text3, 'Animate word by word for emphasis');
    engine.block.setFloat(text3, 'text/fontSize', 42);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text3, 'text/verticalAlignment', 'Center');

    const animation3 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text3, animation3);
    engine.block.setDuration(animation3, 2.5);

    // Set writing style to 'Word' for word-by-word animation
    engine.block.setEnum(animation3, 'textAnimationWritingStyle', 'Word');
    engine.block.setEnum(animation3, 'animationEasing', 'EaseOut');

    console.log('Created word-by-word animation');

    // Writing Style: Character-by-character animation
    const text4 = engine.block.create('text');
    engine.block.setWidth(text4, 600);
    engine.block.setHeight(text4, 200);
    engine.block.appendChild(page, text4);
    engine.block.setPositionX(text4, 100);
    engine.block.setPositionY(text4, 400);
    engine.block.replaceText(
      text4,
      'Character by character for typewriter effect'
    );
    engine.block.setFloat(text4, 'text/fontSize', 38);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text4, 'text/verticalAlignment', 'Center');

    const animation4 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text4, animation4);
    engine.block.setDuration(animation4, 3.0);

    // Set writing style to 'Character' for character-by-character animation
    engine.block.setEnum(animation4, 'textAnimationWritingStyle', 'Character');
    engine.block.setEnum(animation4, 'animationEasing', 'Linear');

    console.log('Created character-by-character animation');

    // Segment Overlap: Sequential animation (overlap = 0)
    const text5 = engine.block.create('text');
    engine.block.setWidth(text5, 600);
    engine.block.setHeight(text5, 200);
    engine.block.appendChild(page, text5);
    engine.block.setPositionX(text5, 700);
    engine.block.setPositionY(text5, 400);
    engine.block.replaceText(text5, 'Sequential animation with zero overlap');
    engine.block.setFloat(text5, 'text/fontSize', 40);
    engine.block.setEnum(text5, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text5, 'text/verticalAlignment', 'Center');

    const animation5 = engine.block.createAnimation('pan');
    engine.block.setInAnimation(text5, animation5);
    engine.block.setDuration(animation5, 2.0);
    engine.block.setEnum(animation5, 'textAnimationWritingStyle', 'Word');

    // Set overlap to 0 for sequential animation
    engine.block.setFloat(animation5, 'textAnimationOverlap', 0.0);
    engine.block.setEnum(animation5, 'animationEasing', 'EaseOut');

    console.log('Created sequential animation (overlap = 0)');

    // Segment Overlap: Cascading animation (overlap = 0.4)
    const text6 = engine.block.create('text');
    engine.block.setWidth(text6, 600);
    engine.block.setHeight(text6, 200);
    engine.block.appendChild(page, text6);
    engine.block.setPositionX(text6, 1300);
    engine.block.setPositionY(text6, 400);
    engine.block.replaceText(text6, 'Cascading animation with partial overlap');
    engine.block.setFloat(text6, 'text/fontSize', 40);
    engine.block.setEnum(text6, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text6, 'text/verticalAlignment', 'Center');

    const animation6 = engine.block.createAnimation('pan');
    engine.block.setInAnimation(text6, animation6);
    engine.block.setDuration(animation6, 1.5);
    engine.block.setEnum(animation6, 'textAnimationWritingStyle', 'Word');

    // Set overlap to 0.4 for cascading effect
    engine.block.setFloat(animation6, 'textAnimationOverlap', 0.4);
    engine.block.setEnum(animation6, 'animationEasing', 'EaseOut');

    console.log('Created cascading animation (overlap = 0.4)');

    // Query available writing style and easing options
    const writingStyleOptions = engine.block.getEnumValues(
      'textAnimationWritingStyle'
    );
    console.log('Available writing style options:', writingStyleOptions);

    const easingOptions = engine.block.getEnumValues('animationEasing');
    console.log('Available easing options:', easingOptions);

    // Ensure output directory exists
    await mkdir('output', { recursive: true });

    // Export first frame as PNG to verify the scene setup
    const blob = await engine.block.export(page, 'image/png');
    const buffer = Buffer.from(await blob.arrayBuffer());
    await writeFile('output/text-animations.png', buffer);

    console.log('');
    console.log('Text Animations guide complete.');
    console.log('Scene created with:');
    console.log('  - 6 text blocks with different animation configurations');
    console.log('  - Writing styles: default, Line, Word, Character');
    console.log('  - Overlap values: 0.0 (sequential), 0.4 (cascading)');
    console.log('  - Exported preview: output/text-animations.png');
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
