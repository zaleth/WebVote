
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
            cList: [],
            collapsed: true,
            open: true,
            newCandidate: false,
            sumVotes: 0,
            castVotes: [],
        }
        this.delete = props.delete;
        this.addNewCandidate = this.addNewCandidate.bind(this);
        this.resetVotes = this.resetVotes.bind(this);
        this.toggleOpen = this.toggleOpen.bind(this);
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

    }

    countVotes() {
        const Vote = Parse.Object.extend('Vote');
        const query = new Parse.Query(Vote);
        query.equalTo('elID', this.state.id);
        query.find().then( (res) => {
            const list = [];
            res.forEach( (e) => {
                var isAdded = false;
                const cID = e.get('cID');
                for(var i = 0; (i < list.length) && (! isAdded); i++) {
                    if(list[i].id === cID) {
                        list[i].votes++;
                        isAdded = true;
                    }
                }
                if(! isAdded) {
                    list.push( {id: cID, votes: 1});
                }
            });
            this.setState({ castVotes: list, sumVotes: res.length});
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
        return 0;
    }

    setCollapsed(val) {
        this.countVotes();
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
        const disable = myState.open ? "disabled" : "";
        return(
            <div>
            <div>
                {myState.name} ( {myState.votes} ) [{myState.sumVotes}]
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
