
import PropTypes from "prop-types";
import React from "react";
import Parse from './index';

class Candidate extends React.Component {

    constructor(props) {
        super(props);
        this.state = { id: props.id, elID: "", name: "", grp: props.grp, votes: parseInt(props.votes), };
        this.onChange = props.onChange;
        console.log("Candidate created");
    }

    componentDidMount() {
        if(this.state.id !== "") {
            const Cand = Parse.Object.extend('Candidate');
            const query = new Parse.Query(Cand);
            query.get(this.state.id).then( (e) => {
                console.log("Found candidate id " + e.id + " <- " + e.get('elID') + ": " + e.get('name'));
                    this.setState( {
                        elID: e.get('elID'),
                        name: e.get('name'),
                    });
            }, (error) => {
                console.log("Error getting candidate " + this.state.id + ": " + error);
            });
        }

    }

    render() {
        const myState = this.state;
        const type = myState.votes > 1 ? "checkbox" : "radio";
        console.log("Candidate.render()");
        return(
            <div><input id={myState.id} type={type} name={myState.grp} onChange={this.onChange}/>
            <label htmlFor={myState.id}>{myState.name}</label></div>
        );
    }
}

Candidate.propTypes = {
    id: PropTypes.string.isRequired,
    votes: PropTypes.string.isRequired,
    grp: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Candidate;