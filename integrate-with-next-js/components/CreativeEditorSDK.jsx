'use client';
// docs-integrate-nextjs-1
import CreativeEditorSDK from '@cesdk/cesdk-js';
// docs-integrate-nextjs-1

import { useEffect, useRef } from 'react';

// docs-integrate-nextjs-3
const Component = (props = {}) => {
  // docs-integrate-nextjs-4
  const cesdk_container = useRef(null);
  // docs-integrate-nextjs-4
  useEffect(() => {
    if (cesdk_container.current) {
      props.config.license = process.env.NEXT_PUBLIC_LICENSE;
      // Serve assets from IMG.LY CDN or locally
      props.config.baseURL =
        'https://cdn.img.ly/packages/imgly/cesdk-js/1.22.0/assets';
      // Enable local uploads in Asset Library
      props.config.callbacks = { onUpload: 'local' };

      CreativeEditorSDK.create(cesdk_container.current, props.config).then(
        async (instance) => {
          // Do something with the instance of CreativeEditor SDK, for example:
          // Populate the asset library with default / demo asset sources.
          instance.addDefaultAssetSources();
          instance.addDemoAssetSources({ sceneMode: 'Design' });
          await instance.createDesignScene();
        }
      );
    }
  }, [props]);

  return (
    // docs-integrate-nextjs-2
    <div
      ref={cesdk_container}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
    // docs-integrate-nextjs-2
  );
};
// docs-integrate-nextjs-3

export default Component;
