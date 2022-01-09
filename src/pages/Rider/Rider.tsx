import React, { useMemo } from 'react';


import Page from '../../components/partials/Page';
import { Route, Switch, useParams, useHistory } from 'react-router-dom';
import RiderResults from './RiderResults';
import RiderInfo from './RiderInfo';
import RiderSettings from './admin/RiderSettings';
import { RiderProvider, useRiderContext } from '../../contexts/rider.context';
import { MenuItem } from 'primereact/menuitem';
import { useIsLoggedIn } from '../../contexts/user.context';


const RiderPage: React.FC = ({ children }) => {
    const { resource: rider, loading, error } = useRiderContext();
    const history = useHistory();
    const isLoggedIn = useIsLoggedIn();
    const { pathname } = history.location;
    
    const title = useMemo<string>(() => {
        if (!loading && rider) return rider.fullname;
        if (loading) return 'Loading'
        return 'Not found';
    },[rider, loading]);

    const [menuItems, adminMenuItems] = useMemo<[MenuItem[], MenuItem[]]>(() => {
        if (loading || error || !rider) return [[], []];

        const tests = rider.testlist.map<MenuItem>((testcode): MenuItem => {
            return {
                label: testcode,
                className: pathname.includes(`results/${testcode}`) ? 'active' : '',
                command: () => history.push(`/rider/${rider.id}/results/${testcode}`)
            };
        });

        const menuItems = [
            {
                label: "Results",
                items: tests
            }
        ];

        if (!isLoggedIn) return [menuItems, []];

        const adminItems = [
            {
                label: "Edit rider",
                command: () => history.push(`/rider/${rider.id}/admin/edit`),
                className: pathname.includes("/admin/edit") ? 'active' : ''
            },
        ]

        return [menuItems, adminItems];

    }, [rider, pathname, loading, error, history, isLoggedIn]);

    return (
        <Page title={title} icon="user" menuItems={menuItems} adminMenuItems={adminMenuItems}>
            {children}
        </Page>
    )
}

export const Rider: React.FC = () => {
    const { id } = useParams<{id: string}>();
    return (
        <RiderProvider riderId={parseInt(id)}>
            <RiderPage>
                <Switch>
                    <Route exact path="/rider/:id" component={RiderInfo} />
                    <Route path="/rider/:id/results/:testcode" component={RiderResults} />
                    <Route path="/rider/:id/admin/edit" component={RiderSettings} />
                </Switch>
        </RiderPage>
        </RiderProvider>
    );
}