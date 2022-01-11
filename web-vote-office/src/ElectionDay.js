
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
        this.stuffBallots = this.stuffBallots.bind(this);
        this.genVoterID = this.genVoterID.bind(this);
        this.eraseVoters = this.eraseVoters.bind(this);
        this.setVoterID = props.showID;
        this.delete = props.delete;
    }

    componentDidMount() {
        if(this.state.id !== "") {
            const EDay = Parse.Object.extend('ElectionDay');
            const query = new Parse.Query(EDay);
            query.get(this.state.id).then( (ed) => {
                ed.set('edDate', new Date(ed.get('edDate')).toDateString());
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

    async genVoterID() {
        const res = await Parse.Cloud.run('genVoterId', { edId: this.state.id });
            this.setVoterID(res);
            console.log("Added voter ID " + res + " to election day " + this.state.id);
    }

    async eraseVoters() {
        await Parse.Cloud.run('eraseVoters', {elID: this.state.id});
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
                    <button onClick={this.genVoterID}>Add new voter</button>
                        <button onClick={this.eraseVoters}>Erase all voters</button>
                
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
