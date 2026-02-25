'use client';

import SegmentedControl from '@/components/ui/SegmentedControl/SegmentedControl';
import CreativeEditorSDK from '@cesdk/cesdk-js';
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
import { DesignEditorConfig } from './lib/design-editor/plugin';
import { useEffect, useRef, useState } from 'react';
import { addPremiumTemplatesAssetSource } from './lib/PremiumTemplateUtilities';

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
                show: true,
                format: ['image/png', 'application/pdf']
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
                show: true,
                format: ['image/png', 'application/pdf']
              }
            }
          }
        }
      }
    }
  }
];

const CaseComponent = () => {
  const cesdkContainer = useRef(null);
  const cesdkRef = useRef(null);
  const [currentRole, setCurrentRole] = useState('Creator');
  const [currentScene, setCurrentScene] = useState(null);

  useEffect(() => {
    let disposed = false;
    let _cesdk;
    const config = {
      ...ROLE_OPTIONS.find(({ name }) => name === currentRole).cesdkConfig,
      license: process.env.NEXT_PUBLIC_LICENSE
    };
    if (cesdkContainer.current) {
      CreativeEditorSDK.create(cesdkContainer.current, config).then(
        async (instance) => {
          if (disposed) {
            instance.dispose();
            return;
          }
          _cesdk = instance;
          // Add the design editor configuration plugin first
          await instance.addPlugin(new DesignEditorConfig());

          // Add default asset sources via plugins
          await instance.addPlugin(new ColorPaletteAssetSource());
          await instance.addPlugin(new TypefaceAssetSource());
          await instance.addPlugin(new TextAssetSource());
          await instance.addPlugin(new TextComponentAssetSource());
          await instance.addPlugin(new StickerAssetSource());
          await instance.addPlugin(new VectorShapeAssetSource());
          await instance.addPlugin(new FiltersAssetSource());
          await instance.addPlugin(new EffectsAssetSource());
          await instance.addPlugin(new BlurAssetSource());
          await instance.addPlugin(new CropPresetsAssetSource());
          await instance.addPlugin(new PagePresetsAssetSource());
          await instance.addPlugin(new UploadAssetSources());
          // Add demo asset sources
          await instance.addPlugin(
            new DemoAssetSources({
              include: ['ly.img.image.*']
            })
          );

          await addPremiumTemplatesAssetSource(instance);

          cesdkRef.current = instance;
          if (currentScene) {
            await instance.loadFromString(currentScene);
          } else {
            await instance.loadFromURL(
              `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/placeholders/example.scene`
            );
          }
        }
      );
    }
    return () => {
      disposed = true;
      _cesdk?.dispose();
      cesdkRef.current = null;
    };
  }, [currentRole, currentScene, cesdkContainer]);

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
          onChange={async (value) => {
            const currentScene =
              await cesdkRef.current.engine.scene.saveToString();
            setCurrentScene(currentScene);
            setCurrentRole(value);
          }}
          size="md"
        />
      </div>
      <div className="cesdkWrapperStyle" key={currentRole + currentScene}>
        <div ref={cesdkContainer} className="cesdkStyle"></div>
      </div>
    </div>
  );
};

export default CaseComponent;
