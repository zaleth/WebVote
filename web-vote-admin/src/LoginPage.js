
import React from "react";
import Parse from './index';
import AdminPage from './AdminPage';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { user: props.user, pass: props.pass, loggedIn: false };
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
                <h2>WebVote Admin</h2>
                {this.state.loggedIn ? <AdminPage logout={this.doLogout}/> :
                <button name="login" onClick={this.doLogin}>Log in</button>}
            </div>
        )
    }
}

export default LoginPage;
