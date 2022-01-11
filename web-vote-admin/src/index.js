import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const Parse = require('parse');
Parse.initialize("WebVote", "WebVoteKey", "WebVoteMasterKey");
Parse.serverURL = 'http://localhost:1337/parse';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export default Parse;