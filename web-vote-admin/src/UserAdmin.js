
import React from "react";
import Parse from './index';
import { LocalePicker } from "./locale";

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
        console.log(res);

    }

    handleChange(event) {
        this.setState( {[event.target.name]: event.target.value} );
        //this.props.onUpdate(event.target.name, event.target.value);
    }

    render() {
        const myState = this.state;

        return(
            <li key={myState.id} id={myState.id}>
                <form onSubmit={this.handleSubmit}>
                {myState.name}-&gt;
                    <label>
                        {LocalePicker.getString('newPass')}:
                        <input type="password" name="newPass" value={this.state.newPass}
                            onChange={this.handleChange} />
                        <input type="submit" value={LocalePicker.getString('change')} />
                    </label>
                    <button onClick={() => this.deleteUser(myState.id)}>{LocalePicker.getString('delete')}</button>
                </form>
            </li>
        );
    }
}

export default UserAdmin;
