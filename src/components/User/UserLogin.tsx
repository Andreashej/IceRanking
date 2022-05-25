import React, { useMemo, useState } from 'react';


import {Dialog} from 'primereact/dialog';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password'
import { Button } from 'primereact/button';
import { useUserContext } from '../../contexts/user.context';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message'

export type UserLoginProps = {
    show?: boolean;
    variant?: 'login' | 'register';
    onHide: () => void;
}

export const UserLogin: React.FC<UserLoginProps> = ({show, onHide, variant}) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const { login, register } = useUserContext();

    const submitForm = (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true);
        setFormError(null);
        let promise;
        if ( variant === 'register') {
            promise = register(username, password, firstName, lastName, email)
        } else {
            promise = login(username, password)
        }

        promise
            .then(() => {
                onHide();
            })
            .catch((error) => {
                setFormError(error);
            })
            .finally(() => {
                setLoading(false)
            });
    }

    const header = useMemo(() => {
        switch(variant) {
            case 'register': return 'Please register';
            default: return "Please log in";
        }
    }, [variant])

    const buttonLabel = useMemo(() => {
        switch (variant) {
            case 'register': return "Register";
            default: return "Login"
        }
    }, [variant])

    return (
        <Dialog header={header} visible={show} modal onHide={onHide} position="top" className="loginbox">
            <form id="login" onSubmit={e => submitForm(e)}>
                {variant === 'register' && (
                <>
                    <span className="p-float-label">
                        <InputText id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <label htmlFor="firstname">First Name</label>
                    </span>
                    <span className="p-float-label">
                        <InputText id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <label htmlFor="lastname">Last Name</label>
                    </span>
                    <span className="p-float-label">
                        <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="email">Email</label>
                    </span>
                </>)}
                <span className="p-float-label">
                    <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="username">Username</label>
                </span>
                <span className="p-float-label">
                    <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} />
                    <label htmlFor="password">Password</label>
                </span>
                <Button label={buttonLabel} icon="pi pi-sign-in" className="p-button-rounded p-button-raised" disabled={loading}/>
                {loading && <ProgressSpinner style={{ marginLeft: ".5rem", height: "2em", width: "2em" }} strokeWidth=".5rem" />}
                {formError != null && <div className='mt-2'>
                    <Message severity="error" content={formError}></Message>
                </div>}
            </form>
        </Dialog>
    );
}