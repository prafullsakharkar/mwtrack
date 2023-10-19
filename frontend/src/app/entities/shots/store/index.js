import { combineReducers } from '@reduxjs/toolkit';
import shots from './shotsSlice';
import episodes from 'src/app/entities/episodes/store/episodesSlice';
import sequences from 'src/app/entities/sequences/store/sequencesSlice';
import utilsteps from 'src/app/utilities/steps/store/stepsSlice';
import users from 'src/app/accounts/users/store/userSlice';

const reducer = combineReducers({
	shots,
	episodes,
	sequences,
	utilsteps,
	users
});

export default reducer;
