import React, { useMemo } from 'react';


import Page from '../../components/partials/Page';
import { HorseResults } from './HorseResults';
import HorseInfo from './HorseInfo';

import { Route, Switch, useParams, useHistory } from 'react-router-dom';
import { HorseProvider, useHorseContext } from '../../contexts/horse.context';
import { MenuItem } from 'primereact/menuitem';
import { useProfile } from '../../contexts/user.context';

const HorsePage: React.FC = ({children}) => {
    const { resource: horse, loading, error } = useHorseContext();
    const history = useHistory();
    const { pathname } = history.location;
    const [user] = useProfile();


    const title = useMemo<string | null>(() => {
        if (!loading && horse) return horse.horseName;
        if (loading) return null;
        return '404';
    },[horse, loading]);

    const subtitle = useMemo<string | null>(() => {
        if (!loading && horse) return horse.feifId;
        if (loading) return null;
        return 'Horse not found';
    },[horse, loading]);

    const [menuItems, adminMenuItems] = useMemo<[MenuItem[], MenuItem[]]>(() => {
        if (loading || error || !horse) return [[], []];

        const tests = horse.testlist.map<MenuItem>((testcode): MenuItem => {
            const url = `/horse/${horse.id}/results/${testcode}`;
            return {
                label: testcode,
                className: pathname === url ? 'active' : '',
                command: () => history.push(url)
            };
        });

        const menuItems = [
            {
                label: "Results",
                items: tests
            }
        ];

        if (!user?.superUser) return [menuItems, []];

        // const adminItems = [
            // {
            //     label: "Edit rider",
            //     command: () => history.push(`/rider/${horse.id}/edit`),
            //     className: pathname.includes("/admin/edit") ? 'active' : ''
            // },
        // ]

        return [menuItems, []];

    }, [horse, pathname, loading, error, history, user]);

    return (
        <Page title={title} subtitle={subtitle} icon="horse-head" menuItems={menuItems} adminMenuItems={adminMenuItems}>
            {children}
        </Page>
    )
}

export const Horse: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    return (
        <HorseProvider horseId={parseInt(id)}>
            <HorsePage>
                <Switch>
                    <Route exact path="/horse/:id" component={HorseInfo} />
                    <Route path="/horse/:id/results/:testcode" component={HorseResults} />
                </Switch>
            </HorsePage>
        </HorseProvider>
    )
}