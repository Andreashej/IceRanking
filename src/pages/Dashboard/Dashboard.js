import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, Route } from 'react-router-dom';
import { getProfile } from '../../actions';
import Page from '../../components/partials/Page';
import TaskManager from './TaskManager';
import CompetitionList from './CompetitionList';
import ErrorLog from './ErrorLog';

class Dashboard extends React.Component {
    state = {
        hasLoaded: false,
        competitions: [],
        tasks: {

        }
    }

    componentDidMount() {
        this.props.getProfile().then(() => {
            this.setState({ hasLoaded: true })
        });
    }

    getMenuItems() {
        return [
            {
                label: "Competitions",
                command: () => {
                    this.props.history.push("/dashboard");
                }
            },
            {
                label: "Tasks",
                command: () => {
                    this.props.history.push("/dashboard/tasks")
                }
            },
            {
                label: "Error Log",
                command: () => {
                    this.props.history.push("/dashboard/errors")
                }
            }
        ]
    }

    render() {
        if (this.state.hasLoaded && !this.props.user) {
            return <Redirect path="/" />
        }

        return (
            <Page title="Dashboard" icon="tachometer-alt" menuItems={this.getMenuItems()}>
                <Switch>
                    <Route exact path="/dashboard" component={CompetitionList} />
                    <Route path="/dashboard/tasks" component={TaskManager} />
                    <Route path="/dashboard/errors" component={ErrorLog} />
                </Switch>
            </Page>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.users.currentUser
    }
}

export default connect(mapStateToProps, { getProfile })(Dashboard);