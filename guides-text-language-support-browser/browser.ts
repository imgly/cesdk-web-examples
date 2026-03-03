import type { EditorPlugin, EditorPluginContext, CreativeEngine } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
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
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

// Typeface definitions
const ROBOTO_BOLD = {
  name: 'Roboto',
  fonts: [
    {
      uri: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9vAw.ttf',
      subFamily: 'Bold',
      weight: 'bold' as const,
      style: 'normal' as const
    }
  ]
};

const NOTO_NASKH_ARABIC = {
  name: 'Noto Naskh Arabic',
  fonts: [
    {
      uri: `${window.location.origin}${import.meta.env.BASE_URL}NotoNaskhArabic-Regular.ttf`,
      subFamily: 'Regular',
      weight: 'normal' as const,
      style: 'normal' as const
    }
  ]
};

const NOTO_SANS_KR = {
  name: 'Noto Sans KR',
  fonts: [
    {
      uri: `${window.location.origin}${import.meta.env.BASE_URL}NotoSansKR-VariableFont_wght.ttf`,
      subFamily: 'Regular',
      weight: 'normal' as const,
      style: 'normal' as const
    }
  ]
};

// Layout configuration
const LAYOUT = {
  PAGE: { width: 800, height: 1200 },
  TEXT: { x: 50, width: 700, defaultHeight: 140, fontSize: 20 },
  SPACING: { gap: 16, startY: 50 }
};

// Typeface interface
interface Typeface {
  name: string;
  fonts: Array<{
    uri: string;
    subFamily: string;
    weight: 'normal' | 'bold';
    style: 'normal' | 'italic';
  }>;
}

function createTextBlock(
  engine: CreativeEngine,
  page: number,
  text: string,
  typeface: Typeface,
  yPosition: number,
  height: number = LAYOUT.TEXT.defaultHeight,
  alignment: 'Left' | 'Center' | 'Right' = 'Left'
): void {
  const textBlock = engine.block.create('text');
  engine.block.setString(textBlock, 'text/text', text);
  engine.block.setPositionX(textBlock, LAYOUT.TEXT.x);
  engine.block.setPositionY(textBlock, yPosition);
  engine.block.setWidth(textBlock, LAYOUT.TEXT.width);
  engine.block.setHeight(textBlock, height);
  engine.block.setFloat(textBlock, 'text/fontSize', LAYOUT.TEXT.fontSize);
  engine.block.setTypeface(textBlock, typeface);
  if (alignment !== 'Left') {
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', alignment);
  }
  engine.block.appendChild(page, textBlock);
}

/**
 * CE.SDK Plugin: Text Language Support Guide
 *
 * Demonstrates multilingual text support:
 * - RTL text rendering (Arabic)
 * - Complex script support (Korean)
 * - Custom font loading for Unicode coverage
 * - Text alignment for different writing directions
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }
    // Add custom multilingual fonts to asset library
    cesdk.engine.asset.addLocalSource('multilingual-typefaces');

    cesdk.engine.asset.addAssetToSource('multilingual-typefaces', {
      id: 'noto-naskh-arabic',
      label: { en: 'Noto Naskh Arabic' },
      payload: {
        typeface: {
          name: 'Noto Naskh Arabic',
          fonts: [
            {
              uri: `${window.location.origin}${import.meta.env.BASE_URL}NotoNaskhArabic-Regular.ttf`,
              subFamily: 'Regular',
              weight: 'normal',
              style: 'normal'
            }
          ]
        }
      }
    });

    cesdk.engine.asset.addAssetToSource('multilingual-typefaces', {
      id: 'noto-sans-kr',
      label: { en: 'Noto Sans KR' },
      payload: {
        typeface: {
          name: 'Noto Sans KR',
          fonts: [
            {
              uri: `${window.location.origin}${import.meta.env.BASE_URL}NotoSansKR-VariableFont_wght.ttf`,
              subFamily: 'Regular',
              weight: 'normal',
              style: 'normal'
            }
          ]
        }
      }
    });

    cesdk.ui.updateAssetLibraryEntry('ly.img.typefaces', {
      sourceIds: ['ly.img.typeface', 'multilingual-typefaces']
    });

    const engine = cesdk.engine;

    // Create a blank scene with a white canvas
    const scene = engine.scene.create();
    const page = engine.block.create('page');
    engine.block.setWidth(page, LAYOUT.PAGE.width);
    engine.block.setHeight(page, LAYOUT.PAGE.height);
    engine.block.appendChild(scene, page);
    engine.scene.zoomToBlock(page);

    // Create four text elements demonstrating multilingual font support
    const textElements = [
      { text: 'RTL Arabic', typeface: ROBOTO_BOLD, height: 140 },
      {
        text: 'هذا مثال.',
        typeface: NOTO_NASKH_ARABIC,
        height: 160,
        alignment: 'Right' as const
      },
      { text: 'Korean', typeface: ROBOTO_BOLD, height: 140 },
      { text: '이는 한 예입니다.', typeface: NOTO_SANS_KR, height: 140 }
    ];

    let currentY = LAYOUT.SPACING.startY;
    for (const element of textElements) {
      createTextBlock(
        engine,
        page,
        element.text,
        element.typeface,
        currentY,
        element.height,
        element.alignment
      );
      currentY += element.height + LAYOUT.SPACING.gap;
    }
  }
}

export default Example;
