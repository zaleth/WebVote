
import React from 'react';
//import PropTypes from 'prop-types';
import Parse from './index';
import ElectionDay from './ElectionDay';


class AdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eDayIds: [],
            voterIDToShow: "",
        }
        this.props = props;
        this.doLogout = props.logout;
        this.logout = this.logout.bind(this);
        this.genVoterID = this.genVoterID.bind(this);
        this.clearVoterID = this.clearVoterID.bind(this);
    }

    componentDidMount() {
        this.loadElectionDays();
    }

    loadElectionDays() {
        console.log("Loading election days");

        const EDay = Parse.Object.extend('ElectionDay');
        const query = new Parse.Query(EDay);
        const list = [];

        query.find().then( (result) => {
            result.forEach( (e) => {
                list.push(e.id);
            });
            this.setState( {eDayIds: list} );
        }, (error) => {
            console.log("Error loading election days: " + error);
        });
    }

    genVoterID(id) {
        const Voter = Parse.Object.extend('Voter');
        const v = new Voter();
        v.set('edID', id);
        v.save().then( (res) => {
            this.setState({voterIDToShow: res.id});
            console.log("Added voter ID " + res.id + " to election day " + id);
        }, (error) => {
            console.log("Error creating new voter: " + error);
        });
    }

    clearVoterID() {
        this.setState({voterIDToShow: ""});
    }

    logout() {
        this.doLogout();
        this.props.history.push('/')
    }

    render() {

        const eDayList = this.state.eDayIds;
        const voterID = this.state.voterIDToShow;

        return(
            <div className="office">
                <p>Election days</p>
                <div className="list">
                    <ul>
                        {eDayList.map( (e) =>
                        <li key={e}><ElectionDay id={e}/>
                        <button onClick={() => this.genVoterID(e)}>Add new voter</button>
                        </li> )}
                    </ul>
                </div>
                <div className="voterID">
                    {voterID !== "" ? 
                    <p><label>Voter ID: {voterID}</label>
                    <button onClick={this.clearVoterID}>Clear ID</button></p>
                    : "" }
                </div>
                <button name="logout" onClick={this.logout}>Log out</button>
            </div>
        )
    }
}

export default AdminPage;
