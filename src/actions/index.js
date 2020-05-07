import rankingApi from '../apis/ranking';
import { GET_RANKINGS, GET_RANKING, GET_RANKING_TESTS, GET_RANKING_TEST, GET_RANKING_TEST_RESULTS, LOGIN, LOGOUT, GET_PROFILE, NO_USER } from './types';


export const getRankings = () => async dispatch => {
    const response = await rankingApi.get('/rankings');

    dispatch({
        type: GET_RANKINGS,
        payload: response.data
    }); 
}

export const getRanking = shortname => async dispatch => {
    const response = await rankingApi.get(`/rankings/${shortname}`);

    dispatch({
        type: GET_RANKING,
        payload: response.data
    });
}

export const getRankingTests = shortname => async dispatch => {
    const response = await rankingApi.get(`/rankings/${shortname}/tests`);

    dispatch({
        type: GET_RANKING_TESTS,
        payload: {tests: response.data.data, shortname: shortname}
    });
}

export const getRankingTest = (shortname, testcode) => async dispatch => {
    const response = await rankingApi.get(`/rankings/${shortname}/tests/${testcode}`);

    dispatch({
        type: GET_RANKING_TEST,
        payload: {test: response.data.data, shortname: shortname}
    });
}

export const getRankingTestResult = (shortname, testcode) => async dispatch => {
    const response = await rankingApi.get(`/rankings/${shortname}/tests/${testcode}/results`);

    dispatch({
        type: GET_RANKING_TEST_RESULTS,
        payload: {results: response.data.data, shortname, testcode}
    })   
}

export const login = ({username, password}) => async dispatch => {
    const response = await rankingApi.post('/login', {}, {
        auth: {
            username,
            password
        }
    });

    dispatch({
        type: LOGIN,
        payload: {user: response.data.data, token: response.data.token}
    })
}

export const logout = () => async dispatch => {
    dispatch({
        type: LOGOUT
    })
}

export const getProfile = () => async dispatch => {
    try {
        const response = await rankingApi.get('/profile');

        dispatch({
            type: GET_PROFILE,
            payload: { user: response.data.data }
        });

    } catch (error) {
        dispatch({
            type: NO_USER
        });
    }
}