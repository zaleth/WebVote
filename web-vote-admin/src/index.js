import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import settings from './settings';

const Parse = require('parse');

Parse.initialize(settings.APP_ID, settings.JS_KEY);
Parse.serverURL = settings.PARSE_URL;

const navLang = navigator.language || navigator.userLanguage || "en";
const defLang = navLang.substring(0, 2);
//console.log(defLang);

ReactDOM.render(
  <React.StrictMode>
    <App user={settings.ADMIN_USER} pass={settings.ADMIN_PASS} locale={defLang}/>
  </React.StrictMode>,
  document.getElementById('root')
);

export default Parse;