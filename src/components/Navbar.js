import React from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Button } from 'primereact/button';

import UserLogin from './User/UserLogin';

import { getRankings, getProfile, logout } from '../actions';

import SearchBar from "./Search/SearchBar";

class Navbar extends React.Component {
    menu;

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
                        
                    }
                },
                {
                    label: "Log out",
                    icon: "pi pi-sign-out",
                    command: () => {
                        
                    }
                }
            ];

            const tooltipOptions = {
                position: 'bottom'
            }

            return (
                <>
                    <Button 
                        icon="pi pi-plus" model={userActions}
                        className="p-button-rounded p-button-raised p-button-success p-button-outlined p-button-icon-only mr-2" 
                        onClick={e => {
                            this.props.history.push('/competition/create')
                        }}
                        tooltip="Create competition"
                        tooltipOptions={tooltipOptions}
                    />
                    <Button 
                        icon="pi pi-sign-out" model={userActions}
                        className="login-button p-button-rounded p-button-raised p-button-danger p-button-outlined p-button-icon-only" 
                        onClick={e => {
                            this.props.logout();
                        }}
                        tooltip="Log out"
                        tooltipOptions={tooltipOptions}
                    />
                    <Button icon="pi pi-search" className="search-button d-block d-md-none" onClick={() => {
                        this.setState({show: true});
                    }} />
                </>
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
                            <Link to="/" className="branding-text d-inline">
                                {/* <img src="assets/img/iceranking_tiny_notext.png" className="d-sm-none" style={{ height: 33}}/> */}
                                <img src="assets/img/iceranking_tiny.png" style={{ height: 33}}/>
                            </Link>
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