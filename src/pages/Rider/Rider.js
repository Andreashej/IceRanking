import React from 'react';


import Page from '../../components/partials/Page';
import { connect } from 'react-redux';

import { getRider } from '../../actions';
import { Route, Switch, withRouter } from 'react-router-dom';
import RiderResults from './RiderResults';
import RiderInfo from './RiderInfo';
import RiderSettings from './admin/RiderSettings';
import history from '../../history';


class Rider extends React.Component {
    
    componentDidMount() {
        this.props.getRider(this.props.match.params.id);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.getRider(this.props.match.params.id);
        }
    }

    getMenuItems() {
        const tests = this.props.rider ? this.props.rider.testlist.map( testcode => {
            return {
                label: testcode,
                className: this.props.match.params.testcode === testcode ? 'active' : null,
                command: () => this.props.history.push(`/rider/${this.props.rider.id}/results/${testcode}`)
            };
        }) : [];

        return [
            {
                label: "Results",
                items: tests
            }
        ];
    }

    getAdminMenuItems() {
        if(this.props.currentUser) {
            return [
                {
                    label: "Edit rider",
                    command: () => this.props.history.push(`/rider/${this.props.match.params.id}/admin/edit`),
                    className: history.location.hash.includes("/admin/edit") ? 'active' : null
                },
            ]
        }
    }
    

    getFullName() {
        return this.props.rider ? `${this.props.rider.firstname} ${this.props.rider.lastname}` : null;
    }

    getTitle() {
        switch(this.props.match.params.page) {
            case "results":
                return `${this.props.match.params.testcode} results`;
            default:
                return "Overview";
        }
    }

    render() {
        return (
            <Page title={this.getFullName()} icon="user" menuItems={this.getMenuItems()} adminMenuItems={this.getAdminMenuItems()}>
                <Switch>
                    <Route exact path="/rider/:id" component={RiderInfo} />
                    <Route path="/rider/:id/results/:testcode" component={RiderResults} />
                    <Route path="/rider/:id/admin/edit" component={RiderSettings} />
                </Switch>
           </Page>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        rider: state.riders[ownProps.match.params.id],
        currentUser: state.users.currentUser
    }
}

export default withRouter(connect(mapStateToProps, { getRider })(Rider));