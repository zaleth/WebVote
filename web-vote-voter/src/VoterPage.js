
import React from 'react';
//import PropTypes from 'prop-types';
import Parse from './index';
import Election from './Election';


class VoterPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            edID: props.edID,
            edName: "",
            elections: [],
            logout: false,
        }
        this.props = props;
        this.doLogout = props.logout;
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.loadElections();
    }

    loadElections() {
        console.log("Loading elections");

        const Elec = Parse.Object.extend('Election');
        const query = new Parse.Query(Elec);
        const list = [];
        query.equalTo('edID', this.state.edID);

        query.find().then( (result) => {
            result.forEach( (e) => {
                list.push(e.id);
            });
            const EDay = Parse.Object.extend('ElectionDay');
            const iQuery = new Parse.Query(EDay);
            iQuery.get(this.state.edID).then( (res) => {
                console.log("Found EDay " + res.get('edName'))
                this.setState( {edName: res.get('edName')});
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

        const eList = this.state.elections;

        return(

            <div className="admin">
                <p>Elections for {this.state.edName}</p>
                <div className="list">
                    <ul>
                        {eList.map( (e) =>
                        <li key={e}><Election id={e} voter={this.state.id}/></li> )}
                    </ul>
                </div>
                <button name="logout" onClick={this.logout}>Log out</button>
            </div>
        )
    }
}

export default VoterPage;
