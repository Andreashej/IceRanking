import { GET_RANKINGS, GET_RANKING, GET_RANKING_TESTS, GET_RANKING_TEST, GET_RANKING_TEST_RESULTS } from '../actions/types';
import _ from 'lodash';

export default ( state = {}, action) => {
    let currentRanking;
    switch(action.type) {
        case GET_RANKINGS:
            return { ...state, ..._.mapKeys(action.payload.data,'shortname') };
        case GET_RANKING:
            return { ...state, [action.payload.data.shortname]: action.payload.data};
        case GET_RANKING_TESTS:
            currentRanking = {...state[action.payload.shortname]};

            currentRanking.tests = {..._.mapKeys(action.payload.tests,'testcode')};

            return { ...state, [action.payload.shortname]: currentRanking };
        case GET_RANKING_TEST:
            currentRanking = {...state[action.payload.shortname]};

            currentRanking.tests = {...currentRanking.tests, [action.payload.test.testcode]: action.payload.test};

            return { ...state, [action.payload.shortname]: currentRanking};
        case GET_RANKING_TEST_RESULTS:
            currentRanking = {...state[action.payload.shortname]};
            
            let currentTest = currentRanking.tests[action.payload.testcode];
            currentTest = {...currentTest, results: action.payload.results};

            currentRanking.tests = {...currentRanking.tests, [action.payload.testcode]: currentTest};

            return {...state, [action.payload.shortname]: currentRanking};
        default:
            return state
    }
}