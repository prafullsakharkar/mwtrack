import { combineReducers } from '@reduxjs/toolkit';
import assets from './assetsSlice';
import utilsteps from 'src/app/main/apps/utilities/steps/store/stepsSlice';
import users from 'src/app/main/apps/users/accounts/store/accountsSlice';

const reducer = combineReducers({
	assets,
	utilsteps,
	users
});

export default reducer;
