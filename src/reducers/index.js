import { combineReducers } from 'redux';

import rankings from './rankingsReducer';
import users from './userReducer';
import riders from './riderReducer';
import horses from './horseReducer';
import navigation from './navigationReducer';
import competitions from './competitionReducer';
import testCatalog from './testCatalogReducer';
import tasks from './taskReducer';

export default combineReducers({
   rankings,
   users,
   riders,
   horses,
   competitions,
   navigation,
   testCatalog,
   tasks,
});