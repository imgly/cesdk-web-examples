import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import CreativeEditorSDK from './CreativeEditorSDK';

const reactRoot = createRoot(document.getElementById('root'));

reactRoot.render(
  <React.StrictMode>
    <CreativeEditorSDK />
  </React.StrictMode>
);
