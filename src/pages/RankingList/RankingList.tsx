import React, { useMemo } from 'react';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';

import { RankingResults } from './RankingResults';
import { RankingEvents } from './RankingEvents';
import Page from '../../components/partials/Page';
import RankingTestDefinitions from './admin/RankingTestDefinitions';
import { RankingListProvider, useRankingListContext } from '../../contexts/rankinglist.context';
import { useIsLoggedIn } from '../../contexts/user.context';
import { MenuItem } from 'primereact/menuitem';
import { RankingListEdit } from './admin/RankingListEdit';
import { RankingEdit } from './admin/RankingEdit';
import { PrimeIcons } from 'primereact/api';

const RankingListPage: React.FC = ({children}) => {
    const { resource: rankingList, loading, error } = useRankingListContext()
    const isLoggedIn = useIsLoggedIn();
    const history = useHistory();
    const { pathname } = history.location;

    const title = useMemo<string | null>(() => {
        if (!loading && rankingList) return rankingList.listname;
        if (loading) return null;
        
        return '404';
    }, [rankingList, loading])

    const subtitle = useMemo<string | null>(() => {
        if (!loading && rankingList) return rankingList.shortname;
        if (loading) return null
        return 'Ranking List not found';
    },[rankingList, loading]);

    const [menuItems, adminMenuItems] = useMemo<[MenuItem[], MenuItem[]]>(() => {
        if (loading || error || !rankingList || !rankingList.tests) return [[], []];

        const testItems = rankingList.tests.map<MenuItem>((ranking): MenuItem => {
            const url = `/rankinglist/${rankingList.shortname}/ranking/${ranking.testcode}`;
            return {
                label: ranking.testcode,
                className: pathname.includes(url) ? 'active' : '',
                command: () => history.push(url)
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
            label: 'Create ranking',
            icon: PrimeIcons.PLUS,
            command: () => history.push(`/rankinglist/${rankingList.shortname}/ranking/create`)
        })
        
        const url = `/rankinglist/${rankingList.shortname}/edit`;

        const adminItems = [
            {
                label: "Edit Ranking List",
                className: pathname === url ? 'active' : '',
                command: () => history.push(url)
            }
        ]

        return [menuItems, adminItems];
    }, [rankingList, loading, error, history, isLoggedIn, pathname]);

    return (
        <Page title={title} subtitle={subtitle} menuItems={menuItems} adminMenuItems={adminMenuItems} icon="list-ol">
            {children}
        </Page>
    )

}

export const RankingList: React.FC = () => {
    const { shortname } = useParams<{shortname: string}>();

    return (
        <RankingListProvider rankingListShortname={shortname}>
            <RankingListPage>
                <Switch>
                    <Route exact path="/rankinglist/:shortname" component={RankingEvents} />
                    <Route exact path="/rankinglist/:shortname/ranking/create" component={RankingEdit} />
                    <Route exact path="/rankinglist/:shortname/ranking/:testcode" component={RankingResults} />
                    <Route path="/rankinglist/:shortname/edit" component={RankingListEdit} />
                    <Route path="/rankinglist/:shortname/ranking/:testcode/edit" component={RankingEdit} />
                </Switch>
            </RankingListPage>
        </RankingListProvider>
    );
}