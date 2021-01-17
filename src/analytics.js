import ReactGA from 'react-ga';

import history from './history';

const trackingId = "G-H0JE6G4T3S";

ReactGA.initialize(trackingId);

history.listen(location => {
    ReactGA.set( { page: location.pathname });
    ReactGA.pageview(location.pathname)
});