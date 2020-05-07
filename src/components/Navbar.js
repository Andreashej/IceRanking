import React from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Menubar } from 'primereact/menubar'
import { SplitButton } from 'primereact/splitbutton'
import { Button } from 'primereact/button';

import UserLogin from './User/UserLogin';

import { getRankings, getProfile, logout } from '../actions';

import history from '../history';

class Navbar extends React.Component {
    state = {
        showRankingDropdown: false,
        activeItem: '',
        showLogin: false
    }

    menuItems = [
        {
            label: "Home",
            icon: "pi pi-home",
            command: () => this.props.history.push('/')
        },
        {
            label: "Rankings",
            icon: "pi pi-sort-numeric-down",
            items: []
        },
        // {
        //     label: "About",
        //     icon: "pi pi-info",
        //     command: () => this.props.history.push('/about')
        // }
    ]

    componentDidMount() {
        this.props.getRankings();
        this.props.getProfile();
    }

    componentDidUpdate() {
        if (this.state.activeItem !== history.location.pathname) {
            this.setState({
                activeItem: history.location.pathname
            });
        }
    }

    renderRankingItems() {

        const items = this.props.rankings.map(ranking => {
            const link = `/rankings/${ranking.shortname}`;
            const active = (link === this.state.activeItem) ? 'active' : '';
            console.log(link, active);

            return <Link key={ranking.id} className={`dropdown-item ${active}`} to={link} onClick={() => this.onDropdownClick()}>{ranking.listname}</Link>
        })

        const show = this.state.showRankingDropdown ? 'show' : ''

        return (
            <div className={`dropdown-menu ${show}`} ref={this.rankingDropdown}>
                {items}
            </div>
        )
    }

    passRankingsToModel() {
        return this.props.rankings.map(ranking => {
            const link = `/rankings/${ranking.shortname}`;
            return {
                label: ranking.listname,
                command: () => {
                    this.props.history.push(link)
                }
            }
        });
    }

    onDropdownClick() {
        this.setState({
            showRankingDropdown: !this.state.showRankingDropdown
        });
    }

    getUserSection() {
        if (this.props.currentUser) {
            const userActions = [
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
                </>
            );
        }
    }

    render() {
        this.menuItems[1].items = this.passRankingsToModel();
        // return (
        //     <nav className="navbar navbar-expand navbar-dark bg-dark" style={{boxShadow: "rgba(0,0,0,0.4) 0 5px 5px"}}>
        //         <Link className="navbar-brand" to="/">IceRanking</Link>
        //         <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        //             <span className="navbar-toggler-icon"></span>
        //         </button>
    
        //         <div className="collapse navbar-collapse" id="navbarContent">
        //             <ul className="navbar-nav mr-auto">
        //                 <li className={`nav-item dropdown ${this.state.activeItem.includes('rankings') ? 'active' : ''}`}>
        //                     <button className="nav-link dropdown-toggle" href="#" id="rankingsDropdown" data-toggle="dropdown" onClick={() => this.onDropdownClick()}>
        //                         Rankings
        //                     </button>
        //                     {this.renderRankingItems()}
        //                 </li>
        //             </ul>
        //         </div>
        //     </nav>
        // );

        return (
            <nav className="navigation container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Menubar model={this.menuItems} className="topnav">
                                {this.getUserSection()}
                            </Menubar>
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