import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
import { AudioCodec, VideoCodec } from '@cesdk/engine';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    const engine = cesdk.engine;

    cesdk.feature.enable('ly.img.video');
    await engine.scene.load(
      'https://cdn.img.ly/assets/demo/v3/ly.img.video.template/templates/milli-surf-school.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');

    await cesdk.actions.run('zoom.toPage', { autoFit: true });

    this.setupExportActions(cesdk, page);
  }

  private setupExportActions(cesdk: CreativeEditorSDK, page: number): void {
    const engine = cesdk.engine;

    const runWithDialog = async (
      title: string,
      exportBlob: (
        onProgress: (rendered: number, encoded: number, total: number) => void
      ) => Promise<Blob>
    ): Promise<void> => {
      const dialog = cesdk.utils.showLoadingDialog({
        title,
        message: 'Encoding WebM...',
        progress: 0
      });
      try {
        const blob = await exportBlob((_, encoded, total) => {
          dialog.updateProgress({ value: encoded, max: total });
        });
        dialog.close();
        await cesdk.utils.downloadFile(blob, 'video/webm');
      } catch (error) {
        dialog.showError({ message: 'Export failed' });
        throw error;
      }
    };

    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-builtin',
            label: 'Export Video',
            icon: '@imgly/Save',
            onClick: () => {
              cesdk.actions.run('exportDesign', { mimeType: 'video/webm' });
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-webm',
            label: 'Export WebM',
            icon: '@imgly/Save',
            onClick: () =>
              runWithDialog('Exporting WebM', async (onProgress) => {
                const blob = await engine.block.exportVideo(page, {
                  mimeType: 'video/webm',
                  onProgress
                });
                return blob;
              })
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-webm-checked',
            label: 'Export (checked)',
            icon: '@imgly/Save',
            onClick: () =>
              runWithDialog('Exporting WebM', async (onProgress) => {
                await engine.editor.checkCapabilities();
                const canEncodeWebM =
                  engine.editor.getCapabilityState('vp9Encode') ===
                    'supported' &&
                  engine.editor.getCapabilityState('opusEncode') ===
                    'supported';
                if (!canEncodeWebM) {
                  throw new Error('This browser cannot encode VP9 and Opus');
                }
                return engine.block.exportVideo(page, {
                  mimeType: 'video/webm',
                  onProgress
                });
              })
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-webm-codecs',
            label: 'Export VP8',
            icon: '@imgly/Save',
            onClick: () =>
              runWithDialog('Exporting VP8', async (onProgress) => {
                const blob = await engine.block.exportVideo(page, {
                  mimeType: 'video/webm',
                  videoCodec: VideoCodec.VP8,
                  audioCodec: AudioCodec.Opus,
                  onProgress
                });
                return blob;
              })
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-webm-av1',
            label: 'Export AV1',
            icon: '@imgly/Save',
            onClick: () =>
              runWithDialog('Exporting AV1', async (onProgress) => {
                await engine.editor.checkCapabilities();
                if (
                  engine.editor.getCapabilityState('av1Encode') !== 'supported'
                ) {
                  throw new Error('This browser cannot encode AV1');
                }
                const blob = await engine.block.exportVideo(page, {
                  mimeType: 'video/webm',
                  videoCodec: VideoCodec.AV1,
                  targetWidth: 1280,
                  targetHeight: 720,
                  framerate: 30,
                  videoBitrate: 4_000_000,
                  onProgress
                });
                return blob;
              })
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'export-audio-webm',
            label: 'Export Audio',
            icon: '@imgly/Save',
            onClick: async () => {
              const audioBlob = await engine.block.exportAudio(page, {
                mimeType: 'audio/webm'
              });
              // downloadFile has no 'audio/webm' type, and 'video/webm' gives the same .webm file.
              await cesdk.utils.downloadFile(audioBlob, 'video/webm');
            }
          }
        ]
      }
    );
  }
}

export default Example;
