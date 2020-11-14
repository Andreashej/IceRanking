import React from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { SplitButton } from 'primereact/splitbutton';
import { Button } from 'primereact/button';

import UserLogin from './User/UserLogin';

import { getRankings, getProfile, logout } from '../actions';

import SearchBar from "./Search/SearchBar";

class Navbar extends React.Component {
    state = {
        showLogin: false,
        isSticky: false,
        show: false
    }

    componentDidMount() {
        this.props.getRankings();
        this.props.getProfile();

        document.addEventListener("scroll", () => {
            if (window.scrollY < 6) {
                this.setState({isSticky: false});
            } else {
                this.setState({isSticky: true});
            }
        });
    }

    getUserSection() {
        if (this.props.currentUser) {
            const userActions = [
                {
                    label: "Create competition",
                    icon: "pi pi-calendar-plus",
                    command: () => {
                        this.props.history.push('/competition/create')
                    }
                },
                {
                    label: "Log out",
                    icon: "pi pi-sign-out",
                    command: () => {
                        this.props.logout();
                    }
                }
            ];

            return (
                <SplitButton label={this.props.currentUser.username} icon="pi pi-user" model={userActions} className="login-button" />
            );
        } else if (this.props.currentUser === null) {
            return (
                <>
                    <UserLogin show={this.state.showLogin} onHide={() => this.setState({showLogin: false})}></UserLogin>
                    <Button label="Login" icon="pi pi-sign-in" className="p-button-raised p-button-rounded login-button" onClick={(e) => this.setState({showLogin: true})} />
                    <Button icon="pi pi-search" className="search-button d-block d-md-none" onClick={() => {
                        this.setState({show: true});
                    }} />
                </>
            );
        }
    }

    render() {

        return (
            <nav className={`navigation container-fluid ${this.state.isSticky ? 'sticky' : ''}`}>
                <div className="container">
                    <div className="row">
                        <div className={`col-6 col-md-3 logo-container order-1 ${this.state.show ? 'hide' : ''}`}>
                            <Link to="/" className="branding-text">IceRanking</Link>
                        </div>
                        <div className="col-12 col-md-6 order-3 order-md-2">
                            <SearchBar show={this.state.show} onHide={() => this.setState({show: false})} />
                        </div>
                        <div className={`col-6 col-md-3 order-2 order-md-3 ${this.state.show ? 'hide' : ''}`}>
                            {this.getUserSection()}
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => {
    return {
        rankings: Object.values(state.rankings),
        currentUser: state.users.currentUser
    }
}

export default withRouter(connect(mapStateToProps, { getRankings, getProfile, logout })(Navbar));