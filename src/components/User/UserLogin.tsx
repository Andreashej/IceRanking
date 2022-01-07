import React, { useState } from 'react';


import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password'
import { Button } from 'primereact/button';
import { useUserContext } from '../../contexts/user.context';

export type UserLoginProps = {
    show?: boolean;
    onHide: () => void;
}

export const UserLogin: React.FC<UserLoginProps> = ({show, onHide}) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { login } = useUserContext();

    const submitForm = (event: React.FormEvent) => {
        event.preventDefault()
        login(username, password);
        onHide();
    }

    return (
        <Dialog header="Please log in" visible={show} modal onHide={onHide} position="top" className="loginbox">
            <form id="login" onSubmit={e => submitForm(e)}>
                <span className="p-float-label">
                    <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="username">Username</label>
                </span>
                <span className="p-float-label">
                    <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
                    <label htmlFor="password">Password</label>
                </span>
                <Button label="Login" icon="pi pi-sign-in" className="p-button-rounded p-button-raised" />
            </form>
        </Dialog>
    );
}