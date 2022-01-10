
import PropTypes from "prop-types";
import React from "react";
import Parse from './index';

class AddElectionForm extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = { name: "", votes: 1, cList: [] };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState( {[event.target.name]: event.target.value} );
        //this.props.onUpdate(event.target.name, event.target.value);
    }

    handleSubmit(event) {
        const res = Parse.Cloud.run('addElection', {edID: this.props.edID, name: this.state.name,
            votes: this.state.votes.toString()});
        const e = Parse.Object.fromJSON(res);
        this.props.onSubmit(e);
        event.preventDefault();
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                </label><br />
                <label>
                    Votes:
                    <input type="number" name="votes" value={this.state.votes} onChange={this.handleChange} />
                </label><br />
                <input type="submit" value="Add election" />
                <button onClick={this.props.onCancel}>Cancel</button>
            </form>
        )
    }
}

AddElectionForm.propTypes = {
    edID: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

export default AddElectionForm;
