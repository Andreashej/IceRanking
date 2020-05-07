import React from 'react';


import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password'
import { Button } from 'primereact/button';
import { connect } from 'react-redux';

import {login} from '../../actions';

class UserLogin extends React.Component {
    state = {
        username: "",
        password: "",
    }

    submitForm(event) {
        event.preventDefault()
        this.props.login(this.state);
    }

    render() {
        return (
            <Dialog header="Please log in" visible={this.props.show} modal={true} onHide={this.props.onHide} position="top" className="loginbox">
                <form id="login" onSubmit={e => this.submitForm(e)}>
                    <span className="p-float-label">
                        <InputText id="username" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} />
                        <label htmlFor="username">Username</label>
                    </span>
                    <span className="p-float-label">
                        <Password id="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} feedback={false} />
                        <label htmlFor="password">Password</label>
                    </span>
                    <Button label="Login" icon="pi pi-sign-in" className="p-button-rounded p-button-raised" />
                </form>
            </Dialog>
        );
    }
}

export default connect(null, {login})(UserLogin);