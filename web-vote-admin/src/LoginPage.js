
import React from "react";
import AdminPage from './AdminPage';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loggedIn: false };
        this.doLogout = this.doLogout.bind(this);
    }

    doLogout() {
        this.setState( {loggedIn: false} );
    }

    render() {
        return (
            <div>
                <h2>WebVote Admin</h2>
                {this.state.loggedIn ? <AdminPage logout={this.doLogout}/> :
                <button name="login" onClick={ () => {this.setState( {loggedIn: true})}}>Log in</button>}
            </div>
        )
    }
}

export default LoginPage;
