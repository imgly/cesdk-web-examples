import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import CreativeEditorSDK from './CreativeEditorSDK';

let config = {
  // Enable local uploads in Asset Library
  callbacks: { onUpload: 'local' }
};

ReactDOM.render(
  <React.StrictMode>
    <CreativeEditorSDK config={config} />
  </React.StrictMode>,
  document.getElementById('root')
);
