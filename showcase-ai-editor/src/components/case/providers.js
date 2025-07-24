import FalAiImage from '@imgly/plugin-ai-image-generation-web/fal-ai';
import OpenAiImage from '@imgly/plugin-ai-image-generation-web/open-ai';
import FalAiVideo from '@imgly/plugin-ai-video-generation-web/fal-ai';
import Anthropic from '@imgly/plugin-ai-text-generation-web/anthropic';
import OpenAIText from '@imgly/plugin-ai-text-generation-web/open-ai';
import Elevenlabs from '@imgly/plugin-ai-audio-generation-web/elevenlabs';
import FalAiSticker from '@imgly/plugin-ai-sticker-generation-web/fal-ai';

// Proxy URLs for different providers
let FAL_AI_PROXY_URL = '';
let ANTHROPIC_PROXY_URL = '';
let OPEN_AI_PROXY_URL = '';
let ELEVENLABS_PROXY_URL = '';


export const createAIProviders = (sceneMode = 'Design') => {
  const allProviders = {
  text2text: {
    name: 'Text to Text',
    supportedModes: ['Design', 'Video'],
    providers: [
      { 
        name: 'Claude Sonnet 3.7', 
        label: 'Anthropic', 
        selected: true,
        provider: (middleware) => Anthropic.AnthropicProvider({ 
          proxyUrl: ANTHROPIC_PROXY_URL,
          model: 'claude-3-7-sonnet-20250219'
        })
      },
      { 
        name: 'GPT-4o mini', 
        label: 'OpenAI', 
        selected: true,
        provider: (middleware) => OpenAIText.OpenAIProvider({ 
          proxyUrl: OPEN_AI_PROXY_URL,
          model: 'gpt-4o-mini'
        })
      },
    ]
  },
  text2image: {
    name: 'Text to Image',
    supportedModes: ['Design', 'Video'],
    providers: [
      { 
        name: 'Recraft V3', 
        label: 'Recraft', 
        selected: true,
        provider: (middleware) => FalAiImage.RecraftV3({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      },
      { 
        name: 'Recraft 20B', 
        label: 'Recraft', 
        selected: false,
        provider: (middleware) => FalAiImage.Recraft20b({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      },
      { 
        name: 'GPT Image 1', 
        label: 'OpenAI', 
        selected: true,
        provider: (middleware) => OpenAiImage.GptImage1.Text2Image({ 
          proxyUrl: OPEN_AI_PROXY_URL,
        })
      }
    ]
  },
  text2sticker: {
    name: 'Text to Sticker',
    supportedModes: ['Design', 'Video'],
    providers: [
      {
        name: 'Recraft 20B',
        label: 'Recraft',
        selected: true,
        provider: (middleware) => FalAiSticker.Recraft20b({
          proxyUrl: FAL_AI_PROXY_URL,
        })
      }
    ]
  },
  text2video: {
    name: 'Text to Video',
    supportedModes: ['Video'],
    providers: [
      { 
        name: 'Minimax Video-01 Live', 
        label: 'Minimax', 
        selected: true,
        provider: (middleware) => FalAiVideo.MinimaxVideo01Live({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      },
      { 
        name: 'Pixverse V3.5', 
        label: 'Pixverse', 
        selected: false,
        provider: (middleware) => FalAiVideo.PixverseV35TextToVideo({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      },
      { 
        name: 'Kling Video V2.1 Master', 
        label: 'Kuaishou', 
        selected: true,
        provider: (middleware) => FalAiVideo.KlingVideoV21MasterTextToVideo({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      },
      { 
        name: 'Veo 3', 
        label: 'Google DeepMind', 
        selected: true,
        provider: (middleware) => FalAiVideo.Veo3TextToVideo({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      }
    ]
  },
  text2speech: {
    name: 'Text to Speech',
    supportedModes: ['Video'],
    providers: [
      {
        name: 'Multilingual V2',
        label: 'ElevenLabs',
        selected: true,
        provider: (middleware) => Elevenlabs.ElevenMultilingualV2({
          proxyUrl: ELEVENLABS_PROXY_URL
        })
      }
    ]
  },
  text2sound: {
    name: 'Text to Sound',
    supportedModes: ['Video'],
    providers: [
      {
        name: 'Sound Effects',
        label: 'ElevenLabs',
        selected: true,
        provider: (middleware) => Elevenlabs.ElevenSoundEffects({
          proxyUrl: ELEVENLABS_PROXY_URL
        })
      }
    ]
  },
  image2image: {
    name: 'Image to Image',
    supportedModes: ['Design', 'Video'],
    providers: [
      { 
        name: 'Gemini Flash Edit', 
        label: 'Google', 
        selected: true,
        provider: (middleware) => FalAiImage.GeminiFlashEdit({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      },
      { 
        name: 'GPT Image 1', 
        label: 'OpenAI', 
        selected: true,
        provider: (middleware) => OpenAiImage.GptImage1.Image2Image({ 
          proxyUrl: OPEN_AI_PROXY_URL,
        })
      },
      { 
        name: 'Flux Pro Kontext', 
        label: 'Black Forest', 
        selected: true,
        provider: (middleware) => FalAiImage.FluxProKontextEdit({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      },
      { 
        name: 'Flux Pro Kontext Max', 
        label: 'Black Forest', 
        selected: true,
        provider: (middleware) => FalAiImage.FluxProKontextMaxEdit({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      }
    ]
  },
  image2video: {
    name: 'Image to Video',
    supportedModes: ['Video'],
    providers: [
      { 
        name: 'Minimax Video-01 Live', 
        label: 'Minimax', 
        selected: true,
        provider: (middleware) => FalAiVideo.MinimaxVideo01LiveImageToVideo({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      },
      { 
        name: 'Kling Video V2.1 Master', 
        label: 'Kuaishou', 
        selected: true,
        provider: (middleware) => FalAiVideo.KlingVideoV21MasterImageToVideo({ 
          proxyUrl: FAL_AI_PROXY_URL,
        })
      }
    ]
  }
  };

  // Filter providers based on scene mode
  const filteredProviders = {};
  for (const [key, category] of Object.entries(allProviders)) {
    if (category.supportedModes.includes(sceneMode)) {
      filteredProviders[key] = category;
    }
  }

  return filteredProviders;
};
