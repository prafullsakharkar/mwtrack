import { combineReducers } from '@reduxjs/toolkit';
import versions from './versionsSlice';
import episodes from 'src/app/entities/episodes/store/episodesSlice';
import sequences from 'src/app/entities/sequences/store/sequencesSlice';
import shots from 'src/app/entities/shots/store/shotsSlice';
import steps from 'src/app/entities/steps/store/stepsSlice';
import assets from 'src/app/entities/assets/store/assetsSlice';
import status from 'src/app/utilities/statuses/store/statusesSlice';
import priorities from 'src/app/utilities/priorities/store/prioritiesSlice';
import utilSteps from 'src/app/utilities/steps/store/stepsSlice';
import users from 'src/app/accounts/users/store/userSlice';

const reducer = combineReducers({
	users,
	status,
	priorities,
	utilSteps,
	versions,
	episodes,
	sequences,
	shots,
	steps,
	assets
});

export default reducer;
