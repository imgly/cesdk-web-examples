import CreativeEngine from '@cesdk/node';

// Mock moderation caches for demonstration
const imageCache = new Map();
const textCache = new Map();

/**
 * Extracts the image URL from a block's fill property
 */
function getImageUrl(engine, blockId) {
  try {
    const imageFill = engine.block.getFill(blockId);

    const fillImageURI = engine.block.getString(
      imageFill,
      'fill/image/imageFileURI'
    );
    if (fillImageURI) {
      return fillImageURI;
    }

    const sourceSet = engine.block.getSourceSet(
      imageFill,
      'fill/image/sourceSet'
    );
    if (sourceSet && sourceSet.length > 0) {
      return sourceSet[0].uri;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Extracts text content from a text block
 */
function getTextContent(engine, blockId) {
  try {
    return engine.block.getString(blockId, 'text/text');
  } catch (error) {
    return '';
  }
}

/**
 * Simulates an image content moderation API call
 * In production, replace this with your actual moderation service
 */
async function checkImageContentAPI(url) {
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const results = [
    {
      name: 'Weapons',
      description: 'Handguns, rifles, machine guns, threatening knives',
      state: percentageToState(Math.random() * 0.3)
    },
    {
      name: 'Alcohol',
      description: 'Wine, beer, cocktails, champagne',
      state: percentageToState(Math.random() * 0.4)
    },
    {
      name: 'Drugs',
      description: 'Cannabis, syringes, glass pipes, bongs, pills',
      state: percentageToState(Math.random() * 0.2)
    },
    {
      name: 'Nudity',
      description: 'Raw or partial nudity',
      state: percentageToState(Math.random() * 0.3)
    }
  ];

  imageCache.set(url, results);
  return results;
}

/**
 * Simulates a text content moderation API call
 * In production, replace this with your actual moderation service
 */
async function checkTextContentAPI(text) {
  if (textCache.has(text)) {
    return textCache.get(text);
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const results = [
    {
      name: 'Profanity',
      description: 'Offensive or vulgar language',
      state: percentageToState(Math.random() * 0.3)
    },
    {
      name: 'Hate Speech',
      description: 'Content promoting hatred or discrimination',
      state: percentageToState(Math.random() * 0.2)
    },
    {
      name: 'Threats',
      description: 'Threatening or violent language',
      state: percentageToState(Math.random() * 0.1)
    }
  ];

  textCache.set(text, results);
  return results;
}

/**
 * Maps confidence scores to validation states
 */
function percentageToState(percentage) {
  if (percentage > 0.8) {
    return 'failed';
  } else if (percentage > 0.4) {
    return 'warning';
  } else {
    return 'success';
  }
}

/**
 * Checks all images in the design for inappropriate content
 */
async function checkImageContent(engine) {
  const imageBlockIds = engine.block.findByKind('image');
  const imageBlocksData = imageBlockIds
    .map((blockId) => ({
      blockId,
      url: getImageUrl(engine, blockId),
      blockType: engine.block.getType(blockId),
      blockName: engine.block.getName(blockId)
    }))
    .filter((data) => data.url !== null);

  const imagesWithValidity = await Promise.all(
    imageBlocksData.map(async (imageBlockData) => {
      const categories = await checkImageContentAPI(imageBlockData.url);

      return categories.map((checkResult) => ({
        ...checkResult,
        blockId: imageBlockData.blockId,
        blockType: imageBlockData.blockType,
        blockName: imageBlockData.blockName,
        url: imageBlockData.url,
        id: `${imageBlockData.blockId}-${checkResult.name}`
      }));
    })
  );

  return imagesWithValidity.flat();
}

/**
 * Checks all text blocks in the design for inappropriate content
 */
async function checkTextContent(engine) {
  const textBlockIds = engine.block.findByType('//ly.img.ubq/text');
  const textBlocksData = textBlockIds
    .map((blockId) => ({
      blockId,
      text: getTextContent(engine, blockId),
      blockType: engine.block.getType(blockId),
      blockName: engine.block.getName(blockId)
    }))
    .filter((data) => data.text.trim().length > 0);

  const textsWithValidity = await Promise.all(
    textBlocksData.map(async (textBlockData) => {
      const categories = await checkTextContentAPI(textBlockData.text);

      return categories.map((checkResult) => ({
        ...checkResult,
        blockId: textBlockData.blockId,
        blockType: textBlockData.blockType,
        blockName: textBlockData.blockName,
        text: textBlockData.text,
        id: `${textBlockData.blockId}-${checkResult.name}`
      }));
    })
  );

  return textsWithValidity.flat();
}

/**
 * Displays validation results grouped by severity
 */
function displayResults(results) {
  const failed = results.filter((r) => r.state === 'failed');
  const warnings = results.filter((r) => r.state === 'warning');
  const passed = results.filter((r) => r.state === 'success');

  console.log('\n=== Content Moderation Results ===\n');
  console.log(`Total checks: ${results.length}`);
  console.log(`  Violations: ${failed.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log(`  Passed: ${passed.length}\n`);

  if (failed.length > 0) {
    console.log('❌ VIOLATIONS:');
    failed.forEach((result) => {
      const content = result.url || result.text?.substring(0, 50) + '...';
      console.log(
        `  - ${result.name}: Block ${result.blockId} (${result.blockType})`
      );
      console.log(`    ${result.description}`);
      console.log(`    Content: ${content}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach((result) => {
      const content = result.url || result.text?.substring(0, 50) + '...';
      console.log(
        `  - ${result.name}: Block ${result.blockId} (${result.blockType})`
      );
      console.log(`    ${result.description}`);
      console.log(`    Content: ${content}\n`);
    });
  }

  return { failed, warnings, passed };
}

/**
 * Validates content before allowing export
 */
async function validateForExport(engine) {
  console.log('Validating design before export...');

  const imageResults = await checkImageContent(engine);
  const textResults = await checkTextContent(engine);
  const allResults = [...imageResults, ...textResults];

  const { failed } = displayResults(allResults);

  if (failed.length > 0) {
    console.error(
      `\n❌ Export blocked: ${failed.length} policy violation(s) detected.\n`
    );
    return false;
  }

  console.log('\n✅ Content validation passed. Export allowed.\n');
  return true;
}

/**
 * Main demonstration function
 */
async function main() {
  console.log('🚀 Starting CE.SDK Content Moderation Demo...\n');

  // Initialize the engine
  const config = {
    license: process.env.CESDK_LICENSE || '',
    logger: (level, ...args) => {
      if (level === 'error' || level === 'warn') {
        console.log(`[${level}]`, ...args);
      }
    }
  };

  const engine = await CreativeEngine.init(config);
  console.log('✓ Engine initialized\n');

  // Load a sample scene/template
  // In production, use your actual scene URL or template
  const templateURL =
    'https://cdn.img.ly/packages/imgly/cesdk-js/latest/assets/templates/cesdk_postcard_1.scene';
  await engine.scene.loadFromURL(templateURL);
  const page = engine.block.findByType('page')[0];
  console.log('✓ Scene loaded\n');

  // The loaded scene already contains images and text
  // In production, you would modify the scene content as needed
  console.log('✓ Scene contains sample content for moderation\n');

  // Validate content before export
  const canExport = await validateForExport(engine);

  if (canExport) {
    // Export the design
    const blob = await engine.block.export(page, 'image/png');
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Save to file (optional)
    const fs = await import('fs/promises');
    await fs.writeFile('output.png', buffer);
    console.log('✓ Design exported to output.png\n');
  }

  // Clean up
  engine.dispose();
  console.log('✓ Engine disposed\n');
  console.log('Demo complete! 🎉');
}

// Run the demo
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
