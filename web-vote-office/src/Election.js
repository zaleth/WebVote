
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
        }
        this.delete = props.delete;
        this.addNewCandidate = this.addNewCandidate.bind(this);
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

    render() {
        const myState = this.state;
        return(
            <div>
            <div>
                {myState.name} ( {myState.votes} )
                {myState.collapsed 
                    ? <button name="expand" onClick={()=>this.setState({collapsed: false})}> &gt; </button>
                    : <button name="collapse" onClick={()=>this.setState({collapsed: true})}> v </button> }
                <button>{myState.open ? "Close" : "Open"}</button>
            </div>
            <div>
                {((!myState.collapsed) && (myState.cList.length > 0)) ?
                    <ul>
                    {myState.cList.map( (e) =>
                        <li key={e.id}><Candidate id={e.id} delete={() => this.deleteCandidate(e.id)}/>
                        </li>)}
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
