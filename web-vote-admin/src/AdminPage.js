
import React from 'react';
//import PropTypes from 'prop-types';
import Parse from './index';
import ElectionDay from './ElectionDay';
import AddElectionDayForm from './AddElectionDayForm';
import AddUserForm from './AddUserForm';
import UserAdmin from './UserAdmin';
import { LocalePicker } from './locale';

class AdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eDayIds: [],
            showAddElectionForm: false,
            allUsers: [],
            language: props.locale
        }
        this.eDayInfo = { name: "", date: "" };
        this.addElection = this.addElection.bind(this);
        this.updateEDay = this.updateEDay.bind(this);
        this.props = props;
        this.doLogout = props.logout;
        this.logout = this.logout.bind(this);
        this.addUser = this.addUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        console.log("Default " + this.eDayInfo.name + "@" + this.eDayInfo.date);
    }

    componentDidMount() {
        this.loadElectionDays();
        this.loadAllUsers();
    }

    componentDidUpdate(newProps, newState) {
        console.log(this.state.language, newProps.locale, newProps, newState)
        if(this.state.language !== newProps.locale) {
            this.setState( {language: newProps.locale} );
        }
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

    async loadAllUsers() {
        const res = await Parse.Cloud.run('getAllUsers');
        //console.log(res);
            const list = [];
            res.forEach( (u) => {
                console.log(u.id, u.get('username'));
                list.push( {id: u.id, name: u.get('username')});
            });
            this.setState( {allUsers: list});
    }

    async addUser(name, pass) {
        console.log("addUser", name, pass);
        if(!name || name === "")
            return;

        if(!pass || pass === "")
            return;

        const res = await Parse.Cloud.run('addUser', {name: name, pass: pass});
            const list = this.state.allUsers;
            console.log(res);
            list.push( {id: res.id, name: name});
            this.setState( {allUsers: list});
    }

    async deleteUser(id) {
        await Parse.Cloud.run('deleteUser', {id: id});
        this.loadAllUsers();
    }

    async addElection(event) {
        event.preventDefault();
        const e = await Parse.Cloud.run('addElectionDay', { name: this.eDayInfo.name, 
            date: new Date(this.eDayInfo.date)});
        const list = this.state.eDayIds;
        try {
            list.push(e.id);
            console.log("Saved new election " + e.id + ": " + e.get('edName') + "@" + e.get('edDate'));
            this.setState( {eDayIds: list, showAddElectionForm: false} );
        } catch(error) {
            console.log(error);
        }
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

    logout() {
        this.doLogout();
        this.props.history.push('/')
    }

    render() {

        const eDayList = this.state.eDayIds;
        const userList = this.state.allUsers;
        if(eDayList.length < 1) {
            //this.loadElectionDays();
        }

        //console.log(eDayList);
        //console.log(userList);

        return(
            <div className="admin">
                <p>{LocalePicker.getString('electionDays')}</p>
                <div className="list">
                    <ul>
                        {eDayList.map( (e) =>
                        <li key={e}><ElectionDay id={e} delete={() => this.deleteElectionDay(e)}
                        locale={this.state.language}/></li> )}
                    </ul>
                    {this.state.showAddElectionForm
                    ? <AddElectionDayForm onSubmit={this.addElection} onUpdate={this.updateEDay}
                        locale={this.state.language}
                        onCancel={() => { this.setState({showAddElectionForm: false})}}/>
                    : <button name="addElection" onClick={() => 
                        { this.setState({showAddElectionForm: true})}}>
                            {LocalePicker.getString('addElectionDay')}</button>}
                </div>
                <button name="logout" onClick={this.logout}>{LocalePicker.getString('logout')}</button>
                <div>
                    <p>{LocalePicker.getString('userAdmin')}</p>
                    <ul>
                        {userList.map( (e) => {return(<UserAdmin id={e.id} name={e.name}
                            deleteUser={this.deleteUser} locale={this.state.language}/>)})}
                    </ul>
                    <AddUserForm addUser={this.addUser} locale={this.state.language}/>
                </div>
            </div>
        )
    }
}

export default AdminPage;
