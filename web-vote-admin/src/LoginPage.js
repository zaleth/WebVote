
import React from "react";
import Parse from './index';
import AdminPage from './AdminPage';
import { LocalePicker } from "./locale";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { user: props.user, pass: props.pass, loggedIn: false, language: props.locale };
        this.doLogin = this.doLogin.bind(this);
        this.doLogout = this.doLogout.bind(this);
    }

    async doLogin() {
        console.log(this.state.user, this.state.pass);
        const user = await Parse.User.logIn(this.state.user, this.state.pass);
        if(user.authenticated())
            this.setState( {loggedIn: true} );
    }

    doLogout() {
        Parse.User.logOut();
        this.setState( {loggedIn: false} );
    }

    render() {
        return (
            <div>
                <h2>{LocalePicker.getString('webVoteAdmin')}</h2>
                {this.state.loggedIn ? <AdminPage logout={this.doLogout} locale={this.state.language}/> :
                <button name="login" onClick={this.doLogin}>{LocalePicker.getString('login')}</button>}
            </div>
        )
    }
}

export default LoginPage;
