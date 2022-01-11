
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

    async handleSubmit(event) {
        event.preventDefault();
        await Parse.Cloud.run('addElection', {edID: this.props.edID, name: this.state.name,
            votes: this.state.votes});
        const Elec = Parse.Object.extend('Election');
        const query = new Parse.Query(Elec);
        query.equalTo('edID', this.props.edID);
        query.equalTo('name', this.state.name);
        query.find().then( (res) => {
            this.props.onSubmit(res[0]);
        });
        
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
