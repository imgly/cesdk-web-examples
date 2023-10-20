import React from 'react';
import './index.css';

// docs-integrate-react-1
import CreativeEditorSDK from '@cesdk/cesdk-js';
// docs-integrate-react-1

import { useRef, useEffect } from 'react';

// docs-integrate-react-3
const Component = (props = {}) => {
  // docs-integrate-react-4
  const cesdk_container = useRef(null);
  // docs-integrate-react-4
  useEffect(() => {
    if (cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, props.config).then(
        (instance) => {
          /** do something with the instance of CreativeEditor SDK **/
        }
      );
    }
  }, [props, cesdk_container]);

  return (
    // docs-integrate-react-2
    <div
      ref={cesdk_container}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
    // docs-integrate-react-2
  );
};
// docs-integrate-react-3

export default Component;
