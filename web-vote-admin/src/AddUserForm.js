
import React from 'react';

class AddUserForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: "", pass1: "", pass2: "", msg: "" };
        this.addUser = props.addUser;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState( {[event.target.name]: event.target.value} );
        //this.props.onUpdate(event.target.name, event.target.value);
    }

    handleSubmit(event) {
        const myState = this.state;
        event.preventDefault();
        if(myState.pass1 === "") {
            this.setState( {msg: "You must enter a password"});
            return;
        }
        if(myState.pass1 !== myState.pass2) {
            this.setState( {msg: "Passwords do not match"});
            return;
        }
        this.addUser(myState.name, myState.pass1);
        this.setState( {name: "", pass1: "", pass2: ""});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                </label><br />
                <label>
                    Password:
                    <input type="password" name="pass1" value={this.state.pass1} onChange={this.handleChange} />
                </label><br />
                <label>
                    Repeat password:
                    <input type="password" name="pass2" value={this.state.pass2} onChange={this.handleChange} />
                </label><br />
                <input type="submit" value="Add user" />
                <input type="reset" value="Reset form" />
                <label>{this.state.msg}</label>
            </form>

        );
    }
}

export default AddUserForm;