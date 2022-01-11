
import './App.css';
import React from 'react';

import LoginPage from './LoginPage';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <LoginPage user={this.props.user} pass={this.props.pass}/>
        </header>
      </div>
    );
  }
}

export default App;
