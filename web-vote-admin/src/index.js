import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const Parse = require('parse');
Parse.initialize('VavejCBuFbWSwByr9TY4PpKjheKBbH2EEMxaT9sQ', '4lY78FyWcoy9ctT6JCWqakt9BtXxQAzGO2zqJz23');
Parse.serverURL = 'https://parseapi.back4app.com/';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

export default Parse;