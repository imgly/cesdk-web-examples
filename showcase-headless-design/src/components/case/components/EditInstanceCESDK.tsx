import React, { memo, useRef } from 'react';
import { CESDKModal } from './CESDKModal';
import CreativeEditorSDK, { CreativeEngine, MimeType } from '@cesdk/cesdk-js';
import { GeneratedAsset } from './GeneratedAssetsSection';

const localDownload = (data: Blob, filename: string) => {
  return new Promise<void>((resolve) => {
    const element = document.createElement('a');
    element.setAttribute('href', window.URL.createObjectURL(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    resolve();
  });
};

interface EditInstanceCESDKProps {
  asset: GeneratedAsset;
  onSave: (assetId: number, sceneString: string, url: string) => void;
  onClose: () => void;
}

export const EditInstanceCESDK = memo(
  ({ asset, onClose, onSave }: EditInstanceCESDKProps) => {
    const engineRef = useRef<CreativeEngine | null>(null);

    return (
      <CESDKModal
        type={asset.type}
        configure={async (instance: CreativeEditorSDK) => {
          instance.engine.editor.setSettingBool('page/title/show', false);
          engineRef.current = instance.engine;
          await instance.engine.scene.loadFromString(
            asset.sceneString as string
          );
        }}
        config={{
          license: process.env.NEXT_PUBLIC_LICENSE,
          callbacks: {
            onExport: (blobs: Blob[]) => {
              localDownload(
                blobs[0],
                `${asset.label.replace(' ', '-').toLowerCase()}.${
                  asset.type === 'image' ? 'png' : 'mp4'
                }`
              );
            },
            onSave: async (sceneString: string) => {
              const engine = engineRef.current;
              await engine?.scene.loadFromString(sceneString)
              if (!engine) return '';
              let blob: Blob;
              if (asset.type === 'image') {
                blob = await engine.block.export(
                  engine.scene.get() as number,
                  MimeType.Png,
                  {
                    targetWidth: asset.width,
                    targetHeight: asset.height
                  }
                );
              } else {
                const page = engine.scene.getCurrentPage() as number;
                blob = await engine.block.exportVideo(page, MimeType.Mp4, () => {}, {
                  targetWidth: asset.width,
                  targetHeight: asset.height
                });
              }
              const url = URL.createObjectURL(blob as Blob);
              onSave(asset.id, sceneString, url);
            },
            onClose: () => {
              onClose();
            },
            onUpload: 'local'
          },
          role: 'Creator',
          ui: {
            elements: {
              navigation: {
                title: `${asset.label}`,
                action: {
                  export: {
                    show: true,
                    format: [asset.type === 'image' ? 'image/png' : 'video/mp4']
                  },
                  save: true,
                  close: true
                }
              }
            }
          }
        }}
      />
    );
  }
);

EditInstanceCESDK.displayName = 'EditInstanceCESDK';

export default EditInstanceCESDK;
