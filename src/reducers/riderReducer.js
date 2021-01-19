import { GET_RIDER, GET_RIDER_RESULTS } from "../actions/types";

export default (state = {}, action) => {
    switch (action.type) {
        case GET_RIDER:
            let testObjs = {}
            for (const test of action.payload.testlist) {
                const results = state[action.payload.id]?.results[test];
                testObjs[test] = {
                    ...results
                }
            }

            const rider_new = {
                ...action.payload,
                results: testObjs
            }
            return {...state, [action.payload.id]: rider_new};
        case GET_RIDER_RESULTS:
            let rider = state[action.payload.id];
            rider.results[action.payload.testcode] = action.payload.results;

            return {...state, [action.payload.id]: rider};
        default:
            return state;
        }
}