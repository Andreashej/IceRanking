import React, { useMemo } from 'react';


import Page from '../../components/partials/Page';
import { Route, Switch, useParams, useHistory } from 'react-router-dom';
import { RiderResults } from './RiderResults';
import RiderInfo from './RiderInfo';
import { RiderProvider, useRiderContext } from '../../contexts/rider.context';
import { MenuItem } from 'primereact/menuitem';
import { useIsLoggedIn } from '../../contexts/user.context';
import { RiderEdit } from './RiderEdit';


const RiderPage: React.FC = ({ children }) => {
    const { resource: rider, loading, error } = useRiderContext();
    const history = useHistory();
    const isLoggedIn = useIsLoggedIn();
    const { pathname } = history.location;
    
    const title = useMemo<string | null>(() => {
        if (!loading && rider) return rider.fullname;
        if (loading) return null;
        return '404';
    },[rider, loading]);

    const subtitle = useMemo<string | null>(() => {
        if (!loading && rider) return ``;
        if (loading) return null;
        return 'Rider not found';
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
                command: () => history.push(`/rider/${rider.id}/edit`),
                className: pathname.includes("/edit") ? 'active' : ''
            },
        ]

        return [menuItems, adminItems];

    }, [rider, pathname, loading, error, history, isLoggedIn]);

    return (
        <Page title={title} subtitle={subtitle} icon="user" menuItems={menuItems} adminMenuItems={adminMenuItems}>
            {rider && children}
            {/* {!loading && !rider && <div>{error}</div>} */}
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
                    <Route path="/rider/:id/edit" component={RiderEdit} />
                </Switch>
            </RiderPage>
        </RiderProvider>
    );
}