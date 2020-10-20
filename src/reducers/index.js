import { combineReducers } from 'redux';

import rankings from './rankingsReducer';
import users from './userReducer';
import riders from './riderReducer';
import horses from './horseReducer';
import navigation from './navigationReducer';

export default combineReducers({
   rankings,
   users,
   riders,
   horses,
   navigation
});