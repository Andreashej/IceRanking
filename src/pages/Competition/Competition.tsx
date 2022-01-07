import { CompetitionProvider, useCompetitionContext } from "../../contexts/competition.context"
import { RouteComponentProps, Switch, Route, useHistory, useParams } from "react-router-dom";
import Page from "../../components/partials/Page";
import React, { useMemo } from 'react';
import { dateToString } from "../../tools";
import { MenuItem } from "primereact/menuitem";
import CompetitionInfo from "./CompetitionInfo";
import { CompetitionResults } from "./CompetitionResults";
import { useIsLoggedIn } from "../../contexts/user.context";

const CompetitionPage: React.FC = ({ children }) => {
    const { competition, loading, error } = useCompetitionContext();

    const isLoggedIn = useIsLoggedIn();
    
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

    const [menuItems, adminMenuItems] = useMemo<[MenuItem[], MenuItem[]]>(() => {
        if (loading || error || !competition || !competition.tests) return [[], []];

        const testItems = competition.tests?.map((test): MenuItem => {
            return {
                label: test.testcode,
                className: history.location.pathname.includes(`/test/${test.testcode}`) ? 'active' : '',
                command: () => history.push(`/competition/${competition.id}/test/${test.testcode}`)
            };
        });

        const menuItems = [
            {
                label: "Results",
                items: testItems,
            }
        ];

        if (!isLoggedIn) return [menuItems, []];

        const adminItems = [
            {
                label: "Edit competition",
                command: () => history.push(`/competition/${competition?.id}/`)
            },
            {
                label: "Upload results",
            },
        ]

        return [menuItems, adminItems];
    }, [competition, loading, error, history, isLoggedIn, history.location.pathname]);

    return (
        <Page title={title} icon="calendar-alt" subtitle={subtitle} menuItems={menuItems} adminMenuItems={adminMenuItems}>
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
                    <Route exact path="/competition/edit" component={CompetitionInfo} />
                    <Route exact path="/competition/upload" component={CompetitionInfo} />
                    <Route path="/competition/:id/test/:testcode" component={CompetitionResults} />
                </Switch>
            </CompetitionPage>    
        </CompetitionProvider>
    )
}