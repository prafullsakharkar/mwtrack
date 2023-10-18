import { combineReducers } from '@reduxjs/toolkit';
import users from './userSlice';
import groups from 'src/app/accounts/groups/store/groupSlice';

const reducer = combineReducers({
	users,
	groups
});

export default reducer;
