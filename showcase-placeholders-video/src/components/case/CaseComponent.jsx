'use client';

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
import { VideoEditorConfig } from './lib/video-editor/plugin';

import CreativeEditor, {
  useConfig,
  useConfigure,
  useCreativeEditor
} from './lib/CreativeEditor';

import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import { useCallback, useState } from 'react';

const ROLE_OPTIONS = [
  {
    name: 'Creator',
    cesdkConfig: {
      theme: 'dark',
      role: 'Creator',
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          view: 'advanced',
          panels: {
            inspector: {
              show: true,
              position: 'right'
            }
          },
          dock: {
            iconSize: 'normal',
            hideLabels: true
          },
          navigation: {
            action: {
              export: {
                show: true
              }
            }
          }
        }
      }
    }
  },
  {
    name: 'Adopter',
    cesdkConfig: {
      theme: 'light',
      role: 'Adopter',
      callbacks: {
        onExport: 'download',
        onUpload: 'local'
      },
      ui: {
        elements: {
          navigation: {
            action: {
              export: {
                show: true
              }
            }
          }
        }
      }
    }
  }
];

const CaseComponent = () => {
  const [cesdk, setCesdk] = useCreativeEditor();
  const [currentRole, setCurrentRole] = useState('Creator');
  const [currentScene, setCurrentScene] = useState(null);

  const config = useConfig(
    () => ({
      ...ROLE_OPTIONS.find(({ name }) => name === currentRole).cesdkConfig,
      license: process.env.NEXT_PUBLIC_LICENSE
    }),
    [currentRole]
  );

  const configure = useConfigure(
    async (instance) => {
      // Add the video editor configuration plugin first
      await instance.addPlugin(new VideoEditorConfig());

      // Asset Source Plugins (replaces addDefaultAssetSources)
      await instance.addPlugin(new ColorPaletteAssetSource());
      await instance.addPlugin(new TypefaceAssetSource());
      await instance.addPlugin(new TextAssetSource());
      await instance.addPlugin(new TextComponentAssetSource());
      await instance.addPlugin(new VectorShapeAssetSource());
      await instance.addPlugin(new StickerAssetSource());
      await instance.addPlugin(new EffectsAssetSource());
      await instance.addPlugin(new FiltersAssetSource());
      await instance.addPlugin(new BlurAssetSource());
      await instance.addPlugin(new PagePresetsAssetSource());
      await instance.addPlugin(new CropPresetsAssetSource());
      await instance.addPlugin(
        new UploadAssetSources({
          include: [
            'ly.img.image.upload',
            'ly.img.video.upload',
            'ly.img.audio.upload'
          ]
        })
      );

      // Demo assets (replaces addDemoAssetSources)
      await instance.addPlugin(
        new DemoAssetSources({
          include: [
            'ly.img.templates.video.*',
            'ly.img.image.*',
            'ly.img.video.*',
            'ly.img.audio.*'
          ]
        })
      );

      instance.feature.enable('ly.img.placeholder*');

      if (currentScene) {
        await instance.loadFromString(currentScene);
      } else {
        await instance.loadFromURL(
          `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/placeholders-video/example.scene`
        );
      }
      // Zoom auto-fit to page
      instance.actions.run('zoom.toPage', { autoFit: true });
    },
    [currentRole, currentScene]
  );

  const onRoleChange = useCallback(
    async (value) => {
      const currentScene = await cesdk.engine.scene.saveToString();
      setCurrentScene(currentScene);
      setCurrentRole(value);
    },
    [cesdk]
  );

  return (
    <div className="gap-sm flex flex-grow flex-col">
      <div className="flex  w-full flex-col items-center">
        <SegmentedControl
          options={ROLE_OPTIONS.map(({ name }) => ({
            value: name,
            label: name
          }))}
          value={currentRole}
          name="currentRole"
          onChange={onRoleChange}
          size="md"
        />
      </div>
      <div
        className="cesdkWrapperStyle"
        key={currentRole + currentScene}
        style={{ minHeight: '820px' }}
      >
        <CreativeEditor
          className="cesdkStyle"
          config={config}
          configure={configure}
          onInstanceChange={setCesdk}
        />
      </div>
    </div>
  );
};

export default CaseComponent;
