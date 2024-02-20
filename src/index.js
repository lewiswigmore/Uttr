import React from 'react';
import ReactDOM from 'react-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <FluentProvider theme={webLightTheme}>
    <App />
  </FluentProvider>,
  document.getElementById('root'),
);

reportWebVitals(console.log);
