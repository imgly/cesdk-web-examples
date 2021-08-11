import React from 'react';
import './index.css';

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { useRef, useEffect } from 'react';

const Component = (props = {}) => {
  const cesdk_container = useRef(null);
  useEffect(() => {
    if (cesdk_container.current) {
      CreativeEditorSDK.init(cesdk_container.current, props.config).then(
        (instance) => {
          /** do something with the instance of CreativeEditor SDK **/
        }
      );
    }
  }, [props]);

  return (
    <div
      ref={cesdk_container}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
};

export default Component;
