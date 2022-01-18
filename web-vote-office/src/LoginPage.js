
import React from "react";
import Parse from './index';
import OfficePage from './OfficePage';
import { LocalePicker } from "./locale";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loggedIn: false, name: "", pass: "", language: props.locale };
        this.handleChange = this.handleChange.bind(this);
        this.doLogin = this.doLogin.bind(this);
        this.doLogout = this.doLogout.bind(this);
    }

    componentDidUpdate(newProps, newState) {
        //console.log(this.state.language, newProps.locale, newProps, newState)
        if(this.state.language !== newProps.locale) {
            this.setState( {language: newProps.locale} );
        }
    }

    handleChange(event) {
        this.setState( {[event.target.name]: event.target.value} );
        //this.props.onUpdate(event.target.name, event.target.value);
    }

    async doLogin(event) {
        event.preventDefault();
        const myState = this.state;
        const user = await Parse.User.logIn(myState.name, myState.pass);
        this.setState( {loggedIn: user.authenticated()});
    }

    async doLogout() {
        await Parse.User.logOut();
        this.setState( {loggedIn: false} );
    }

    render() {
        const myState = this.state;
        return (
            <div>
                <h2>{LocalePicker.getString('webVoteOffice')}</h2>
                {this.state.loggedIn ? <OfficePage logout={this.doLogout} locale={myState.language}/> :
                <form onSubmit={this.doLogin}>
                    <label>
                        {LocalePicker.getString('name')}:
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        {LocalePicker.getString('password')}:
                        <input type="password" name="pass" value={this.state.pass} onChange={this.handleChange} />
                    </label><br />
                    <input type="submit" value={LocalePicker.getString('login')}/>
                </form>}
            </div>
        )
    }
}

export default LoginPage;
