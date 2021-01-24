import ReactGA from 'react-ga';

import history from './history';

const trackingId = process.env.REACT_APP_GA_TRACKING_ID

ReactGA.initialize(trackingId);

history.listen(location => {
    ReactGA.set( { page: location.hash });
    ReactGA.pageview(location.hash)
});