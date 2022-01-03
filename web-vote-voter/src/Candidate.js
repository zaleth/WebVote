
import PropTypes from "prop-types";
import React from "react";
import Parse from './index';

class Candidate extends React.Component {

    constructor(props) {
        super(props);
        this.state = { id: props.id, elID: "", name: "", };
        this.delete = props.delete;
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
        return(
            <div>{this.state.name} <button name="delete" onClick={() => this.delete()}>Delete</button></div>
        );
    }
}

Candidate.propTypes = {
    id: PropTypes.string.isRequired,
    delete: PropTypes.func.isRequired,
};

export default Candidate;