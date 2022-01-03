
import React from "react";
import OfficePage from './OfficePage';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loggedIn: false };
    }

    render() {
        return (
            <div>
                {this.state.loggedIn ? <OfficePage /> :
                <button name="login" onClick={ () => {this.setState( {loggedIn: true})}}>Log in</button>}
            </div>
        )
    }
}

export default LoginPage;
