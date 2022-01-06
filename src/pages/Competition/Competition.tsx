import { CompetitionProvider, useCompetitionContext } from "../../contexts/competition.context"
import { RouteComponentProps, Switch, Route, useHistory } from "react-router-dom";
import Page from "../../components/partials/Page";
import React, { useEffect, useMemo } from 'react';
import { dateToString } from "../../tools";
import { MenuItem } from "primereact/menuitem";
import CompetitionInfo from "./CompetitionInfo";
import { CompetitionResults } from "./CompetitionResults";
import { getProfile, logout, login } from "../../services/v2/auth.service";

const CompetitionPage: React.FC = ({ children }) => {
    const { competition, loading, error } = useCompetitionContext();

    useEffect(() => {
        // login("andreashej", "12345678");
        logout();
    },[]);

    const history = useHistory();

    const subtitle = useMemo<string>(() => {
        if (!loading && competition) return `${dateToString(competition.firstDate, 'd/m/Y')} - ${dateToString(competition.lastDate, 'd/m/Y')}`;
        if (loading) return 'Loading'
        return '';
    },[competition, loading]);
    
    const title = useMemo<string>(() => {
        if (!loading && competition) return competition.name;
        if (loading) return 'Loading'
        return 'Not found';
    },[competition, loading]);

    const menuItems = useMemo<MenuItem[]>(() => {
        if (loading || error || !competition || !competition.tests) return [];

        const testItems = competition.tests?.map((test): MenuItem => {
            return {
                label: test.testcode,
                className: history.location.hash.includes(test.testcode) ? 'active' : '',
                command: () => history.push(`/competition/${competition.id}/test/${test.testcode}`)
            };
        });

        return [
            {
                label: "Results",
                items: testItems,
            }
        ]
    }, [competition,loading]);

    return (
        <Page title={title} icon="calendar-alt" subtitle={subtitle} menuItems={menuItems}>
            {competition && children}
            {!loading && !competition && <div>{error}</div>}
        </Page>
    )
}

export const Competition: React.FC<RouteComponentProps<{id: string}>> = (props) => {
    return (
        <CompetitionProvider competitionId={parseInt(props.match.params.id)}>
            <CompetitionPage>
                <Switch>
                    <Route exact path="/competition/:id" component={CompetitionInfo} />
                    <Route path="/competition/:id/test/:testcode" component={CompetitionResults} />
                </Switch>
            </CompetitionPage>    
        </CompetitionProvider>
    )
}