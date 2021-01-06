import { RECOMPUTE_RANKING_RESULTS, GET_TASK } from "../actions/types";

export default ( state = {}, action) => {
    switch(action.type) {
        case GET_TASK:
            return {...state, [action.payload.id]: action.payload};

        case RECOMPUTE_RANKING_RESULTS:
            return {...state, [action.payload.task.id]: action.payload.task}

        default:
            return state;
    }
}