import { CompetitionProvider, useCompetitionContext } from "../../contexts/competition.context"
import { useParams, Switch, Route, useHistory } from "react-router-dom";
import Page from "../../components/partials/Page";
import React, { useMemo, useState } from 'react';
import { dateToString } from "../../tools";
import { MenuItem } from "primereact/menuitem";
import { CompetitionInfo } from "./CompetitionInfo";
import { CompetitionResults } from "./CompetitionResults";
import { CompetitionEdit } from "./CompetitionEdit";
import { CompetitionResultsUpload } from "./CompetitionResultsUpload";
import { TestEdit } from "./TestEdit";
import { PrimeIcons } from "primereact/api";
import { TestDialog } from "./TestDialog";
import { BigScreenController } from "../BigScreen/BigScreenController";
import { ScreenGroupSetup } from "./ScreenGroupSetup/ScreenGroupSetup";
import { CompetitionAdmins } from "./CompetitionAdmins";

const CompetitionPage: React.FC = ({ children }) => {
    const { resource: competition, loading, error } = useCompetitionContext();
    const [showTestDialog, setShowTestDialog] = useState<boolean>(false);
    
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
            const path = `/competition/${competition.id}/test/${test.testName}`;
            const matchPaths = [path, path + '/edit']
            
            return {
                label: test.testName,
                className: matchPaths.includes(pathname) ? 'active' : '',
                command: () => history.push(path)
            };
        });

        const menuItems = [
            {
                label: "Results",
                items: testItems,
            }
        ];

        if (!competition.isAdmin) return [menuItems, []];

        menuItems[0].items.push({
            label: 'Create test',
            icon: PrimeIcons.PLUS,
            className: "text-success p-button-text",
            command: () => setShowTestDialog(true)
        })

        const adminItems = [
            {
                label: "Edit competition",
                className: pathname === `/competition/${competition?.id}/edit` ? 'active' : '',
                command: () => history.push(`/competition/${competition?.id}/edit`)
            },
            {
                label: "Admins",
                className: pathname === `/competition/${competition?.id}/admins` ? 'active' : '',
                command: () => history.push(`/competition/${competition?.id}/admins`)
            },
            {
                label: "Upload results",
                className: pathname.includes(`/upload`) ? 'active' : '',
                command: () => history.push(`/competition/${competition?.id}/upload`)
            },
            {
                label: "Bigscreen",
                className: pathname.includes(`/screengroups`) ? 'active' : '',
                command: () => history.push(`/competition/${competition?.id}/screengroups`)
            },
        ]

        return [menuItems, adminItems];
    }, [competition, loading, error, history, pathname]);

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
                    <Route path="/competition/:id/screengroups" component={ScreenGroupSetup} />
                    <Route path="/competition/:id/bigscreencontroller/:screenGroupId" component={BigScreenController} />
                    <Route path="/competition/:id/admins" component={CompetitionAdmins} />
                </Switch>
            </CompetitionPage>    
        </CompetitionProvider>
    )
}