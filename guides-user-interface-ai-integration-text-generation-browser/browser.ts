import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import AiApps from '@imgly/plugin-ai-apps-web';
import Anthropic from '@imgly/plugin-ai-text-generation-web/anthropic';
import OpenAI from '@imgly/plugin-ai-text-generation-web/open-ai';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load asset sources
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({ sceneMode: 'Design' });

    // Create a design scene
    await cesdk.createDesignScene();

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0]!;

    // Create a text block to demonstrate AI text generation features
    const textBlock = engine.block.create('text');
    engine.block.setString(
      textBlock,
      'text/text',
      'Use the AI Quick Actions in the canvas menu to rewrite this text'
    );
    engine.block.select(textBlock);

    // Set text block size and center it on the page
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const blockHeight = pageHeight / 4;
    engine.block.setWidth(textBlock, pageWidth);
    engine.block.setHeight(textBlock, blockHeight);
    engine.block.setPositionX(textBlock, 0);
    engine.block.setPositionY(textBlock, (pageHeight - blockHeight) / 2);

    // Center text horizontally and vertically
    engine.block.setEnum(textBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(textBlock, 'text/verticalAlignment', 'Center');

    // Set larger font size
    engine.block.setFloat(textBlock, 'text/fontSize', 24);

    engine.block.appendChild(page, textBlock);

    // Configure the AI text generation plugin
    // NOTE: In production, provide a secure proxy URL that forwards
    // requests to Anthropic API with your API key
    const proxyUrl = 'https://your-proxy-server.com/api/anthropic';

    // Configure text generation with both Anthropic and OpenAI using AiApps
    await cesdk.addPlugin(
      AiApps({
        providers: {
          text2text: [
            Anthropic.AnthropicProvider({
              proxyUrl,
              model: 'claude-sonnet-4-5-20250929',
              properties: {
                temperature: { default: 0.7 },
                max_tokens: { default: 500 }
              }
            }) as any,
            OpenAI.OpenAIProvider({
              proxyUrl: 'https://your-proxy-server.com/api/openai',
              model: 'gpt-4.1-nano-2025-04-14',
              properties: {
                temperature: { default: 0.7 },
                max_tokens: { default: 500 }
              }
            }) as any
          ]
        },
        // IMPORTANT: dryRun mode simulates generation without API calls
        // Perfect for testing and development
        dryRun: true
      })
    );

    // Reorder dock to show AI Apps button prominently
    cesdk.ui.setDockOrder(['ly.img.ai.apps.dock', ...cesdk.ui.getDockOrder()]);

    // Configure canvas menu to show AI text quick actions
    cesdk.ui.setCanvasMenuOrder([
      'ly.img.ai.text.canvasMenu',
      ...cesdk.ui.getCanvasMenuOrder()
    ]);

    // Customize UI labels for AI text generation features
    // This demonstrates how to customize the i18n system
    cesdk.i18n.setTranslations({
      en: {
        'ly.img.plugin-ai-text-generation-web.anthropic.quickAction.improve':
          '✨ Enhance Text',
        'ly.img.plugin-ai-text-generation-web.anthropic.property.prompt':
          'Your Custom Instructions'
      }
    });

    // Alternative: Configure with single provider
    /*
    await cesdk.addPlugin(
      AiApps({
        providers: {
          text2text: [
            Anthropic.AnthropicProvider({
              proxyUrl,
              model: 'claude-sonnet-4-5-20250929',
              properties: {
                temperature: { default: 0.7 },
                max_tokens: { default: 500 }
              }
            }) as any
          ]
        },
        dryRun: true
      })
    );
    */

    // Open the AI Apps panel to make the text generation features visible
    cesdk.ui.openPanel('ly.img.ai.apps.panel');
  }
}

export default Example;
