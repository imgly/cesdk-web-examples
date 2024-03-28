import { CompleteAssetResult } from '@cesdk/engine';
import { useCallback } from 'react';
import { useEngine } from './EngineContext';

interface ImageUploadOptions {
  onUpload: (asset: CompleteAssetResult) => Promise<void>;
  sourceId?: string;
  multiple?: boolean;
}

export function useImageUpload({
  onUpload,
  sourceId = 'ly.img.image.upload',
  multiple = true
}: ImageUploadOptions) {
  const { engine } = useEngine();

  const triggerFileUpload = useCallback(async () => {
    const supportedMimeTypes = engine.asset.getSupportedMimeTypes(sourceId);
    const files = await uploadFile({
      multiple,
      supportedMimeTypes
    });
    const uploadedAssets = await Promise.all(files.map(fileUploadToAsset));
    uploadedAssets.forEach((asset) =>
      engine.asset.addAssetToSource(sourceId, asset)
    );
    Promise.allSettled(
      uploadedAssets.map(
        async (asset) => await onUpload({ ...asset, context: { sourceId } })
      )
    );
  }, [engine, onUpload, multiple]);
  return {
    triggerFileUpload
  };
}
/**
 * Returns image dimensions for specified URL.
 */
async function getImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({
        width: img.width,
        height: img.height
      });
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}

async function fileUploadToAsset(file: File) {
  const url = window.URL.createObjectURL(file);
  const { width, height } = await getImageDimensions(url);

  return {
    id: url,
    meta: {
      uri: url,
      thumbUri: url,
      kind: 'image',
      fillType: '//ly.img.ubq/fill/image',
      width,
      height
    }
  };
}

type UploadOptions = {
  supportedMimeTypes: string[];
  multiple?: boolean;
  type?: 'string' | 'file';
};

const uploadFile = (() => {
  const element: HTMLInputElement = document.createElement('input');
  element.setAttribute('type', 'file');
  element.style.display = 'none';
  document.body.appendChild(element);
  return ({ supportedMimeTypes, multiple = true }: UploadOptions) => {
    const accept = supportedMimeTypes.join(',');

    return new Promise<File[]>((resolve, reject) => {
      if (accept) {
        element.setAttribute('accept', accept);
      }
      if (multiple) {
        element.setAttribute('multiple', String(multiple));
      }
      element.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files) {
          const files = Object.values(target.files);
          resolve(files);
        } else {
          reject(new Error('No files selected'));
        }
        element.onchange = null;
        element.value = '';
      };
      element.click();
    });
  };
})();
