
import React from "react";
import Parse from './index';

class UserAdmin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            name: props.name,
            newPass: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteUser = props.deleteUser;
    }

    async handleSubmit(event) {
        event.preventDefault();
        const myState = this.state;
        const res = await Parse.Cloud.run('changeUserPassword', { id: myState.id, newPass: myState.newPass});

    }

    handleChange(event) {
        this.setState( {[event.target.name]: event.target.value} );
        //this.props.onUpdate(event.target.name, event.target.value);
    }

    render() {
        const myState = this.state;

        return(
            <li key={myState.id} id={myState.id}>
                {myState.name}
                <form onSubmit={this.handleSubmit}>
                    <label>
                        New password:
                        <input type="password" name="newPass" value={this.state.newPass}
                            onChange={this.handleChange} />
                        <input type="submit" value="Change password" />
                    </label>
                </form>
                <button onClick={() => this.deleteUser(myState.id)}>Delete</button>
            </li>
        );
    }
}

export default UserAdmin;
