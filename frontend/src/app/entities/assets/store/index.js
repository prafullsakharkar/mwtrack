import { combineReducers } from '@reduxjs/toolkit';
import assets from './assetSlice';
import utilsteps from 'src/app/utilities/util-steps/store/utilStepSlice';
import users from 'src/app/accounts/users/store/userSlice';

const reducer = combineReducers({
	assets,
	utilsteps,
	users
});

export default reducer;
