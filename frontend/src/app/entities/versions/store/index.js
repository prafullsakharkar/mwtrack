import { combineReducers } from '@reduxjs/toolkit';
import versions from './versionSlice';
import episodes from 'src/app/entities/episodes/store/episodeSlice';
import sequences from 'src/app/entities/sequences/store/sequenceSlice';
import shots from 'src/app/entities/shots/store/shotSlice';
import steps from 'src/app/entities/steps/store/stepSlice';
import assets from 'src/app/entities/assets/store/assetSlice';
import status from 'src/app/utilities/statuses/store/statusSlice';
import utilSteps from 'src/app/utilities/util-steps/store/utilStepSlice';
import users from 'src/app/accounts/users/store/userSlice';

const reducer = combineReducers({
	users,
	status,
	utilSteps,
	versions,
	episodes,
	sequences,
	shots,
	steps,
	assets
});

export default reducer;
