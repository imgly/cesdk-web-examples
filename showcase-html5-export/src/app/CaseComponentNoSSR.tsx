'use client';

import dynamic from 'next/dynamic';

export const CaseComponentNoSSR = dynamic(
  () => import('../components/case/CaseComponent'),
  {
    ssr: false
  }
);
