
import PropTypes from "prop-types";
import React from "react";
import Parse from './index';
import { LocalePicker } from "./locale";

class AddCandidateForm extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = { name: "", language: props.locale  };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(newProps, newState) {
        console.log(this.state.language, newProps.locale, newProps, newState)
        if(this.state.language !== newProps.locale) {
            this.setState( {language: newProps.locale} );
        }
    }

    handleChange(event) {
        this.setState( {[event.target.name]: event.target.value} );
        //this.props.onUpdate(event.target.name, event.target.value);
    }

    async handleSubmit(event) {
        event.preventDefault();
        await Parse.Cloud.run('addCandidate', {elID: this.props.elID, name: this.state.name});
        const Cand = Parse.Object.extend('Candidate');
        const query = new Parse.Query(Cand);
        query.equalTo('elID', this.props.elID);
        query.equalTo('name', this.state.name);
        query.find().then( (res) => {
            this.props.onSubmit(res[0]);
        });
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <label>
                    {LocalePicker.getString('name')}:
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                </label><br />
                <input type="submit" value={LocalePicker.getString('addCandidate')} />
                <button onClick={this.props.onCancel}>{LocalePicker.getString('cancel')}</button>
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
