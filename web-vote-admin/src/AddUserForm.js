
import React from 'react';
import { LocalePicker } from './locale';

class AddUserForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: "", pass1: "", pass2: "", msg: "", language: props.locale };
        this.addUser = props.addUser;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(newProps, newState) {
        console.log(this.state.language, newProps.locale, newProps, newState)
        if(this.state.language !== newProps.locale) {
            this.setState( {language: newProps.locale} );
        }
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
                    {LocalePicker.getString('name')}:
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                </label><br />
                <label>
                    {LocalePicker.getString('password')}:
                    <input type="password" name="pass1" value={this.state.pass1} onChange={this.handleChange} />
                </label><br />
                <label>
                    {LocalePicker.getString('passAgain')}:
                    <input type="password" name="pass2" value={this.state.pass2} onChange={this.handleChange} />
                </label><br />
                <input type="submit" value={LocalePicker.getString('addUser')} />
                <input type="reset" value={LocalePicker.getString('cancel')} />
                <label>{this.state.msg}</label>
            </form>

        );
    }
}

export default AddUserForm;