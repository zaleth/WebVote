
import PropTypes from "prop-types";
import React from "react";
import { LocalePicker } from "./locale";

class AddElectionDayForm extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = { name: "", date: "", language: props.locale };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState( {[event.target.name]: event.target.value} );
        this.props.onUpdate(event.target.name, event.target.value);
    }

    render() {
        return(
            <form onSubmit={this.props.onSubmit}>
                <label>
                    {LocalePicker.getString('name')}:
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                </label><br />
                <label>
                    {LocalePicker.getString('date')}:
                    <input type="date" name="date" value={this.state.date} onChange={this.handleChange} />
                </label><br />
                <input type="submit" value={LocalePicker.getString('addElectionDay')} />
                <button onClick={this.props.onCancel}>{LocalePicker.getString('cancel')}</button>
            </form>
        )
    }
}

AddElectionDayForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

export default AddElectionDayForm;
