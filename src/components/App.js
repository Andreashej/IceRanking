import React from "react";
import { HashRouter, Route, Switch } from 'react-router-dom';

// Components
import Navbar from "./Navbar";
import Frontpage from "./Frontpage";
import Footer from './Footer';
import Ranking from './RankingList/RankingList';
import RiderProfile from './Rider/RiderProfile';
import HorseProfile from './Horse/HorseProfile';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
    
library.add(fab, faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch);


const App = () => {
    return (
        <HashRouter>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Frontpage} />
                <Route path="/rankings/:shortname" component={Ranking} />
                <Route path="/rider/:id/:page/:testcode" component={RiderProfile} />
                <Route path="/rider/:id" component={RiderProfile} />
                <Route path="/horse/:id/:page/:testcode" component={HorseProfile} />
                <Route path="/horse/:id" component={HorseProfile} />
            </Switch>
            <Footer />
        </HashRouter>
    );
}

export default App;