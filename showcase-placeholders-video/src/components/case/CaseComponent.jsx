'use client';

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
      await instance.addDefaultAssetSources();
      await instance.addDemoAssetSources({ sceneMode: 'Video' });
      if (currentScene) {
        await instance.loadFromString(currentScene);
      } else {
        await instance.loadFromURL(
          `${process.env.NEXT_PUBLIC_URL_HOSTNAME}${process.env.NEXT_PUBLIC_URL}/cases/placeholders-video/example.scene`
        );
      }
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
