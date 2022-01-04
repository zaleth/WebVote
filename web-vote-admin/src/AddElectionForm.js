
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
        const Election = Parse.Object.extend("Election");
        const e = new Election();
        e.set('edID', this.props.edID);
        e.set('name', this.state.name);
        e.set('votes', this.state.votes.toString());
        e.set('cList', []);
        e.set('open', true);
        e.save().then( (id) => {this.props.onSubmit(e);} );
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
