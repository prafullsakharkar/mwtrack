import { combineReducers } from '@reduxjs/toolkit';
import tasks from './tasksSlice';
import episodes from 'src/app/main/apps/entities/episodes/store/episodesSlice';
import sequences from 'src/app/main/apps/entities/sequences/store/sequencesSlice';
import shots from 'src/app/main/apps/entities/shots/store/shotsSlice';
import steps from 'src/app/main/apps/entities/steps/store/stepsSlice';
import assets from 'src/app/main/apps/entities/assets/store/assetsSlice';
import status from 'src/app/main/apps/utilities/statuses/store/statusesSlice';
import priorities from 'src/app/main/apps/utilities/priorities/store/prioritiesSlice';
import users from 'src/app/main/apps/users/accounts/store/accountsSlice';
import utilSteps from 'src/app/main/apps/utilities/steps/store/stepsSlice';

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
