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
            },
            settings: true
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
          panels: {
            settings: true
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
      <div style={cesdkWrapperStyle} key={currentRole + currentScene}>
        <CreativeEditor
          style={cesdkStyle}
          config={config}
          configure={configure}
          onInstanceChange={setCesdk}
        />
      </div>
    </div>
  );
};

const cesdkStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

const cesdkWrapperStyle = {
  position: 'relative',
  minHeight: '640px',
  overflow: 'hidden',
  flexGrow: 1,
  display: 'flex',
  borderRadius: '0.75rem',
  boxShadow:
    '0px 0px 2px rgba(22, 22, 23, 0.25), 0px 4px 6px -2px rgba(22, 22, 23, 0.12), 0px 2px 2.5px -2px rgba(22, 22, 23, 0.12), 0px 1px 1.75px -2px rgba(22, 22, 23, 0.12)'
};

export default CaseComponent;
