
import React from "react";
import OfficePage from './OfficePage';

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
                <h2>WebVote Office</h2>
                {this.state.loggedIn ? <OfficePage logout={this.doLogout}/> :
                <button name="login" onClick={ () => {this.setState( {loggedIn: true})}}>Log in</button>}
            </div>
        )
    }
}

export default LoginPage;
