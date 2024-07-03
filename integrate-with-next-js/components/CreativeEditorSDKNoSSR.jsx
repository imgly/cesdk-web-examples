'use client';

import dynamic from 'next/dynamic';

const CreativeEditorSDKWithNoSSR = dynamic(
  () => import('./CreativeEditorSDK'),
  {
    ssr: false
  }
);

export default CreativeEditorSDKWithNoSSR;
