import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';

import { getRanking, getRankingTests, getProfile } from '../../actions';

import TestResults from './TestResults';
import RankingEvents from './RankingEvents';
import Page from '../../components/partials/Page';
import RankingOptions from './admin/RankingOptions';
import RankingTestDefinitions from './admin/RankingTestDefinitions';
import RankingImports from './admin/RankingImports';
import history from '../../history';

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
                return {
                    label: test.testcode,
                    command: () => this.props.history.push(`/rankings/${this.props.match.params.shortname}/tests/${test.testcode}`),
                    id: test.id,
                    className: history.location.hash.includes(testcode) ? 'active' : null,
                }
            });
        }
        const eventUrl = `/rankings/${this.props.match.params.shortname}`;
        let menuModel = [
            {
                label: "Events",
                command: () => this.props.history.push(eventUrl),
                className: eventUrl === history.location.hash.slice(1) ? 'active' : null
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
                    className: history.location.hash.includes("/admin/edit") ? 'active' : null
                },
                {
                    label: "Test definitions",
                    command: () => this.props.history.push(`/rankings/${this.props.match.params.shortname}/admin/testedit`),
                    className: history.location.hash.includes("/admin/testedit") ? 'active' : null
                },
                {
                    label: "Import",
                    command: () => this.props.history.push(`/rankings/${this.props.match.params.shortname}/admin/import`),
                    className: history.location.hash.includes("/admin/import") ? 'active' : null
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
                    <Route path="/rankings/:shortname/admin/import" component={RankingImports} />
                </Switch>
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

export default withRouter(connect(mapStateToProps, { getRanking, getRankingTests, getProfile })(RankingList));