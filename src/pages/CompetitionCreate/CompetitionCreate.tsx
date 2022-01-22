
import { MenuItem } from 'primereact/menuitem';
import React, { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Page from '../../components/partials/Page';
import { Competition } from '../../models/competition.model';
import { CompetitionSetup } from './CompetitionSetup';
import { TestsSetup } from './TestsSetup';

export const CompetitionCreate: React.FC = () => {
    const [competition, setCompetition] = useState<Competition>();
    const history = useHistory();

    const menuItems: MenuItem[] = [
        {
            label: "1. Create competition"
        },
        {
            label: "2. Assign tests",
            disabled: !competition,
        }
    ]

    const onCompetitionCreated = (competition: Competition): void => {
        setCompetition(competition);
        history.push(`/competition/create/${competition.id}/tests`);
    }

    return (
        <Page title="Create Competition" icon="calendar-alt" menuItems={menuItems} >
            <Switch>
                <Route exact path="/competition/create" component={() => <CompetitionSetup onCreated={onCompetitionCreated} />} />
                <Route exact path="/competition/create/:id/tests" component={() => <TestsSetup competition={competition} setCompetition={setCompetition} />} />
            </Switch>
        </Page>
    )
}