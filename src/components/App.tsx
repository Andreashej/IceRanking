import React from "react";
import { HashRouter, Route, Switch } from 'react-router-dom';

// Components
import { Navbar } from "./Navbar";
import Frontpage from "../pages/Frontpage";
import Footer from './Footer';
import RankingList from '../pages/RankingList';
import Rider from '../pages/Rider';
import Horse from '../pages/Horse';
import { Competition } from '../pages/Competition/Competition';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch, faCalendarPlus, faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import Dashboard from "../pages/Dashboard";
import CompetitionCreate from "../pages/Competition/CompetitionCreate";
import { UserProvider } from "../contexts/user.context";
    
library.add(fab, faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch, faCalendarPlus, faTachometerAlt);


const App: React.FC = () => {
    return (
        <UserProvider>
            <HashRouter>
                <Navbar />
                <Switch>
                    <Route path="/" exact component={Frontpage} />
                    <Route path="/rankings/:shortname" component={RankingList} />
                    <Route path="/rider/:id" component={Rider} />
                    <Route path="/horse/:id" component={Horse} />
                    <Route path="/competition/create" component={CompetitionCreate} />
                    <Route path="/competition/:id" component={Competition} />
                    <Route path="/dashboard" component={Dashboard} />
                </Switch>
                <Footer />
            </HashRouter>
        </UserProvider>
    );
}

export default App;