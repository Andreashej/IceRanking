import { combineReducers } from 'redux';

import rankings from './rankingsReducer';
import users from './userReducer';
import riders from './riderReducer';

export default combineReducers({
   rankings,
   users,
   riders
});