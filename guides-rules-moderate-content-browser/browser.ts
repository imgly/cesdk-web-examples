import type {
  EditorPlugin,
  EditorPluginContext,
  CreativeEngine
} from '@cesdk/cesdk-js';
import packageJson from './package.json';

// Type definitions for content moderation
interface ImageBlockData {
  blockId: number;
  url: string;
  blockType: string;
  blockName: string;
}

interface TextBlockData {
  blockId: number;
  text: string;
  blockType: string;
  blockName: string;
}

interface ContentCategory {
  name: string;
  description: string;
  state: 'success' | 'warning' | 'failed';
}

interface ValidationResult extends ContentCategory {
  blockId: number;
  blockType: string;
  blockName: string;
  id: string;
  url?: string; // For image blocks
  text?: string; // For text blocks
}

// Mock moderation caches
const imageCache: Record<string, ContentCategory[]> = {};
const textCache: Record<string, ContentCategory[]> = {};

/**
 * CE.SDK Plugin: Content Moderation Guide
 *
 * Demonstrates implementing automated content moderation for both images and text
 */
class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    engine.block.setWidth(page, 1200);
    engine.block.setHeight(page, 800);

    const pageHeight = engine.block.getHeight(page);

    // Create a single sample image
    const imageWidth = 500;
    const imageHeight = 400;
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    const imageBlock = await engine.block.addImage(imageUri, {
      size: { width: imageWidth, height: imageHeight }
    });

    // Position image in center-left
    engine.block.setPositionX(imageBlock, 100);
    engine.block.setPositionY(imageBlock, (pageHeight - imageHeight) / 2);

    engine.block.appendChild(page, imageBlock);

    const textBlock = engine.block.create('text');
    engine.block.setString(
      textBlock,
      'text/text',
      'Sample text content for moderation testing'
    );

    // Position text on the right side of the image
    engine.block.setPositionX(textBlock, 650);
    engine.block.setPositionY(textBlock, (pageHeight - 120) / 2);
    engine.block.setWidth(textBlock, 450);
    engine.block.setHeight(textBlock, 120);

    // Make text larger and more readable
    engine.block.setFloat(textBlock, 'text/fontSize', 48);
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Left');

    engine.block.appendChild(page, textBlock);

    await this.demonstrateContentModeration(engine);

    // Zoom to fit the entire page in the viewport
    await engine.scene.zoomToBlock(page, {
      padding: {
        left: 40,
        top: 40,
        right: 40,
        bottom: 40
      }
    });
  }

  private async demonstrateContentModeration(
    engine: CreativeEngine
  ): Promise<void> {
    // Check both images and text
    const imageResults = await this.checkImageContent(engine);
    const textResults = await this.checkTextContent(engine);
    const allResults = [...imageResults, ...textResults];

    // eslint-disable-next-line no-console
    console.log(`Total moderation checks: ${allResults.length}`);

    const failed = allResults.filter((r) => r.state === 'failed');
    const warnings = allResults.filter((r) => r.state === 'warning');
    const passed = allResults.filter((r) => r.state === 'success');

    // eslint-disable-next-line no-console
    console.log('Validation Summary:');
    // eslint-disable-next-line no-console
    console.log(`  Violations: ${failed.length}`);
    // eslint-disable-next-line no-console
    console.log(`  Warnings: ${warnings.length}`);
    // eslint-disable-next-line no-console
    console.log(`  Passed: ${passed.length}`);

    if (failed.length > 0) {
      const blockToSelect = failed[0].blockId;
      engine.block
        .findAllSelected()
        .forEach((id) => engine.block.setSelected(id, false));
      engine.block.setSelected(blockToSelect, true);
    }
  }

  /**
   * Extracts the image URL from a block's fill property
   */
  private getImageUrl(engine: CreativeEngine, blockId: number): string | null {
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
  private getTextContent(engine: CreativeEngine, blockId: number): string {
    try {
      return engine.block.getString(blockId, 'text/text');
    } catch (error) {
      return '';
    }
  }

  /**
   * Checks all images in the design for inappropriate content
   */
  private async checkImageContent(
    engine: CreativeEngine
  ): Promise<ValidationResult[]> {
    const imageBlockIds = engine.block.findByKind('image');
    const imageBlocksData: ImageBlockData[] = imageBlockIds
      .map((blockId) => ({
        blockId,
        url: this.getImageUrl(engine, blockId),
        blockType: engine.block.getType(blockId),
        blockName: engine.block.getName(blockId)
      }))
      .filter((data) => data.url !== null) as ImageBlockData[];

    const imagesWithValidity = await Promise.all(
      imageBlocksData.map(async (imageBlockData) => {
        const categories = await this.checkImageContentAPI(imageBlockData.url);

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
  private async checkTextContent(
    engine: CreativeEngine
  ): Promise<ValidationResult[]> {
    const textBlockIds = engine.block.findByType('//ly.img.ubq/text');
    const textBlocksData: TextBlockData[] = textBlockIds
      .map((blockId) => ({
        blockId,
        text: this.getTextContent(engine, blockId),
        blockType: engine.block.getType(blockId),
        blockName: engine.block.getName(blockId)
      }))
      .filter((data) => data.text.trim().length > 0);

    const textsWithValidity = await Promise.all(
      textBlocksData.map(async (textBlockData) => {
        const categories = await this.checkTextContentAPI(textBlockData.text);

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
   * Simulates an image content moderation API call
   */
  private async checkImageContentAPI(url: string): Promise<ContentCategory[]> {
    if (imageCache[url]) {
      return imageCache[url];
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results: ContentCategory[] = [
      {
        name: 'Weapons',
        description: 'Handguns, rifles, machine guns, threatening knives',
        state: this.percentageToState(Math.random() * 0.3)
      },
      {
        name: 'Alcohol',
        description: 'Wine, beer, cocktails, champagne',
        state: this.percentageToState(Math.random() * 0.4)
      },
      {
        name: 'Drugs',
        description: 'Cannabis, syringes, glass pipes, bongs, pills',
        state: this.percentageToState(Math.random() * 0.2)
      },
      {
        name: 'Nudity',
        description: 'Raw or partial nudity',
        state: this.percentageToState(Math.random() * 0.3)
      }
    ];

    imageCache[url] = results;
    return results;
  }

  /**
   * Simulates a text content moderation API call
   */
  private async checkTextContentAPI(text: string): Promise<ContentCategory[]> {
    if (textCache[text]) {
      return textCache[text];
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const results: ContentCategory[] = [
      {
        name: 'Profanity',
        description: 'Offensive or vulgar language',
        state: this.percentageToState(Math.random() * 0.3)
      },
      {
        name: 'Hate Speech',
        description: 'Content promoting hatred or discrimination',
        state: this.percentageToState(Math.random() * 0.2)
      },
      {
        name: 'Threats',
        description: 'Threatening or violent language',
        state: this.percentageToState(Math.random() * 0.1)
      }
    ];

    textCache[text] = results;
    return results;
  }

  /**
   * Maps confidence scores to validation states
   */
  private percentageToState(
    percentage: number
  ): 'success' | 'warning' | 'failed' {
    if (percentage > 0.8) {
      return 'failed';
    } else if (percentage > 0.4) {
      return 'warning';
    } else {
      return 'success';
    }
  }
}

export default Example;
