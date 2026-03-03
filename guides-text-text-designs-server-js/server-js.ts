/**
 * CE.SDK Server Guide: Text Designs
 *
 * Demonstrates how to create and register custom text designs (text components):
 * - Create styled text blocks programmatically
 * - Save components as archives with block.saveToArchive()
 * - Generate thumbnails with block.export()
 * - Create content.json structure for custom asset sources
 *
 * The saveToArchive() method creates a zip archive containing the blocks.blocks file
 * and all referenced resources (fonts, images). Extract this archive and serve the
 * files. Use block.loadFromURL() pointing to the blocks.blocks file to load components.
 */

import CreativeEngine from '@cesdk/node';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

async function main(): Promise<void> {
  const engine = await CreativeEngine.init({
    // license: process.env.CESDK_LICENSE,
  });

  try {
    // Create a scene with a page to hold our text components
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.appendChild(scene, page);
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Create a styled text block that will become our custom component
    const textComponent = engine.block.create('text');
    engine.block.appendChild(page, textComponent);

    // Set text content and styling
    engine.block.replaceText(textComponent, 'Custom Title');
    engine.block.setFloat(textComponent, 'text/fontSize', 72);

    // Set text color to a brand color
    engine.block.setTextColor(textComponent, {
      r: 0.2,
      g: 0.4,
      b: 0.8,
      a: 1.0
    });

    // Configure dimensions - use fixed frame with clipping
    engine.block.setWidthMode(textComponent, 'Absolute');
    engine.block.setHeightMode(textComponent, 'Absolute');
    engine.block.setWidth(textComponent, 400);
    engine.block.setHeight(textComponent, 100);
    engine.block.setBool(textComponent, 'clipped', true);

    // Position the component on the page
    engine.block.setPositionX(textComponent, 50);
    engine.block.setPositionY(textComponent, 50);

    // Define a custom typeface
    // With saveToArchive(), fonts are automatically bundled in the archive
    // You can use any font - CDN URLs, bundle:// URIs, or custom fonts
    const caveatTypeface = {
      name: 'Caveat',
      fonts: [
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Caveat/Caveat-Regular.ttf',
          subFamily: 'Regular'
        },
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Caveat/Caveat-Bold.ttf',
          subFamily: 'Bold'
        }
      ]
    };

    // Set the font - saveToArchive() will include the font files in the archive
    engine.block.setFont(
      textComponent,
      caveatTypeface.fonts[0].uri,
      caveatTypeface
    );

    // Configure constraints for flexible resizing
    // Enable automatic font sizing within constraints
    engine.block.setBool(textComponent, 'text/automaticFontSizeEnabled', true);
    engine.block.setFloat(textComponent, 'text/minAutomaticFontSize', 24);
    engine.block.setFloat(textComponent, 'text/maxAutomaticFontSize', 120);

    // Save the component to a blocks archive file
    // saveToArchive() returns a Blob containing a zip with blocks.blocks and resources
    const archiveBlob = await engine.block.saveToArchive([textComponent]);
    console.log('Archive size:', archiveBlob.size, 'bytes');

    // Generate a thumbnail for the text component
    // Thumbnails should be 400x320px for the asset library
    const thumbnailBlob = await engine.block.export(textComponent, {
      mimeType: 'image/png',
      targetWidth: 400,
      targetHeight: 320
    });
    console.log('Thumbnail size:', thumbnailBlob.size, 'bytes');

    // Create the content.json structure for the custom components
    // The uri points to the blocks.blocks file within the extracted archive directory
    const contentJson = {
      version: '3.0.0',
      id: 'my.custom.textComponents',
      assets: [
        {
          id: '//my.custom.textComponents/customTitle',
          label: {
            en: 'Custom Title'
          },
          meta: {
            // URI points to blocks.blocks within the extracted archive directory
            // The {{base_url}} placeholder is replaced with your configured base URL
            uri: '{{base_url}}/my.custom.textComponents/data/customTitle/blocks.blocks',
            thumbUri:
              '{{base_url}}/my.custom.textComponents/thumbnails/customTitle.png',
            mimeType: 'application/ubq-blocks-string'
          }
        },
        {
          id: '//my.custom.textComponents/promo',
          label: {
            en: 'Promo'
          },
          meta: {
            uri: '{{base_url}}/my.custom.textComponents/data/promo/blocks.blocks',
            thumbUri:
              '{{base_url}}/my.custom.textComponents/thumbnails/promo.png',
            mimeType: 'application/ubq-blocks-string'
          }
        }
      ],
      blocks: []
    };
    console.log('Content.json structure:');
    console.log(JSON.stringify(contentJson, null, 2));

    // Save the archive, thumbnail, and content.json to files
    // Create output directory structure
    const outputDir = './output';
    const dataDir = `${outputDir}/data`;
    const thumbnailsDir = `${outputDir}/thumbnails`;

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }
    if (!existsSync(thumbnailsDir)) {
      mkdirSync(thumbnailsDir, { recursive: true });
    }

    // Save the archive as a zip file
    // Extract this archive to get the blocks.blocks file and any resources (fonts, images)
    // After extraction, the directory structure should be:
    //   data/customTitle/blocks.blocks
    //   data/customTitle/fonts/... (if any custom fonts)
    //   data/customTitle/images/... (if any images)
    const archivePath = `${dataDir}/customTitle.zip`;
    const archiveBuffer = Buffer.from(await archiveBlob.arrayBuffer());
    writeFileSync(archivePath, archiveBuffer);
    console.log(`Saved archive to: ${archivePath}`);
    console.log('Extract this archive to create the data/customTitle/ directory');

    // Save the thumbnail
    const thumbnailPath = `${thumbnailsDir}/customTitle.png`;
    const thumbnailBuffer = Buffer.from(await thumbnailBlob.arrayBuffer());
    writeFileSync(thumbnailPath, thumbnailBuffer);
    console.log(`Saved thumbnail to: ${thumbnailPath}`);

    // Save the content.json
    const contentJsonPath = `${outputDir}/content.json`;
    writeFileSync(contentJsonPath, JSON.stringify(contentJson, null, 2));
    console.log(`Saved content.json to: ${contentJsonPath}`);

    // In production, host the files and register the asset source from a URL:
    //
    // await engine.asset.addLocalAssetSourceFromJSON(
    //   new URL('https://your-server.com/my.custom.textComponents/content.json')
    // );
    //
    // The SDK will then use block.loadFromURL() to load components from
    // the URIs specified in content.json (e.g., data/customTitle/blocks.blocks)
    console.log('\nTo use these components in production:');
    console.log('1. Extract the archives:');
    console.log('   unzip data/customTitle.zip -d data/customTitle/');
    console.log('   unzip data/promo.zip -d data/promo/');
    console.log('2. Host the output directory on your server');
    console.log(
      '3. Register with: engine.asset.addLocalAssetSourceFromJSON(new URL(contentJsonUrl))'
    );

    // Create a second example component with different styling
    const promoComponent = engine.block.create('text');
    engine.block.appendChild(page, promoComponent);

    engine.block.replaceText(promoComponent, 'SALE');
    engine.block.setFloat(promoComponent, 'text/fontSize', 96);

    // Use a bold red color for the promo text
    engine.block.setTextColor(promoComponent, {
      r: 0.9,
      g: 0.2,
      b: 0.2,
      a: 1.0
    });

    // Set a bold font for the promo component
    const robotoTypeface = {
      name: 'Roboto',
      fonts: [
        {
          uri: 'https://cdn.img.ly/assets/v3/ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf',
          subFamily: 'Bold'
        }
      ]
    };
    engine.block.setFont(
      promoComponent,
      robotoTypeface.fonts[0].uri,
      robotoTypeface
    );

    engine.block.setWidthMode(promoComponent, 'Absolute');
    engine.block.setHeightMode(promoComponent, 'Absolute');
    engine.block.setWidth(promoComponent, 300);
    engine.block.setHeight(promoComponent, 120);
    engine.block.setBool(promoComponent, 'clipped', true);

    engine.block.setPositionX(promoComponent, 50);
    engine.block.setPositionY(promoComponent, 200);

    // Save the promo component as an archive
    const promoArchiveBlob = await engine.block.saveToArchive([promoComponent]);
    const promoArchiveBuffer = Buffer.from(await promoArchiveBlob.arrayBuffer());
    writeFileSync(`${dataDir}/promo.zip`, promoArchiveBuffer);
    console.log(`Saved promo archive to: ${dataDir}/promo.zip`);

    // Export promo thumbnail
    const promoThumbnail = await engine.block.export(promoComponent, {
      mimeType: 'image/png',
      targetWidth: 400,
      targetHeight: 320
    });
    const promoThumbnailBuffer = Buffer.from(await promoThumbnail.arrayBuffer());
    writeFileSync(`${thumbnailsDir}/promo.png`, promoThumbnailBuffer);
    console.log(`Saved promo thumbnail to: ${thumbnailsDir}/promo.png`);

    console.log('\nFont combinations created successfully!');
    console.log('Output files are in:', outputDir);
  } finally {
    // Always dispose of the engine to free resources
    engine.dispose();
  }
}

main().catch(console.error);
