import React from "react";
import { HashRouter, Route, Switch } from 'react-router-dom';

// Components
import Navbar from "./Navbar";
import Frontpage from "../pages/Frontpage";
import Footer from './Footer';
import RankingList from '../pages/RankingList';
import Rider from '../pages/Rider';
import Horse from '../pages/Horse';
import Competition from '../pages/Competition';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch, faCalendarPlus } from '@fortawesome/free-solid-svg-icons'
    
library.add(fab, faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch, faCalendarPlus);


const App = () => {
    return (
        <HashRouter>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Frontpage} />
                <Route path="/rankings/:shortname" component={RankingList} />
                <Route path="/rider/:id" component={Rider} />
                <Route path="/horse/:id" component={Horse} />
                <Route path="/competition/:id" component={Competition} />
            </Switch>
            <Footer />
        </HashRouter>
    );
}

export default App;