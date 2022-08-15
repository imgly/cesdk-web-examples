import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Codesandbox does not properly parse @imports so we import them here
import './styles/root.css';
import './styles/fonts.css';
import './styles/typography.css';
import './styles/css-reset.css';
import './styles/variables.css';
import './styles/ci-v11-variables.css';
import './styles/util.css';
import './styles/forms.css';
import './styles/button.css';
import './styles/caseHeader.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
