import { combineReducers } from '@reduxjs/toolkit';
import shots from './shotSlice';
import episodes from 'src/app/entities/episodes/store/episodeSlice';
import sequences from 'src/app/entities/sequences/store/sequenceSlice';
import utilsteps from 'src/app/utilities/util-steps/store/utilStepSlice';
import users from 'src/app/accounts/users/store/userSlice';

const reducer = combineReducers({
	shots,
	episodes,
	sequences,
	utilsteps,
	users
});

export default reducer;
