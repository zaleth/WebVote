
import React from 'react';
import PropTypes from 'prop-types';
import Parse from './index';
import Election from './Election';


class ElectionDay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            name: "",
            date: "",
            elections: [],
            collapsed: true,
            newElection: false,
            voters: 0,
        }
        this.addNewElection = this.addNewElection.bind(this);
        this.deleteElection = this.deleteElection.bind(this);
        this.delete = props.delete;
    }

    componentDidMount() {
        if(this.state.id !== "") {
            const EDay = Parse.Object.extend('ElectionDay');
            const query = new Parse.Query(EDay);
            query.get(this.state.id).then( (ed) => {
                console.log("Found election day id " + ed.id + ": " + ed.get('edName') + "@" + ed.get('edDate'));
                const id = ed.id;
                const list = [];
                const Elec = Parse.Object.extend('Election');
                const iQuery = new Parse.Query(Elec);
                iQuery.equalTo('edID', id);
                iQuery.find().then( (result) => {
                    result.forEach( (e) => {
                        list.push( {
                            'id': e.id,
                            'name': e.name,
                            'cList': e.cList,
                            'votes': e.numVotes,
                        });
                    });
                    this.setState( {
                        name: ed.get('edName'),
                        date: ed.get('edDate'),
                        elections: list,
                    });
                    console.log("state set for '" + this.state.name + "'");
                }, (error) => {
                    console.log("Error getting elections: " + error);
                });
            }, (error) => {
                console.log("Error getting electionDay: " + error);
            });
        }
        this.countVoters();
    }

    setCollapsed(val) {
        this.countVoters();
        this.setState({ collapsed: val});
    }

    saveElectionDay() {
        const EDay = Parse.Object.extend('ElectionDay');
        const query = new Parse.Query(EDay);
        const edName = this.state.name;
        const eList = this.state.elections;
        query.get(this.state.id).then( (ed) => {
            // update existing entry with new data
            // edID can't be changed
            ed.set('edName', edName)
            // list of elections is not stored in the ElectionDay ...
            ed.save().then( (r) => {
                // ... so save them each now
                eList.forEach( (e) => {
                    Election.saveElection(e);
                });
            }, (error) => {});
        }, (error) => {
            // assume not found, create a new entry
            const ed = new EDay();
            // edID will be auto-assigned by the DB
            ed.set('edName', edName)
            // list of elections is not stored in the ElectionDay ...
            ed.save().then( (r) => {
                // ... so save them each now
                eList.forEach( (e) => {
                    Election.saveElection(e);
                });
            }, (error) => {});
        });

    }

    countVoters() {
        const Voter = Parse.Object.extend('Voter');
        const query = new Parse.Query(Voter);
        query.equalTo('edID', this.state.id);
        query.count().then( (num) => {
            this.setState( {voters: num});
        }, (error) => {
            console.log("Error counting voters for " + this.state.id + ": " + error);
        });
    }

    addNewElection(e) {
        const list = this.state.elections;
        list.push(e);
        this.setState({ 'elections': list, newElection: false });
    }

    deleteElection(id) {
        const list = [];
        this.state.elections.forEach( (e) => {
            if(e.id !== id)
                list.push(e);
        });
        // delete from database before we update the list in state
        const Elec = Parse.Object.extend('Election');
        const query = new Parse.Query(Elec);
        query.get(id).then( (e) => {
            e.destroy();
        }, (error) => {
            console.log(error);
        });
        this.setState( {elections: list} );
    }

    getElectionList() {
        return this.state.elections;
    }

    render() {
        const myState = this.state;
        console.log(this.state.id, this.state.name);
        //this.countVoters();
        return(
                <div>{myState.name} ({myState.date}) [{myState.voters} voters] {myState.collapsed 
                    ? <button name="expand" onClick={()=>this.setCollapsed(false)}> &gt; </button>
                    : <button name="collapse" onClick={()=>this.setCollapsed(true)}> v </button>
                    
                }
                <div>
                    {((!myState.collapsed) && (myState.elections.length > 0)) ?
                        <ul>
                        {myState.elections.map( (e) =>
                            <li key={e.id}><Election id={e.id}/>
                            </li>)}
                        </ul>
                    : ""}
                </div>
                
                
                </div>
        );
    }
};

ElectionDay.propTypes = {
    id: PropTypes.string.isRequired,
};

export default ElectionDay;
