import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Menu } from 'primereact/menu';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';

import { getRanking, getRankingTests, getProfile } from '../../actions';

import Header from '../partials/Header';
import Submenu from '../partials/Submenu';
import EventList from '../partials/EventList';
import TestResults from './TestResults';

class RankingInfo extends React.Component {
    mobileMenu;

    componentDidMount() {
        const { shortname, testcode } = this.props.match.params;

        console.log(shortname, testcode);

        this.props.getRanking(shortname);
        this.props.getProfile();
    }

    componentDidUpdate() {
        const { shortname } = this.props.match.params;

        if(this.props.ranking.tests[0]) {
            this.props.getRankingTests(shortname);
        }

    }

    renderHeader() {
        if (!this.props.ranking) {
            return <ProgressSpinner/>
        } 

        return (
            <Header title={this.props.ranking.listname} />
        );
    }

    renderSubmenu() {
        if (!this.props.ranking || !this.props.ranking.tests || this.props.ranking.tests[0]) {
            return <ProgressSpinner/>;
        }
        
        const menuItems = Object.entries(this.props.ranking.tests).map(([testcode, test]) => {
            return {
                text: test.testcode,
                link: `/rankings/${this.props.match.params.shortname}/tests/${test.testcode}`,
                id: test.id,
                state: null
            }
        });
        
        return (
            <Submenu items={menuItems} />
        );
    }

    renderEvents(filter = 'upcoming') {
        if (!this.props.ranking) {
            return <div>Loading...</div>;
        }

        if (filter === 'upcoming') {
            return <EventList events={[]} />
        }

        return (
            <EventList events={this.props.ranking.competitions} />
        );
    }

    getMenuItems() {
        let tests = [];
        if (this.props.ranking) {
            tests = Object.entries(this.props.ranking.tests).map(([testcode, test]) => {
                return {
                    label: test.testcode,
                    command: () => this.props.history.push(`/rankings/${this.props.match.params.shortname}/tests/${test.testcode}`),
                    id: test.id,
                    className: test.testcode === this.props.match.params.testcode ? 'active' : null
                }
            });
        }

        let menuModel = [
            {
                label: "Events",
                command: () => this.props.history.push(`/rankings/${this.props.match.params.shortname}`),
                className: !this.props.match.params.testcode ? 'active' : null
            },
            {
                label: "Tests",
                items: tests
            }
        ];

        if (this.props.currentUser) {
            menuModel.push({
                label: "Admin",
                items: [
                    {
                        label: "Edit ranking"
                    },
                    {
                        label: "Test definitions"
                    },
                ]
            });
        }

        return menuModel;
    }

    getEvents() {
        return (
            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <h2 className="subheader">Upcoming events</h2>
                        {this.renderEvents()}
                    </div>
                    <div className="col-12 col-md-6">
                        <h2 className="subheader">Latest events</h2>
                        {this.renderEvents('past')}
                    </div>
                </div>
            </div>
        );
    }

    getResults() {
        return (
            <TestResults testcode={this.props.match.params.testcode} shortname={this.props.match.params.shortname} />
        )
    }

    render() {
        const content = this.props.match.params.testcode ? this.getResults() : this.getEvents();
        return (
            <React.Fragment>
                {this.renderHeader()}
                {/* {this.renderSubmenu()} */}
                <div className="container">
                    <div className="row">
                        <div className="d-flex d-lg-none submenu mobile w-100">
                            <Menu model={this.getMenuItems()} popup={true} ref={el => this.mobileMenu=el} style={{width: "100%"}} />
                            <Button label="Menu" icon="pi pi-bars" className="mobile-menu-button" onClick={(event)=>this.mobileMenu.toggle(event)} style={{width: "100%", borderRadius: 0}} />
                        </div>
                        <div className="d-none d-lg-flex submenu">
                            <Menu model={this.getMenuItems()} />
                        </div>
                        <div className="col-12 col-lg px-0">
                            {content}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ranking: state.rankings[ownProps.match.params.shortname],
        currentUser: state.users.currentUser
    }
}

export default withRouter(connect(mapStateToProps, { getRanking, getRankingTests, getProfile })(RankingInfo));