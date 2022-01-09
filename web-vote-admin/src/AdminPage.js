
import React from 'react';
//import PropTypes from 'prop-types';
import Parse from './index';
import ElectionDay from './ElectionDay';
import AddElectionDayForm from './AddElectionDayForm';

class AdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eDayIds: [],
            showAddElectionForm: false,
        }
        this.eDayInfo = { name: "", date: "" };
        this.addElection = this.addElection.bind(this);
        this.updateEDay = this.updateEDay.bind(this);
        this.props = props;
        this.doLogout = props.logout;
        this.logout = this.logout.bind(this);
        console.log("Default " + this.eDayInfo.name + "@" + this.eDayInfo.date);
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

    addElection(event) {
        const e = Parse.Cloud.run('addElectionDay', { name: this.eDayInfo.name, date: this.eDayInfo.date});
        const list = this.state.eDayIds;
        list.push(e.get('objectId'));
        this.setState( {eDayIds: list} );
        console.log("Saved new election " + e.get('objectId') + ": " + e.get('edName') + "@" + e.get('edDate'));
        this.setState( {showAddElectionForm: false} );
        event.preventDefault();
    }

    updateEDay(field, value) {
        if(field === "name") {
            this.eDayInfo = { name: value, date: this.eDayInfo.date};
        } else if(field === "date") {
            this.eDayInfo = { name: this.eDayInfo.name, date: value};
        }
        console.log(field + " is now " + value);
    }

    deleteElectionDay(id) {
        // delete from database before we update the list in state
        Parse.Cloud.run('deleteElectionDay', { id: id});
        const list = [];
        this.state.eDayIds.forEach( (e) => {
            if(e !== id)
                list.push(e);
        });
        this.setState( {eDayIds: list} );
    }

    wipeDB() {
        console.log("Clering database");
        Parse.Cloud.run('wipeDB');
        console.log("Done");
    }

    logout() {
        this.doLogout();
        this.props.history.push('/')
    }

    render() {

        const eDayList = this.state.eDayIds;
        if(eDayList.length < 1) {
            //this.loadElectionDays();
        }

        //console.log(eDayList);

        return(
            <div className="admin">
                <p>Election days</p>
                <div className="list">
                    <ul>
                        {eDayList.map( (e) =>
                        <li key={e}><ElectionDay id={e} delete={() => this.deleteElectionDay(e)}/></li> )}
                    </ul>
                    {this.state.showAddElectionForm
                    ? <AddElectionDayForm onSubmit={this.addElection} onUpdate={this.updateEDay}
                        onCancel={() => { this.setState({showAddElectionForm: false})}}/>
                    : <button name="addElection" onClick={() => 
                        { this.setState({showAddElectionForm: true})}}>Add election day</button>}
                </div>
                <button name="logout" onClick={this.logout}>Log out</button>
                <div className="debug">
                    <button name="wipeDB" onClick={this.wipeDB}>Wipe the database</button>
                </div>
            </div>
        )
    }
}

export default AdminPage;
