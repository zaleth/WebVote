
import React from 'react';
import PropTypes from 'prop-types';
import Parse from './index';
import { LocalePicker } from './locale';

class Election extends React.Component {

    constructor(props) {
        super(props);
        //console.log("Election ID: " + props.id);
        this.state = {
            id: props.id,
            voteID: props.voter,
            name: "",
            votes: 1,
            cList: [],
            collapsed: true,
            open: true,
            currentCandidate: "",
            chosenCandidates: [],
            language: props.locale
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if(this.state.id !== "") {
            const Elec = Parse.Object.extend('Election');
            const query = new Parse.Query(Elec);
            query.get(this.state.id).then( (e) => {
                //console.log("Found election id " + e.id + " <- " + e.get('edID') + " with " + e.get('cList'));
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
                    //console.log("Found " + list.length + " candidates for " + e.id);
                }, (error) => {
                    console.log("Error loading candidate: " + error);
                })
                    this.setState( {
                        name: e.get('name'),
                        votes: e.get('votes'),
                        cList: list,
                        open: e.get('open'),
                    });
            }, (error) => {
                console.log("Error getting election: " + error);
            });
        }

    }

    componentDidUpdate(newProps, newState) {
        //console.log(this.state.language, newProps.locale, newProps, newState)
        if(this.state.language !== newProps.locale) {
            this.setState( {language: newProps.locale} );
        }
    }

    async registerVote(elID, cID, vID) {
        await Parse.Cloud.run('registerVote', {elID: elID, cID: cID, vID: vID});
    }

    handleSubmit(event) {
        event.preventDefault();
        // has this voter voted already?
        const Vote = Parse.Object.extend('Vote');
        const query = new Parse.Query(Vote);
        query.equalTo('vID', this.state.voteID);
        query.equalTo('elID', this.state.id);
        query.find().then( (res) => {
            if(res.length > 0) {
                //console.log(res);
                this.setState( {collapsed: true} );
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
                this.setState( {collapsed: true} );
                alert("Thank you for voting");
            }
        }, (error) => {
            console.log("Error casting vote: " + error);
        });
    }

    handleChange(event) {
        //console.log(event);
        //console.log(event.target.id); // this is the candidate
        //console.log(event.target.name); // this is the election
        const myState = this.state;
        if(myState.votes > 1) {
            if(event.target.checked) {
                //console.log("checked");
                if(myState.chosenCandidates.length < myState.votes) {
                    const list = myState.chosenCandidates;
                    var isChecked = false;
                    for(var i = 0; (i < list.length) && !isChecked; i++) {
                        //console.log("comparing " + event)
                        if(event.target.id === list[i])
                            isChecked = true;
                    }
                    if(!isChecked) {
                        list.push(event.target.id);
                        this.setState( {chosenCandidates: list});
                    }

                } else {
                    alert("Maximum number of candidates selected");
                    // uncheck
                    event.target.checked = false;
                }
            } else {
                //console.log("unchecked");
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

    refreshVote() {
        // get election status
        const Elec = Parse.Object.extend('Election');
        const query = new Parse.Query(Elec);
        query.get(this.state.id).then( (e) => {
            this.setState( {open: e.get('open')} );
        }, (error) => {
            console.log("Error refreshing election data: " + error);
        });

        // get vote info
        const Vote = Parse.Object.extend('Vote');
        const iQuery = new Parse.Query(Vote);
        iQuery.equalTo('elID', this.state.id);
        iQuery.equalTo('vID', this.state.voteID);
        iQuery.find().then( (res) => {
            //console.log(res);
            if(this.state.votes > 1) {
                const list = [];
                res.forEach( (e) => {
                    list.push( e.get('cID') );
                });
                this.setState( {chosenCandidates: list} );
            } else {
                this.setState( {currentCandidate: res.length === 1 ? res.get('cID') : "" } );
            }
        }, (error) => {
            console.log("Error getting vote info: " + error);
        });
    }

    setCollapsed(val) {
        this.refreshVote();
        this.setState({ collapsed: val});
    }

    isChecked(e) {
        const myState = this.state;

        if (myState.votes > 1) {
            const list = myState.chosenCandidates; var isChosen = false;
            for(var i = 0; (i < list.length) && (! isChosen); i++) 
                if(e.id === list[i])
                    isChosen = true;
            return isChosen;
        } else {
            return (e.id === myState.currentCandidate);
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
                    ? <button name="expand" onClick={()=>this.setCollapsed(false)}> &gt; </button>
                    : <button name="collapse" onClick={()=>this.setCollapsed(true)}> v </button> }
                
            </div>
            <div>
                {((!myState.collapsed) && (myState.cList.length > 0)) ?
                    <form onSubmit={this.handleSubmit}>
                        {myState.cList.map( (e) => { 
                            return(<p><input key={e.id} id={e.id} type={type} name={myState.id} 
                                onChange={this.handleChange} value={e.id} key={e.id}
                                checked={this.isChecked(e)} />
                            <label htmlFor={e.id}>{e.name}</label></p>)})}
                        <input type="submit" value={LocalePicker.getString('castVote')} disabled={! myState.open}/>
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
