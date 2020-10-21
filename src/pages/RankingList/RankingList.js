import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { getRanking, getRankingTests, getProfile } from '../../actions';

import TestResults from './TestResults';
import RankingEvents from './RankingEvents';
import Page from '../../components/partials/Page';
import RankingOptions from './admin/RankingOptions';
import RankingTestDefinitions from './admin/RankingTestDefinitions';

class RankingList extends React.Component {
    mobileMenu;

    componentDidMount() {
        const { shortname } = this.props.match.params;

        this.props.getRanking(shortname);
        this.props.getProfile();
    }

    componentDidUpdate() {
        const { shortname } = this.props.match.params;

        if(this.props.ranking && this.props.ranking.tests[0]) {
            this.props.getRankingTests(shortname);
        }

    }

    getMenuItems() {
        let tests = [];
        if (this.props.ranking) {
            tests = Object.entries(this.props.ranking.tests).map(([testcode, test]) => {
                const url = `/rankings/${this.props.match.params.shortname}/tests/${test.testcode}`;
                return {
                    label: test.testcode,
                    command: () => this.props.history.push(url),
                    id: test.id,
                    className: url === this.props.currentPage ? 'active' : null
                }
            });
        }
        const eventUrl = `/rankings/${this.props.match.params.shortname}`;
        let menuModel = [
            {
                label: "Events",
                command: () => this.props.history.push(eventUrl),
                className: eventUrl === this.props.currentPage ? 'active' : null
            },
            {
                label: "Tests",
                items: tests
            }
        ];

        return menuModel;
    }

    getAdminMenuItems() {
        if (this.props.currentUser) {
            return [
                {
                    label: "Edit ranking",
                    command: () => this.props.history.push(`/rankings/${this.props.match.params.shortname}/admin/edit`),
                    className: "edit" === this.props.match.params.page ? 'active' : null
                },
                {
                    label: "Test definitions",
                    command: () => this.props.history.push(`/rankings/${this.props.match.params.shortname}/admin/testedit`),
                    className: "testedit" === this.props.match.params.page ? 'active' : null
                },
            ];
        }
    }

    getTitle() {
        return this.props.ranking ? this.props.ranking.listname : null;
    }

    render() {
        return (
            <Page title={this.getTitle()} menuItems={this.getMenuItems()} adminMenuItems={this.getAdminMenuItems()} icon="list-ol" >
                <Switch>
                    <Route exact path="/rankings/:shortname" component={RankingEvents} />
                    <Route path="/rankings/:shortname/tests/:testcode" component={TestResults} />
                    <Route path="/rankings/:shortname/admin/edit" component={RankingOptions} />
                    <Route path="/rankings/:shortname/admin/testedit" component={RankingTestDefinitions} />
                </Switch>
            </Page>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ranking: state.rankings[ownProps.match.params.shortname],
        currentUser: state.users.currentUser,
        currentPage: state.navigation.currentPage
    }
}

export default withRouter(connect(mapStateToProps, { getRanking, getRankingTests, getProfile })(RankingList));