import _ from 'lodash';

import { LOGIN, GET_PROFILE, NO_USER, LOGOUT } from '../actions/types';

export default ( state = {}, action) => {
    switch(action.type) {
        case LOGIN:
            localStorage.setItem("token", action.payload.token);

            return {...state, currentUser: action.payload.user };
        case LOGOUT:
            localStorage.removeItem("token");

            return {...state, currentUser: null};
        case GET_PROFILE:
            return {...state, currentUser: action.payload.user};
        case NO_USER:
            return {...state, currentUser: null};
        default:
            return state;
    }
}