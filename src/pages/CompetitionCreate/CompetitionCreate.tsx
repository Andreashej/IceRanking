import React from 'react';
import Page from '../../components/partials/Page';
import { CompetitionSetup } from './CompetitionSetup';

export const CompetitionCreate: React.FC = () => {

    return (
        <Page title="Create Competition" icon="calendar-alt" >
            <CompetitionSetup />
        </Page>
    )
}