import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';


const Parse = require('parse');
Parse.initialize("WebVoteVoter");
Parse.serverURL = 'http://localhost:1339/voter';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


export default Parse;