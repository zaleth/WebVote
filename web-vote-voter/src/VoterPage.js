
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
            elections: [],

        }

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
            this.setState( {elections: list} );
        }, (error) => {
            console.log("Error loading elections: " + error);
        });
    }

    render() {

        const eList = this.state.elections;

        return(
            <div className="admin">
                <p>Elections</p>
                <div className="list">
                    <ul>
                        {eList.map( (e) =>
                        <li key={e}><Election id={e} voter={this.state.id}/></li> )}
                    </ul>
                    
                </div>
            </div>
        )
    }
}

export default VoterPage;
