import React, { useEffect, useMemo, useState } from "react";
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';

import { UserLogin } from './User/UserLogin';

import { SearchBar } from "./Search/SearchBar";
import { useIsLoggedIn, useProfile } from "../contexts/user.context";
import { profile } from "console";

const UserSection: React.FC = () => {
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [loginVariant, setLoginVariant] = useState<'register' | 'login'>('login');
    const [user, logout] = useProfile();
    const isLoggedIn = useIsLoggedIn();
    const history = useHistory();

    const userActions = useMemo(() => {
        const adminUserActions = [
            {
                label: "Create competition",
                icon: "pi pi-calendar-plus",
                command: () => {
                    history.push("/competition/create");
                }
            },
            {
                label: "Dashboard",
                icon: "pi pi-cog",
                command: () => {
                    history.push("/dashboard");
                }
            }
        ];
    
        const allUserActions = [
            {
                label: "Log out",
                icon: "pi pi-sign-out",
                command: () => {
                    logout();
                }
            }
        ];

        if (user?.superUser) return [...adminUserActions, ...allUserActions];


        return allUserActions;
    }, [user, history, logout]);

    if (!isLoggedIn) {
        return (
            <>
                <UserLogin show={showLogin} variant={loginVariant} onHide={() => setShowLogin(false)}></UserLogin>
                <Button 
                    label="Login" 
                    icon="pi pi-sign-in" 
                    className="login-button p-button-text p-button-sm" 
                    onClick={() => {
                        setLoginVariant('login');
                        setShowLogin(true)
                    }} 
                />
                <Button 
                    label="Register" 
                    icon="pi pi-user" 
                    className="p-button-raised p-button-rounded register-button p-button-sm" 
                    onClick={() => {
                        setLoginVariant('register');
                        setShowLogin(true)
                    }} 
                />
            </>
        );
    }


    return (
        <SplitButton label={user?.username} icon="pi pi-user" model={userActions} className="register-button p-button-sm"></SplitButton>
    );
}

export const Navbar: React.FC = () => {
    const [isSticky, setIsSticky] = useState(false);
    const [showSearchbar, setShowSearchbar] = useState(false);

    useEffect(() => {
        document.addEventListener("scroll", () => {
            if (window.scrollY < 6) {
                setIsSticky(false);
            } else {
                setIsSticky(true);
            }
        });
    })

    return (
        <nav className={`navigation container-fluid ${isSticky ? 'sticky' : ''}`}>
            <div className="container">
                <div className="row">
                    <div className={`col-6 col-md-3 logo-container order-1 ${showSearchbar ? 'hide' : ''}`}>
                        <Link to="/" className="branding-text d-inline">
                            <img src="assets/img/icecompass_tiny.png" style={{ height: 35}} alt="App icon" />
                        </Link>
                    </div>
                    <div className="col-12 col-md-6 order-3 order-md-2">
                        <SearchBar show={showSearchbar} onHide={() => setShowSearchbar(false)} />
                    </div>
                    <div className={`col-6 col-md-3 order-2 order-md-3 ${showSearchbar ? 'hide' : ''}`}>
                        <UserSection />
                        <Button icon="pi pi-search" className="search-button d-block d-md-none" onClick={() => {
                            setShowSearchbar(true);
                        }} />
                    </div>
                </div>
            </div>
        </nav>
    );
}