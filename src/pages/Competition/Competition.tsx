import { CompetitionProvider, useCompetitionContext } from "../../contexts/competition.context"
import { useParams, Switch, Route, useHistory } from "react-router-dom";
import Page from "../../components/partials/Page";
import React, { useMemo, useState } from 'react';
import { dateToString } from "../../tools";
import { MenuItem } from "primereact/menuitem";
import { CompetitionInfo } from "./CompetitionInfo";
import { CompetitionResults } from "./CompetitionResults";
import { useIsLoggedIn } from "../../contexts/user.context";
import { CompetitionEdit } from "./CompetitionEdit";
import { CompetitionResultsUpload } from "./CompetitionResultsUpload";
import { TestEdit } from "./TestEdit";
import { PrimeIcons } from "primereact/api";
import { TestDialog } from "./TestDialog";

const CompetitionPage: React.FC = ({ children }) => {
    const { resource: competition, loading, error } = useCompetitionContext();
    const [showTestDialog, setShowTestDialog] = useState<boolean>(false);

    const isLoggedIn = useIsLoggedIn();
    
    const history = useHistory();
    const { pathname } = history.location; 

    const subtitle = useMemo<string | null>(() => {
        if (!loading && competition) return `${dateToString(competition.firstDate, 'd/m/Y')} - ${dateToString(competition.lastDate, 'd/m/Y')}`;
        if (loading) return null
        return 'Competition not found';
    },[competition, loading]);
    
    const title = useMemo<string | null>(() => {
        if (!loading && competition) return competition.name;
        if (loading) return null;
        return '404';
    },[competition, loading]);

    const [menuItems, adminMenuItems] = useMemo<[MenuItem[], MenuItem[]]>(() => {
        if (loading || error || !competition || !competition.tests) return [[], []];

        const testItems = competition.tests?.map<MenuItem>((test): MenuItem => {
            return {
                label: test.testcode,
                className: pathname.includes(`/test/${test.testcode}`) ? 'active' : '',
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

        menuItems[0].items.push({
            label: 'Create test',
            icon: PrimeIcons.PLUS,
            className: "text-success p-button-text",
            command: () => setShowTestDialog(true)
        })

        const adminItems = [
            {
                label: "Edit competition",
                className: pathname.includes(`/edit`) ? 'active' : '',
                command: () => history.push(`/competition/${competition?.id}/edit`)
            },
            {
                label: "Upload results",
                className: pathname.includes(`/upload`) ? 'active' : '',
                command: () => history.push(`/competition/${competition?.id}/upload`)
            },
        ]

        return [menuItems, adminItems];
    }, [competition, loading, error, history, isLoggedIn, pathname]);

    return (
        <>
            <Page title={title} icon="calendar-alt" subtitle={subtitle} menuItems={menuItems} adminMenuItems={adminMenuItems}>
                {competition && children}
                {!loading && !competition && <div>{error}</div>}
            </Page>
            <TestDialog visible={showTestDialog} onHide={() => setShowTestDialog(false)}></TestDialog>
        </>
    )
}

export const Competition: React.FC = () => {
    const { id } = useParams<{id: string}>();
    
    return (
        <CompetitionProvider competitionId={parseInt(id)}>
            <CompetitionPage>
                <Switch>
                    <Route exact path="/competition/:id" component={CompetitionInfo} />
                    <Route exact path="/competition/:id/edit" component={CompetitionEdit} />
                    <Route exact path="/competition/:id/upload" component={CompetitionResultsUpload} />
                    <Route exact path="/competition/:id/test/:testcode/edit" component={TestEdit} />
                    <Route path="/competition/:id/test/:testcode" component={CompetitionResults} />
                </Switch>
            </CompetitionPage>    
        </CompetitionProvider>
    )
}