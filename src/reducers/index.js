import { combineReducers } from 'redux';

import rankings from './rankingsReducer';
import users from './userReducer';

export default combineReducers({
   rankings,
   users
});