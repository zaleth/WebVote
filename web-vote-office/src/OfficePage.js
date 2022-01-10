
import React from 'react';
//import PropTypes from 'prop-types';
import Parse from './index';
import ElectionDay from './ElectionDay';


class OfficePage extends React.Component {

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

    async genVoterID(id) {
        const res = await Parse.Cloud.run('genVoterId', { edId: id });
            this.setState({voterIDToShow: res});
            console.log("Added voter ID " + res + " to election day " + id);
    }

    clearVoterID() {
        this.setState({voterIDToShow: ""});
    }

    eraseVoters(id) {
        const Voter = Parse.Object.extend('Voter');
        const query = new Parse.Query(Voter);
        query.equalTo('edID', id);
        query.limit(1000);
        query.find().then( (res) => {
            res.forEach( (e) => {
            const Vote = Parse.Object.extend('Vote');
            const iQuery = new Parse.Query(Vote);
            iQuery.equalTo('vID', e.id);
            iQuery.find().then( (ret) => {
                ret.forEach( (v) => {
                v.destroy();
            });
            }, (error) => {});
            console.log("Voter destroyed");
            e.destroy();
            });
        }, (error) => {});
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
                <p>Logged in as {Parse.User.current().getUsername()}</p>
                <div className="list">
                    <ul>
                        {eDayList.map( (e) =>
                        <li key={e}><ElectionDay id={e}/>
                        <button onClick={() => this.genVoterID(e)}>Add new voter</button>
                        <button onClick={() => this.eraseVoters(e)}>Erase all voters</button>
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

export default OfficePage;
