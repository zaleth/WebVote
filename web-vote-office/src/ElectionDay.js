
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
        this.stuffBallots = this.stuffBallots.bind(this);
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
                        const cList = [];
                        const Cand = Parse.Object.extend('Candidate');
                        const iiQuery = new Parse.Query(Cand);
                        iiQuery.equalTo('elID', e.id);
                        iiQuery.find().then( (res) => {
                            res.forEach( (c) => {
                                cList.push( {
                                    id: c.id,
                                    elID: c.get('elID'),
                                    name: c.get('name'),
                                });
                            });
                        }, (error) => {
                            console.log("Error loading candidate: " + error);
                        });
                        //console.log(e, e.get('votes'), parseInt(e.get('votes')));
                        //console.log(cList);
                        list.push( {
                            'id': e.id,
                            'name': e.get('name'),
                            'cList': cList,
                            'votes': parseInt(e.get('votes')),
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

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    min(a, b) {
        if(a < b)
            return a;
        return b;
    }

    stuffBallots() {
        const numVoters = 3;
        const Voter = Parse.Object.extend('Voter');
        const Vote = Parse.Object.extend('Vote');
        const myState = this.state;

        for(var i = 0; i < numVoters; i++) {
            const v = new Voter();
            v.set('edID', myState.id);
            v.save().then( (res) => {
                const vID = res.id;
                myState.elections.forEach( (e) => {
                    // to ensure we dont randomly pick the same candidate several times,
                    // we instead shuffle the list (for each voter) and take the n first
                    // candidates (with n being the number of candidates to chose)
                    //console.log(e);
                    const list = e.cList;
                    if(list.length > 0) {
                        //console.log(list + " ( " + e.votes + " )");
                        this.shuffle(list);
                        for(let c = 0; c < this.min(e.votes, list.length); c++) {
                            //console.log("Voting in " + e.name);
                            const vote = new Vote();
                            const params = {
                                'elID': e.id,
                                'cID': list[c].id,
                                'vID': vID,
                            };
                            Parse.Cloud.run("registerVote", params).then( (res) => {
                                //console.log("Voted for " + list[c].name + " in " + e.name);
                            }, (error) => {
                                console.log("Error casting vote:" + error);
                            });                
                        }
                    }
                });
                //console.log("Voter " + vID + " has voted");
            }, (error) => {
                console.log("Error creating new voter: " + error);
            });
    
        }
        console.log("Stuffing done, doing recount");
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
                    : <button name="collapse" onClick={()=>this.setCollapsed(true)}> v </button>}
                    <button name="stuff" onClick={this.stuffBallots}>Stuff ballots</button>
                
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
