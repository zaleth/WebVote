
import PropTypes from "prop-types";
import React from "react";
import Parse from './index';

class AddCandidateForm extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = { name: "",  };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState( {[event.target.name]: event.target.value} );
        //this.props.onUpdate(event.target.name, event.target.value);
    }

    handleSubmit(event) {
        const Cand = Parse.Object.extend("Candidate");
        const e = new Cand();
        e.set('elID', this.props.elID);
        e.set('name', this.state.name);
        e.save().then( (id) => {console.log(id); this.props.onSubmit(e);}, (error) => {console.log(error);} );
        event.preventDefault();
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                </label><br />
                <input type="submit" value="Add candidate" />
                <button onClick={this.props.onCancel}>Cancel</button>
            </form>
        )
    }
}

AddCandidateForm.propTypes = {
    elID: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

export default AddCandidateForm;
