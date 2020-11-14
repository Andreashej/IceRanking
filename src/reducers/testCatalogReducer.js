import { GET_TEST_CATALOG, GET_TEST_DEFINITION } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch (action.type) {
        case GET_TEST_CATALOG:
            return { ...state, ..._.mapKeys(action.payload,'testcode') };
        case GET_TEST_DEFINITION:

            return {
                ...state, 
                [action.payload.id]: action.payload,
            };
        default:
            return state;
    }
}