import { GET_HORSE, GET_HORSE_RESULTS } from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case GET_HORSE:
            let testObjs = {}
            for (const test of action.payload.testlist) {
                testObjs[test] = {}
            }

            const horse_new = {
                ...action.payload,
                results: testObjs
            }

            return {...state, [action.payload.id]: horse_new};
        case GET_HORSE_RESULTS:
            let horse = state[action.payload.id];
            horse.results[action.payload.testcode] = action.payload.result;

            console.log(action.payload);

            return {...state, [action.payload.id]: horse};
        default:
            return state;
    }
}