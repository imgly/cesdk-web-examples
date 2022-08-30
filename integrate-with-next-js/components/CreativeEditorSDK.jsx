import React from 'react';

// docs-integrate-nextjs-1
import CreativeEditorSDK from '@cesdk/cesdk-js';
// docs-integrate-nextjs-1

import { useRef, useEffect } from 'react';

// docs-integrate-nextjs-3
const Component = (props = {}) => {
  // docs-integrate-nextjs-4
  const cesdk_container = useRef(null);
  // docs-integrate-nextjs-4
  useEffect(() => {
    if (cesdk_container.current) {
      // Serve assets from IMG.LY CDN or locally
      props.config.baseURL =
        'https://cdn.img.ly/packages/imgly/cesdk-js/1.8.0-alpha.3/assets';

      CreativeEditorSDK.init(cesdk_container.current, props.config).then(
        (instance) => {
          /** do something with the instance of CreativeEditor SDK **/
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
