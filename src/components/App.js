import React from "react";
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';

// Components
import Navbar from "./Navbar";
import Frontpage from "./Frontpage";
import Footer from './Footer';
import Ranking from './RankingList/Info'

const App = () => {
    return (
        <Router history={history}>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Frontpage} />
                <Route path="/rankings/:shortname/tests/:testcode" component={Ranking} />
                <Route path="/rankings/:shortname" component={Ranking} />
            </Switch>
            <Footer />
        </Router>
    );
}

export default App;