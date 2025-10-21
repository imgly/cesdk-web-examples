'use client';

import dynamic from 'next/dynamic';

const CustomEditorNoSSR = dynamic(() => import('./CustomEditor'), {
  ssr: false
});

export default CustomEditorNoSSR;
