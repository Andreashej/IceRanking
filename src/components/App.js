import React from "react";
import { HashRouter, Route, Switch } from 'react-router-dom';

import history from '../history';

// Components
import Navbar from "./Navbar";
import Frontpage from "./Frontpage";
import Footer from './Footer';
import Ranking from './RankingList/Info';
import RiderProfile from './Rider/RiderProfile';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
 
library.add(fab, faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch);


const App = () => {
    return (
        <HashRouter history={history}>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Frontpage} />
                <Route path="/rankings/:shortname/tests/:testcode" component={Ranking} />
                <Route path="/rankings/:shortname/:page" component={Ranking} />
                <Route path="/rankings/:shortname" component={Ranking} />
                <Route path="/rider/:id/:page/:testcode" component={RiderProfile} />
                <Route path="/rider/:id" component={RiderProfile} />
            </Switch>
            <Footer />
        </HashRouter>
    );
}

export default App;