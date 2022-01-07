import React from 'react';
import { Redirect, Switch, Route, useHistory } from 'react-router-dom';
import Page from '../../components/partials/Page';
import TaskManager from './TaskManager';
import CompetitionList from './CompetitionList';
import ErrorLog from './ErrorLog';
import { MenuItem } from 'primereact/menuitem';
import { useIsLoggedIn } from '../../contexts/user.context';

export const Dashboard: React.FC = () => {
    const isLoggedIn = useIsLoggedIn();
    const history = useHistory();

    const menuItems: MenuItem[] = [
        {
            label: "Competitions",
            command: () => {
                history.push("/dashboard");
            }
        },
        {
            label: "Tasks",
            command: () => {
                history.push("/dashboard/tasks")
            }
        },
        {
            label: "Error Log",
            command: () => {
                history.push("/dashboard/errors")
            }
        }
    ];

    if (!isLoggedIn) {
        return <Redirect to="/" />
    }

    return (
        <Page title="Dashboard" icon="tachometer-alt" menuItems={menuItems}>
            <Switch>
                <Route exact path="/dashboard" component={CompetitionList} />
                <Route path="/dashboard/tasks" component={TaskManager} />
                <Route path="/dashboard/errors" component={ErrorLog} />
            </Switch>
        </Page>
    );
}