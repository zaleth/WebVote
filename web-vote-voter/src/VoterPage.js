
import React from 'react';
//import PropTypes from 'prop-types';
import Parse from './index';
import Election from './Election';
import { LocalePicker } from './locale';

class VoterPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            edID: props.edID,
            edName: "",
            edDate: "",
            elections: [],
            logout: false,
            language: props.locale
        }
        this.props = props;
        this.doLogout = props.logout;
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.loadElections();
    }

    componentDidUpdate(newProps, newState) {
        //console.log(this.state.language, newProps.locale, newProps, newState)
        if(this.state.language !== newProps.locale) {
            this.setState( {language: newProps.locale} );
        }
    }

    loadElections() {
        //console.log("Loading elections");

        const Elec = Parse.Object.extend('Election');
        const query = new Parse.Query(Elec);
        const list = [];
        query.equalTo('edID', this.state.edID);

        query.find().then( (result) => {
            result.forEach( (e) => {
                // Add election ID to the list
                list.push(e.id);
            });

            // Get the name and date of this election day
            const EDay = Parse.Object.extend('ElectionDay');
            const iQuery = new Parse.Query(EDay);
            iQuery.get(this.state.edID).then( (res) => {
                //console.log("Found EDay", res.get('edName'), res.get('edDate'))
                this.setState( {edName: res.get('edName'), edDate: res.get('edDate')});
            }, (error) => {
                console.log("Error getting election day: " + error);
            });
            this.setState( {elections: list} );
        }, (error) => {
            console.log("Error loading elections: " + error);
        });
    }

    logout() {
        this.doLogout();
        this.props.history.push('/')
    }

    render() {

        const myState = this.state;
        const eList = myState.elections;
        const myDateStr = new Date(myState.edDate).toLocaleDateString(LocalePicker.getString('locale'),
        {weekday: 'short', month: 'short', year: 'numeric', day: 'numeric'});

        return(

            <div className="admin">
                <p>{LocalePicker.getString('electionsFor')} {this.state.edName} ({myDateStr})</p>
                <div className="list">
                    <ul>
                        {eList.map( (e) =>
                        <li key={e}><Election id={e} voter={this.state.id} locale={this.state.language}/></li> )}
                    </ul>
                </div>
                <button name="logout" onClick={this.logout}>{LocalePicker.getString('logout')}</button>
            </div>
        )
    }
}

export default VoterPage;
