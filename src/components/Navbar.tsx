import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';

import { UserLogin } from './User/UserLogin';

import { SearchBar } from "./Search/SearchBar";
import { useIsLoggedIn, useProfile } from "../contexts/user.context";

const UserSection: React.FC = () => {
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [user, logout] = useProfile();
    const isLoggedIn = useIsLoggedIn();
    const history = useHistory();

    if (!isLoggedIn) {
        return (
            <>
                <UserLogin show={showLogin} onHide={() => setShowLogin(false)}></UserLogin>
                <Button label="Login" icon="pi pi-sign-in" className="p-button-raised p-button-rounded login-button p-button-sm" onClick={() => setShowLogin(true)} />
            </>
        );
    }

    const userActions = [
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
        },
        {
            label: "Log out",
            icon: "pi pi-sign-out",
            command: () => {
                logout();
            }
        }
    ];

    return (
        <SplitButton label={user?.username} icon="pi pi-user" model={userActions} className="login-button p-button-sm"></SplitButton>
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