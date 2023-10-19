import { combineReducers } from '@reduxjs/toolkit';
import tasks from './tasksSlice';
import episodes from 'src/app/entities/episodes/store/episodesSlice';
import sequences from 'src/app/entities/sequences/store/sequencesSlice';
import shots from 'src/app/entities/shots/store/shotsSlice';
import steps from 'src/app/entities/steps/store/stepsSlice';
import assets from 'src/app/entities/assets/store/assetsSlice';
import status from 'src/app/utilities/statuses/store/statusesSlice';
import priorities from 'src/app/utilities/priorities/store/prioritiesSlice';
import users from 'src/app/accounts/users/store/userSlice';
import utilSteps from 'src/app/utilities/steps/store/stepsSlice';

const reducer = combineReducers({
	tasks,
	episodes,
	sequences,
	shots,
	status,
	priorities,
	steps,
	assets,
	users,
	utilSteps
});

export default reducer;
