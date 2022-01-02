
import PropTypes from "prop-types";
import React from "react";

class AddElectionDayForm extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = { name: "", date: "" };
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
                    Name:
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                </label><br />
                <label>
                    Date:
                    <input type="date" name="date" value={this.state.date} onChange={this.handleChange} />
                </label><br />
                <input type="submit" value="Add election day" />
                <button onClick={this.props.onCancel}>Cancel</button>
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
