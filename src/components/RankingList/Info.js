import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { ProgressSpinner } from 'primereact/progressspinner';

import { getRanking, getRankingTests, getProfile } from '../../actions';

import Header from '../partials/Header';
import EventList from '../partials/EventList';
import TestResults from './TestResults';
import Page from '../partials/Page';
import RankingOptions from './admin/RankingOptions';

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

        if(this.props.ranking && this.props.ranking.tests[0]) {
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
                className: !this.props.match.params.testcode && !this.props.match.params.page ? 'active' : null
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
                        label: "Edit ranking",
                        command: () => this.props.history.push(`/rankings/${this.props.match.params.shortname}/edit`),
                        className: "edit" === this.props.match.params.page ? 'active' : null
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
        );
    }

    getResults() {
        return (
            <TestResults testcode={this.props.match.params.testcode} shortname={this.props.match.params.shortname} />
        )
    }

    getTitle() {
        return this.props.ranking ? this.props.ranking.listname : null;
    }

    getContent() {
        if (this.props.ranking){
            switch(this.props.match.params.page) {
                case 'edit':
                    return <RankingOptions shortname={this.props.ranking.shortname} />
                default:
                    return this.getEvents();
            }
        }
    }

    render() {
        const content = this.props.match.params.testcode ? this.getResults() : this.getContent();
        return (
            <Page title={this.getTitle()} menuItems={this.getMenuItems()} icon="list-ol" >
                {content}
            </Page>
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