import ReactGA from 'react-ga';

import history from './history';

const trackingId = "2250194851";

ReactGA.initialize(trackingId);

history.listen(location => {
    ReactGA.set( { page: location.hash });
    ReactGA.pageview(location.hash)
});