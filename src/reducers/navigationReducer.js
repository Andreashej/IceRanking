import { SET_CURRENT_PAGE } from '../actions/types';

export default ( state = {}, action) => {
    switch (action.type) {
        case SET_CURRENT_PAGE:
            return {...state, currentPage: action.payload.currentPage};
        
        default:
            return state;
    }
};