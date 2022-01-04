import rankingApi from '../apis/ranking';
import authService from '../services/v1/auth.service';
import rankingListService from '../services/v1/rankings.service';
import riderService from '../services/v1/rider.service'
import { GET_RANKINGS, GET_RANKING, GET_RANKING_TESTS, GET_RANKING_TEST, UPDATE_RANKING_TEST, GET_RANKING_TEST_RESULTS, LOGIN, LOGOUT, GET_PROFILE, NO_USER, GET_RIDER, GET_RIDER_RESULTS, UPDATE_RANKING, GET_HORSE, GET_HORSE_RESULTS, CREATE_RANKING_TEST, GET_COMPETITION, GET_TEST, GET_TEST_CATALOG, GET_TEST_DEFINITION, CREATE_COMPETITION, RECOMPUTE_RANKING_RESULTS, GET_TASK, UPDATE_RIDER } from './types';

// Ranking actions

export const getRankings = () => async dispatch => {
    const rankingLists = await rankingListService.getAllRankingLists();

    dispatch({
        type: GET_RANKINGS,
        payload: rankingLists
    }); 
}

export const getRanking = shortname => async dispatch => {
    const rankingList = await rankingListService.getRankingList(shortname);

    dispatch({
        type: GET_RANKING,
        payload: rankingList
    });
}

export const updateRanking = (shortname, atts) => async dispatch => {
    const rankingList = await rankingApi.patch(`/rankings/${shortname}`, atts);

    dispatch({
        type: UPDATE_RANKING,
        payload: rankingList
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

export const createRankingTest = (shortname, atts) => async dispatch => {
    const response = await rankingApi.post(`/rankings/${shortname}/tests`, atts);

    dispatch({
        type: CREATE_RANKING_TEST,
        payload: {test: response.data.data, shortname: shortname}
    });
}

export const updateRankingTest = (id, atts) => async dispatch => {
    const response = await rankingApi.patch(`/rankingtest/${id}`, atts);

    dispatch({
        type: UPDATE_RANKING_TEST,
        payload: {test: response.data.data, shortname: response.data.data.shortname}
    });
}

export const getRankingTestResult = (shortname, testcode) => async dispatch => {
    const response = await rankingApi.get(`/rankings/${shortname}/tests/${testcode}/results`);

    dispatch({
        type: GET_RANKING_TEST_RESULTS,
        payload: {results: response.data.data, shortname, testcode}
    })   
}

export const recomputeRankingTestResult = (shortname, testcode) => async dispatch => {
    const response = await rankingApi.post(`/rankings/${shortname}/tests/${testcode}/results`);

    dispatch({
        type: RECOMPUTE_RANKING_RESULTS,
        payload: { task: response.data.data, shortname, testcode }
    })
}


// User actions

export const login = ({username, password}) => async dispatch => {
    const user = await authService.login(username, password)

    dispatch({
        type: LOGIN,
        payload: { user: user }
    })
}

export const logout = () => async dispatch => {
    await authService.logout();
    
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

// Rider actions

export const getRider = (id) => async dispatch => {
    const rider = await riderService.getRider(id);

    dispatch({
        type: GET_RIDER,
        payload: rider
    });
}

export const updateRider = (id, payload) => async dispatch => {
    const rider = await riderService.updateRider(id, payload);

    dispatch({
        type: UPDATE_RIDER,
        payload: rider
    });
}

export const getRiderResults = (id, testcode) => async dispatch => {
    try {
        const response = await rankingApi.get(`/riders/${id}/results/${testcode}`);

        dispatch({
            type: GET_RIDER_RESULTS,
            payload: {
                id: id,
                testcode: testcode,
                results: response.data.data,
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// Horse actions

export const getHorse = (id) => async (dispatch) => {
    const response = await rankingApi.get(`/horses/${id}`);

    dispatch({
        type: GET_HORSE,
        payload: response.data.data
    });
}

export const getHorseResults = (id, testcode) => async (dispatch) => {
    try {
        const response = await rankingApi.get(`/horses/${id}/results/${testcode}`);
    
        dispatch({
            type: GET_HORSE_RESULTS,
            payload: {
                id: id,
                testcode: testcode,
                result: response.data.data
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// Competition actions

export const getCompetition = (id) => async (dispatch) => {
    try {
        const response = await rankingApi.get(`/competitions/${id}`);

        dispatch({
            type: GET_COMPETITION,
            payload: response.data.data,
        });
    } catch (error) {
        console.log(error);
    }
}

export const createCompetition = (competition) => async (dispatch) => {
    try {
        const response = await rankingApi.post(`/competitions`, competition);

        dispatch({
            type: CREATE_COMPETITION,
            payload: response.data.data,
        });

        return response.data.data;
    } catch (error) {
        Promise.reject(error);
    }
}

// Test actions

export const getTest = (id) => async (dispatch) => {
    try {
        const response = await rankingApi.get(`/tests/${id}`);

        dispatch({
            type: GET_TEST,
            payload: response.data.data,
        });
    } catch (error) {
        console.log(error);
    }
}

// Test catalog
export const getTestCatalog = () => async dispatch => {
    try {
        const response = await rankingApi.get('/test-catalog');

        dispatch({
            type: GET_TEST_CATALOG,
            payload: response.data.data
        })
    } catch ( error ) {
        console.log (error);
    }
}

export const getTestDefinition = (testcode) => async (dispatch) => {
    try {
        const response = await rankingApi.get(`/test-catalog/${testcode}`);

        dispatch({
            type: GET_TEST_DEFINITION,
            payload: response.data.data
        });
    } catch (error) {
        console.log(error);
    }
}

// Tasks
export const getTask = (taskId) => async dispatch => {
    try {
        const response = await rankingApi.get(`/tasks/${taskId}`);

        dispatch({
            type: GET_TASK,
            payload: response.data.data
        })
    } catch(error) {
        console.log(error);
    }
}