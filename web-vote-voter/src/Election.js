
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
            voteID: props.voter,
            name: "",
            votes: 1,
            cList: [],
            collapsed: true,
            currentCandidate: "",
            chosenCandidates: [],
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
                    console.log("Found " + list.length + " candidates for " + e.id);
                }, (error) => {
                    console.log("Error loading candidate: " + error);
                })
                    this.setState( {
                        name: e.get('name'),
                        votes: e.get('votes'),
                        cList: list,
                    });
            }, (error) => {
                console.log("Error getting election: " + error);
            });
        }

    }

    registerVote(elID, cID, vID) {
        const Vote = Parse.Object.extend('Vote');
        const vote = new Vote();
        vote.set('elID', elID);
        vote.set('cID', cID);
        vote.set('vID', vID);
        vote.save().then( (res) => {

        }, (error) => {

        });
    }

    handleSubmit(event) {
        // has this voter voted already?
        const Vote = Parse.Object.extend('Vote');
        const query = new Parse.Query(Vote);
        query.equalTo('vID', this.state.voteID);
        query.equalTo('elID', this.state.id);
        query.find().then( (res) => {
            if(res.length > 0) {
                console.log(res);
                alert("You have already voted in this election");
            } else {
                // register the votes
                if(this.state.votes > 1) {
                    this.state.chosenCandidates.forEach( (e) => {
                        this.registerVote(this.state.id, e, this.state.voteID);
                    });
                } else {
                    this.registerVote(this.state.id, this.state.currentCandidate, this.state.voteID);
                }
                alert("Thank you for voting");
            }
        }, (error) => {
            console.log("Error casting vote: " + error);
        });
        event.preventDefault();
    }

    handleChange(event) {
        //console.log(event);
        //console.log(event.target.id); // this is the candidate
        //console.log(event.target.name); // this is the election
        const myState = this.state;
        if(myState.votes > 1) {
            if(event.target.checked) {
                console.log("checked");
                if(myState.chosenCandidates.length < myState.votes)
                    myState.chosenCandidates.push(event.target.id);
                else {
                    alert("Maximum number of candidates selected");
                    // uncheck
                    event.target.checked = false;
                }
            } else {
                console.log("unchecked");
                const list = [];
                myState.chosenCandidates.forEach( (e) => {
                    if(e !== event.target.id)
                        list.push(e);
                });
                this.setState( {chosenCandidates: list} );
            }
        } else {
            this.setState( {currentCandidate: event.target.id} );
        }
    }


    render() {
        const myState = this.state;
        //console.log(myState.cList.length + " candidates");
        const type = myState.votes > 1 ? "checkbox" : "radio";
        return(
            <div>
            <div>
                {myState.name} ( {myState.votes} )
                {myState.collapsed 
                    ? <button name="expand" onClick={()=>this.setState({collapsed: false})}> &gt; </button>
                    : <button name="collapse" onClick={()=>this.setState({collapsed: true})}> v </button> }
                
            </div>
            <div>
                {((!myState.collapsed) && (myState.cList.length > 0)) ?
                    <form onSubmit={this.handleSubmit}>
                        {myState.cList.map( (e) => { 
                            return(<p><input id={e.id} type={type} name={myState.id} 
                                onChange={this.handleChange} value={e.id} key={e.id}/>
                            <label htmlFor={e.id}>{e.name}</label></p>)})}
                        <input type="submit" value="Cast vote" />
                    </form>
                : ""}
            
            </div>
            </div>
    )
    }
};

Election.propTypes = {
    id: PropTypes.string.isRequired,
    voter: PropTypes.string.isRequired,
};

export default Election;
