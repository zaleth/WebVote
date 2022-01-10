
import React from "react";
import Parse from './index';
import OfficePage from './OfficePage';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loggedIn: false, name: "", pass: "" };
        this.handleChange = this.handleChange.bind(this);
        this.doLogin = this.doLogin.bind(this);
        this.doLogout = this.doLogout.bind(this);
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

    doLogout() {
        this.setState( {loggedIn: false} );
    }

    render() {
        const myState = this.state;
        return (
            <div>
                <h2>WebVote Office</h2>
                {this.state.loggedIn ? <OfficePage logout={this.doLogout}/> :
                <form onSubmit={this.doLogin}>
                    <label>
                        Name:
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    </label><br />
                    <label>
                        Password:
                        <input type="password" name="pass" value={this.state.pass} onChange={this.handleChange} />
                    </label><br />
                    <input type="submit" value="Log In"/>
                </form>}
            </div>
        )
    }
}

export default LoginPage;
