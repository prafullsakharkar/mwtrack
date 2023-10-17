import { combineReducers } from '@reduxjs/toolkit';
import shots from './shotsSlice';
import episodes from 'src/app/main/apps/entities/episodes/store/episodesSlice';
import sequences from 'src/app/main/apps/entities/sequences/store/sequencesSlice';
import utilsteps from 'src/app/main/apps/utilities/steps/store/stepsSlice';
import users from 'src/app/main/apps/users/accounts/store/accountsSlice';

const reducer = combineReducers({
	shots,
	episodes,
	sequences,
	utilsteps,
	users
});

export default reducer;
