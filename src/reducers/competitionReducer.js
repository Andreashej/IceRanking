import { CREATE_COMPETITION, GET_COMPETITION, GET_TEST } from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case GET_COMPETITION:
        case CREATE_COMPETITION:
            let testObjs = {}
            for (const test of action.payload.tests) {
                testObjs[test.testcode] = test;
            }

            const competition_new = {
                ...action.payload,
                tests: testObjs,
            }

            return {...state, [action.payload.id]: competition_new};
        case GET_TEST:

            let rank = 1;
            let prevMark;
            const results = action.payload.results.map((result, index) => {

                if (prevMark !== result.mark) {
                    rank = index + 1;
                    prevMark = result.mark;
                }

                return {
                    ...result,
                    rank
                }
            })

            const test = {
                ...state[action.payload.competition.id].tests[action.payload.testcode],
                results: results,
            }

            const tests = {
                ...state[action.payload.competition.id].tests,
                [action.payload.testcode]: test,
            };

            const competition = {
                ...state[action.payload.competition.id],
                tests: tests,
            }

            return {
                ...state, 
                [action.payload.competition.id]: competition,
            };

        default:
            return state;
    }
}