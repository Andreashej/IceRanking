import React from "react";
import { HashRouter, Route, Switch } from 'react-router-dom';

// Components
import { Navbar } from "./components/Navbar";
import { Frontpage } from "./pages/Frontpage";
import Footer from './components/Footer';
import { RankingList } from './pages/RankingList/RankingList';
import { Rider } from './pages/Rider/Rider';
import { Horse } from './pages/Horse/Horse';
import { Competition } from './pages/Competition/Competition';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch, faCalendarPlus, faTachometerAlt, faCheckCircle, faCheck, faClock } from '@fortawesome/free-solid-svg-icons'
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { CompetitionCreate } from "./pages/CompetitionCreate/CompetitionCreate";
import { UserProvider } from "./contexts/user.context";
import { ToastProvider } from "./contexts/toast.context";
    
library.add(fab, faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch, faCalendarPlus, faTachometerAlt, faCheck, faCheckCircle, faClock);


const App: React.FC = () => {
    return (
        <ToastProvider>
            <UserProvider>
                <HashRouter>
                    <Navbar />
                    <Switch>
                        <Route path="/" exact component={Frontpage} />
                        <Route path="/rankinglist/:shortname" component={RankingList} />
                        <Route path="/rider/:id" component={Rider} />
                        <Route path="/horse/:id" component={Horse} />
                        <Route path="/competition/create" component={CompetitionCreate} />
                        <Route path="/competition/:id" component={Competition} />
                        <Route path="/dashboard" component={Dashboard} />
                    </Switch>
                    <Footer />
                </HashRouter>
            </UserProvider>
        </ToastProvider>
    );
}

export default App;