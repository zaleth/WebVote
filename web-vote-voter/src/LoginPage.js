
import React from "react";
import VoterPage from './VoterPage';
import Parse from './index';
import { LocalePicker } from "./locale";
import settings from "./settings";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loggedIn: false, voterID: "", edID: "", msg: "", language: props.locale };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.doLogout = this.doLogout.bind(this);
    }

    componentDidUpdate(newProps, newState) {
        //console.log(this.state.language, newProps.locale, newProps, newState)
        if(this.state.language !== newProps.locale) {
            this.setState( {language: newProps.locale} );
        }
    }

    async doLogout() {
        if(Parse.User.current().authenticated()) {
            await Parse.User.logOut();
        }
        this.setState( {loggedIn: false} );
    }

    handleChange(event) {
        //console.log(event.target.name + " is now " + event.target.value);
        this.setState( {[event.target.name]: event.target.value} );
        //this.props.onUpdate(event.target.name, event.target.value);
    }

    async handleSubmit(event) {
        const VoterID = Parse.Object.extend("Voter");
        const query = new Parse.Query(VoterID);
        query.get(this.state.voterID).then( async (res) => {
            //console.log(res);
            const user = await Parse.User.logIn(settings.VOTER_USER, settings.VOTER_PASS);
            this.setState({loggedIn: user.authenticated(), edID: res.get('edID')});
        }, (error) => {
            console.log(error);
            //this.setState({msg: error});
        });
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <h2>{LocalePicker.getString('webVoteVoter')}</h2>
                {this.state.loggedIn ? <VoterPage id={this.state.voterID} edID={this.state.edID}
                logout={this.doLogout} locale={this.state.language}/> :
                <form onSubmit={this.handleSubmit}>
                    <label>{LocalePicker.getString('voterID')}</label>
                    <input type="text" name="voterID" value={this.state.voterID} onChange={this.handleChange} /> 
                    <input type="submit" value={LocalePicker.getString('login')} />
                    
                </form>
                }
                <div>{this.state.loggedIn ? "" : this.state.msg}</div>
            </div>
        )
    }
}

export default LoginPage;
