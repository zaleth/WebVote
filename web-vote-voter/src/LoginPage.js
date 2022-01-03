
import React from "react";
import VoterPage from './VoterPage';
import Parse from './index';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loggedIn: false, voterID: "", edID: "", msg: "" };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log(event.target.name + " is now " + event.target.value);
        this.setState( {[event.target.name]: event.target.value} );
        //this.props.onUpdate(event.target.name, event.target.value);
    }

    handleSubmit(event) {
        const VoterID = Parse.Object.extend("Voter");
        const query = new Parse.Query(VoterID);
        query.get(this.state.voterID).then( (res) => {
            console.log(res);
            this.setState({loggedIn: true, edID: res.get('edID')});
        }, (error) => {
            console.log(error);
            //this.setState({msg: error});
        });
        event.preventDefault();
    }

    render() {
        return (
            <div>
                {this.state.loggedIn ? <VoterPage id={this.state.voterID} edID={this.state.edID}/> :
                <form onSubmit={this.handleSubmit}>
                    <label>Voter ID</label>
                    <input type="text" name="voterID" value={this.state.voterID} onChange={this.handleChange} /> 
                    <input type="submit" value="Log in" />
                    
                </form>
                }
                <div>{this.state.loggedIn ? "" : this.state.msg}</div>
            </div>
        )
    }
}

export default LoginPage;
