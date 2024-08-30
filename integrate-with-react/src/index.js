import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import CreativeEditorSDK from './CreativeEditorSDK'

let config = {
  //baseURL: 'assets/'
}
ReactDOM.render(
  <React.StrictMode>
    <CreativeEditorSDK config={config} />
  </React.StrictMode>,
  document.getElementById('root')
);
