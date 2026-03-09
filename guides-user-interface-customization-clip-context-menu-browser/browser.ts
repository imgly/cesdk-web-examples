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

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features
    cesdk.feature.enable('ly.img.video.*');

    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
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

    await cesdk.actions.run('scene.create', { mode: 'Video' });

    // Retrieve the default clip menu order for background clips
    const clipOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.video.clip.menu',
      when: { clipType: 'clip' }
    });
    // eslint-disable-next-line no-console
    console.log('Default clip menu order:', clipOrder);

    // Retrieve the default overlay menu order
    const overlayOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.video.clip.menu',
      when: { clipType: 'overlay' }
    });
    // eslint-disable-next-line no-console
    console.log('Default overlay menu order:', overlayOrder);

    // Retrieve the default caption menu order
    const captionOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.video.clip.menu',
      when: { clipType: 'caption' }
    });
    // eslint-disable-next-line no-console
    console.log('Default caption menu order:', captionOrder);

    // Replace the overlay menu with a simplified layout
    cesdk.ui.setComponentOrder(
      { in: 'ly.img.video.clip.menu', when: { clipType: 'overlay' } },
      [
        'ly.img.video.clip.menu.setAsClip',
        'ly.img.separator',
        'ly.img.video.clip.menu.duplicate',
        'ly.img.video.clip.menu.delete'
      ]
    );

    // Add a custom "Export Clip" action to the background clip menu
    cesdk.ui.insertOrderComponent(
      {
        in: 'ly.img.video.clip.menu',
        before: 'ly.img.video.clip.menu.delete',
        when: { clipType: 'clip' }
      },
      {
        id: 'ly.img.video.clip.menu.action',
        key: 'export-clip',
        label: 'Export Clip',
        icon: '@imgly/Download',
        onClick: () => {
          // eslint-disable-next-line no-console
          console.log('Export Clip action triggered');
        }
      }
    );

    // Remove the placeholder action from the background clip menu
    cesdk.ui.removeOrderComponent({
      in: 'ly.img.video.clip.menu',
      match: 'ly.img.video.clip.menu.placeholder',
      when: { clipType: 'clip' }
    });

    // Insert a separator after the trim action in the clip menu
    cesdk.ui.insertOrderComponent(
      {
        in: 'ly.img.video.clip.menu',
        after: 'ly.img.video.clip.menu.trim',
        when: { clipType: 'clip' }
      },
      'ly.img.separator'
    );

    // Disable the custom export action conditionally
    cesdk.ui.updateOrderComponent(
      {
        in: 'ly.img.video.clip.menu',
        match: { id: 'ly.img.video.clip.menu.action', key: 'export-clip' },
        when: { clipType: 'clip' }
      },
      { isDisabled: false }
    );
  }
}

export default Example;
