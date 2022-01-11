import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import settings from './settings';

const Parse = require('parse');
Parse.initialize(settings.APP_ID, settings.JS_KEY);
Parse.serverURL = settings.PARSE_URL;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


export default Parse;