import { combineReducers } from '@reduxjs/toolkit';
import projects from './projectSlice';
import users from 'src/app/accounts/users/store/userSlice';

const reducer = combineReducers({
	projects,
	users
});

export default reducer;
