import React, { createContext, useContext, useState } from "react";
import { HashRouter, Route, Switch } from 'react-router-dom';

// Components
import { Navbar } from "./components/Navbar";
import { Frontpage } from "./pages/Frontpage";
import Footer from './components/Footer';
import { RankingList } from './pages/RankingList/RankingList';
import { Rider } from './pages/Rider/Rider';
import { Horse } from './pages/Horse/Horse';
import { Competition } from './pages/Competition/Competition';
import { BigScreenPage } from "./pages/BigScreen/BigScreen";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faInfo, faSync, faWifi, faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch, faCalendarPlus, faTachometerAlt, faCheckCircle, faCheck, faClock, faDesktop, faBullhorn, faAddressCard, faListUl } from '@fortawesome/free-solid-svg-icons'
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { CompetitionCreate } from "./pages/CompetitionCreate/CompetitionCreate";
import { UserProvider } from "./contexts/user.context";
import { ToastProvider } from "./contexts/toast.context";
    
library.add(fab, faListOl, faUser, faHorseHead, faCalendarAlt, faQuestion, faTimes, faSearch, faCalendarPlus, faTachometerAlt, faCheck, faCheckCircle, faClock, faDesktop, faWifi, faBullhorn, faAddressCard, faListUl, faInfo, faSync);


type FullscreenContextProps = [boolean, (fullscreen: boolean) => void]

const FullscreenContext = createContext<FullscreenContextProps>([false, () => {}]);

const App: React.FC = () => {
    const [fullscreen, setFullscreen] = useState<boolean>(false);

    return (
        <FullscreenContext.Provider value={[fullscreen, setFullscreen]}>
            <ToastProvider>
                <UserProvider>
                    <HashRouter>
                        {!fullscreen && <Navbar />}
                        <Switch>
                            <Route path="/" exact component={Frontpage} />
                            <Route path="/rankinglist/:shortname" component={RankingList} />
                            <Route path="/rider/:id" component={Rider} />
                            <Route path="/horse/:id" component={Horse} />
                            <Route path="/competition/create" component={CompetitionCreate} />
                            <Route path="/competition/:id" component={Competition} />
                            <Route path="/dashboard" component={Dashboard} />
                            <Route path="/bigscreen" exact component={BigScreenPage} />
                        </Switch>
                        {!fullscreen && <Footer />}
                    </HashRouter>
                </UserProvider>
            </ToastProvider>
        </FullscreenContext.Provider>
    );
}

export const useFullscreen = (initialValue?: boolean): FullscreenContextProps => {
    const ctx = useContext(FullscreenContext);

    if (ctx === undefined) {
        throw new Error("Missing FullscreenProvider");
    }

    return ctx;
}

export default App;