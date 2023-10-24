import { combineReducers } from '@reduxjs/toolkit';
import tasks from './taskSlice';
import episodes from 'src/app/entities/episodes/store/episodeSlice';
import sequences from 'src/app/entities/sequences/store/sequenceSlice';
import shots from 'src/app/entities/shots/store/shotSlice';
import steps from 'src/app/entities/steps/store/stepSlice';
import assets from 'src/app/entities/assets/store/assetSlice';
import status from 'src/app/utilities/statuses/store/statusSlice';
import users from 'src/app/accounts/users/store/userSlice';
import utilSteps from 'src/app/utilities/util-steps/store/utilStepSlice';

const reducer = combineReducers({
	tasks,
	episodes,
	sequences,
	shots,
	status,
	steps,
	assets,
	users,
	utilSteps
});

export default reducer;
