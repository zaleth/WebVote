import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const Parse = require('parse');
Parse.initialize("WebVoteOffice");
Parse.serverURL = 'http://localhost:1338/office';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


export default Parse;