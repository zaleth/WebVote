
import React from 'react';
import PropTypes from 'prop-types';
import Parse from './index';
import Candidate from './Candidate';
import AddCandidateForm from './AddCandidateForm';

class Election extends React.Component {

    constructor(props) {
        super(props);
        console.log("Election ID: " + props.id);
        this.state = {
            id: props.id,
            name: "",
            votes: 1,
            voters: 0,
            cList: [],
            collapsed: true,
            open: true,
            newCandidate: false,
            sumVotes: 0,
            castVotes: [],
            pollInterval: 5000, // poll every 5 seconds
        }
        this.delete = props.delete;
        this.addNewCandidate = this.addNewCandidate.bind(this);
        this.resetVotes = this.resetVotes.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        if(this.state.id !== "") {
            const Elec = Parse.Object.extend('Election');
            const query = new Parse.Query(Elec);
            query.get(this.state.id).then( (e) => {
                console.log("Found election id " + e.id + " <- " + e.get('edID') + " with " + e.get('cList'));
                const list = [];
                const Cand = Parse.Object.extend('Candidate');
                const iQuery = new Parse.Query(Cand);
                iQuery.equalTo('elID', e.id);
                iQuery.find().then( (res) => {
                    res.forEach( (c) => {
                        list.push( {
                            id: c.id,
                            elID: c.get('elID'),
                            name: c.get('name'),
                        });
                    });
                }, (error) => {
                    console.log("Error loading candidate: " + error);
                })
                const isOpen = e.get('open');
                this.setState( {
                        name: e.get('name'),
                        votes: e.get('votes'),
                        cList: list,
                        open: (typeof isOpen === 'undefined' ? true : isOpen),
                    });
            }, (error) => {
                console.log("Error getting election: " + error);
            });
        }
        this.interval = setInterval(this.tick, this.state.pollInterval);
    }

    componentDidUpdate(prevProps, prevState) {
        if((this.state.open) && (!prevState.open)) {
            // election was just opened, start the timer
            this.interval = setInterval(this.tick, this.state.pollInterval);
        } else if((! this.state.open) && (prevState.open)) {
            // election was just closed, cancel the timer and poll one last time
            clearInterval(this.interval);
            this.tick();
        }
    }

    componentWillUnmount() {
        // cancel the poll timer
        clearInterval(this.interval);
    }

    tick() {
        this.countVotes();
        console.log("tick");
    }

    countVotes() {
        const Vote = Parse.Object.extend('Vote');
        const query = new Parse.Query(Vote);
        query.equalTo('elID', this.state.id);
        query.find().then( (res) => {
            const list = [];
            const voters = [];
            res.forEach( (e) => {
                var isAdded = false;
                const cID = e.get('cID');
                // has this candidate received votes already?
                for(var i = 0; (i < list.length) && (! isAdded); i++) {
                    if(list[i].id === cID) {
                        // if so, increment the counter
                        list[i].votes++;
                        isAdded = true;
                    }
                }
                // otherwise, add them to the list
                if(! isAdded) {
                    list.push( {id: cID, votes: 1});
                }

                // for multi elections, we need to count the number of voters as well
                // in SQL this could be done by a COUNT DISTINCT ORDER BY vID
                // maybe there is something similar for Parse.Query
                if(this.state.votes > 1) {
                    const vID = e.get('vID');
                    isAdded = false;
                    // has this voter been added already already?
                    for(i = 0; (i < voters.length) && (! isAdded); i++) {
                        if(voters[i] === vID) {
                            isAdded = true;
                        }
                    }
                    // otherwise, add them to the list
                    if(! isAdded) {
                        voters.push( vID );
                    }
                }
            });
            this.setState({ castVotes: list, sumVotes: res.length, voters: voters.length });
        }, (error) => {
            console.log("Error counting votes: " + error);
        });
    }

    votesForCand(cID) {
        const list = this.state.castVotes;
        for(var i = 0; i < list.length; i++) {
            if(list[i].id === cID)
                return list[i].votes;
        }
        // if the candidate is not in the list, they have 0 votes
        return 0;
    }

    setCollapsed(val) {
        //this.countVotes();
        this.setState({ collapsed: val});
    }

    toggleOpen() {
        if(this.state.open) {
            this.setState( { open: false} );
            // publish state to the database
            const Elec = Parse.Object.extend('Election');
            const query = new Parse.Query(Elec);
            query.get(this.state.id).then( (e) => {
                e.set('open', false);
                e.save().then( (e) => {
                    console.log("Election saved successfully");
                }, (error) => {
                    console.log("Error saving election: " + error);
                });
            }, (error) => {
                console.log("Error fetching election: " + error);
            });
        } else {
            this.setState( { open: true} );
            // publish state to the database
            const Elec = Parse.Object.extend('Election');
            const query = new Parse.Query(Elec);
            query.get(this.state.id).then( (e) => {
                e.set('open', true);
                e.save().then( (e) => {
                    console.log("Election saved successfully");
                }, (error) => {
                    console.log("Error saving election: " + error);
                });
            }, (error) => {
                console.log("Error fetching election: " + error);
            });
        }
    }

    addNewCandidate(e) {
        const list = this.state.cList;
        list.push(e);
        console.log("Added candidate " + e.id + ": " + e.get('name'));
        this.setState({ 'cList': list, newCandidate: false });
    }

    deleteCandidate(id) {
        const list = [];
        this.state.cList.forEach( (e) => {
            if(e.id !== id)
                list.push(e);
        });
        // delete from database before we update the list in state
        const Cand = Parse.Object.extend('Candidate');
        const query = new Parse.Query(Cand);
        query.get(id).then( (e) => {
            e.destroy();
        }, (error) => {
            console.log(error);
        });   
        this.setState( {cList: list} );
    }

    resetVotes() {
        if(this.state.open)
            return;

        const Vote = Parse.Object.extend('Vote');
        const query = new Parse.Query(Vote);
        query.equalTo('elID', this.state.id);
        query.find().then( (res) => {
            res.forEach( (e) => {
                e.destroy();
            });
        }, (error) => {
            console.log("Error clearing votes: " + error);
        });
        this.setState({ castVotes: [], sumVotes: 0});
    }

    render() {
        const myState = this.state;
        return(
            <div>
            <div>
                {myState.name} ( {myState.votes} ) [{(myState.votes > 1) ? myState.voters : myState.sumVotes}]
                {myState.collapsed 
                    ? <button name="expand" onClick={()=>this.setCollapsed(false)}> &gt; </button>
                    : <button name="collapse" onClick={()=>this.setCollapsed(true)}> v </button> }
                <button onClick={this.toggleOpen}>{myState.open ? "Close" : "Open"}</button>
                <button onClick={this.resetVotes} disabled={myState.open}>Reset votes</button>
            </div>
            <div>
                {((!myState.collapsed) && (myState.cList.length > 0)) ?
                    <ul>
                    {myState.cList.map( (e) =>
                        <li key={e.id}><Candidate id={e.id} delete={() => this.deleteCandidate(e.id)}/>
                        {myState.open ? "" : [this.votesForCand(e.id)]} </li>)}
                    </ul>
                : ""}
            </div>
            <div>{myState.collapsed ? "" : 
                <div>{myState.newCandidate ?
                <AddCandidateForm elID={myState.id} onSubmit={this.addNewCandidate} 
                onCancel={()=>this.setState({newCandidate: false})}/> : 
                <button onClick={()=>this.setState({newCandidate: true})}>Add Candidate</button>}</div>}
            </div>
            </div>
    )
    }
};

Election.propTypes = {
    id: PropTypes.string.isRequired,
    
};

export default Election;
