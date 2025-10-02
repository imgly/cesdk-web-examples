'use client';

import CreativeEditorSDK from '@cesdk/cesdk-js';
import { useEffect, useRef, useState } from 'react';

// configure CreativeEditor SDK
const config = {
  license: 'YOUR_LICENSE_KEY' // Replace with your CE.SDK license key
};

export default function CreativeEditorSDKComponent() {
  // reference to the container HTML element where CESDK will be initialized
  const cesdk_container = useRef(null);
  // define a state variable to keep track of the CESDK instance
  const [cesdk, setCesdk] = useState(null);

  useEffect(() => {
    // prevent initialization if the container element is not available yet
    if (!cesdk_container.current) {
      return;
    }

    // flag to keep track of the component unmount
    let cleanedUp = false;
    // where to store the local CE.SDK instance
    let cesdkInstance;

    // initialize the CreativeEditorSDK instance in the container HTML element
    // using the given config
    CreativeEditorSDK.create(cesdk_container.current, config).then(
      async (cesdk) => {
        // assign the current CD.SDK instance to the local variable
        cesdkInstance = cesdk;

        if (cleanedUp) {
          cesdk.dispose();
          return;
        }

        // do something with the instance of CreativeEditor SDK (e.g., populate
        // the asset library with default / demo asset sources)
        await Promise.all([
          cesdk.addDefaultAssetSources(),
          cesdk.addDemoAssetSources({ sceneMode: 'Design', withUploadAssetSources: true })
        ]);

        // create a new design scene in the editor
        await cesdk.createDesignScene();

        // store the CESDK instance in state
        setCesdk(cesdk);
      }
    );

    // cleanup function to dispose of the CESDK instance when the component unmounts
    const cleanup = () => {
      // clear the local state and dispose of the CS.SDK instance (if it has been assigned)
      cleanedUp = true;
      cesdkInstance?.dispose();
      setCesdk(null);
    };

    // to ensure cleanup runs when the component unmounts
    return cleanup;
  }, [cesdk_container]);

  return (
    // the container HTML element where the CESDK editor will be mounted
    <div
      ref={cesdk_container}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}
