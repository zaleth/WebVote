
import React from 'react';
//import PropTypes from 'prop-types';
import Parse from './index';
import ElectionDay from './ElectionDay';
import { LocalePicker } from './locale';

class OfficePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eDayIds: [],
            voterIDToShow: "",
            language: props.locale,
        }
        this.props = props;
        this.doLogout = props.logout;
        this.logout = this.logout.bind(this);
        this.setVoterID = this.setVoterID.bind(this);
        this.clearVoterID = this.clearVoterID.bind(this);
    }

    componentDidUpdate(newProps, newState) {
        //console.log(this.state.language, newProps.locale, newProps, newState)
        if(this.state.language !== newProps.locale) {
            this.setState( {language: newProps.locale} );
        }
    }

    setVoterID(id) {
        this.setState({voterIDToShow: id});
    }

    clearVoterID() {
        this.setState({voterIDToShow: ""});
    }

    componentDidMount() {
        this.loadElectionDays();
    }

    loadElectionDays() {
        //console.log("Loading election days");

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

    logout() {
        this.doLogout();
        this.props.history.push('/')
    }

    render() {

        const eDayList = this.state.eDayIds;
        const voterID = this.state.voterIDToShow;

        return(
            <div className="office">
                <p>{LocalePicker.getString('loggedInAs')} {Parse.User.current().getUsername()}</p>
                <p>{LocalePicker.getString('electionDays')}</p>
                <div className="list">
                    <ul>
                        {eDayList.map( (e) =>
                        <li key={e}><ElectionDay id={e} showID={this.setVoterID} locale={this.state.language}/>
                        </li> )}
                    </ul>
                </div>
                <div className="voterID">
                    {voterID !== "" ? 
                    <p><label>{LocalePicker.getString('voterID')}: {voterID}</label>
                    <button onClick={this.clearVoterID}>{LocalePicker.getString('clear')}</button></p>
                    : "" }
                </div>
                <button name="logout" onClick={this.logout}>{LocalePicker.getString('logout')}</button>
            </div>
        )
    }
}

export default OfficePage;
