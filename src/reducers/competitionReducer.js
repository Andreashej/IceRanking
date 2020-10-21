import { GET_COMPETITION, GET_COMPETITION_RESULTS } from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case GET_COMPETITION:
            // let testObjs = {}
            // for (const test of action.payload.testlist) {
            //     testObjs[test] = {}
            // }

            const competition_new = {
                ...action.payload,
            }

            return {...state, [action.payload.id]: competition_new};
        case GET_COMPETITION_RESULTS:
            let horse = state[action.payload.id];
            horse.results[action.payload.testcode] = action.payload.result;

            console.log(action.payload);

            return {...state, [action.payload.id]: horse};
        default:
            return state;
    }
}