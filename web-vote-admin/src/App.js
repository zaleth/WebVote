
import './App.css';
import React from 'react';
import LoginPage from './LoginPage';
import {LocalePicker} from './locale';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { language: props.locale };
    this.onChangeLocale = this.onChangeLocale.bind(this);
  }

  componentDidUpdate(newProps, newState) {
    console.log(this.state.language, newProps.locale, newProps, newState)
    if(this.state.language !== newProps.locale) {
        this.setState( {language: newProps.locale} );
    }
}

onChangeLocale(lang) {
    this.setState( {language: lang} );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <LocalePicker locale={this.state.language} onChangeLocale={this.onChangeLocale}/>
          <LoginPage user={this.props.user} pass={this.props.pass} locale={this.state.language}/>
        </header>
      </div>
    );
  }
}

export default App;
