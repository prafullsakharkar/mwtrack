import { combineReducers } from '@reduxjs/toolkit';
import versions from './versionsSlice';
import episodes from 'src/app/main/apps/entities/episodes/store/episodesSlice';
import sequences from 'src/app/main/apps/entities/sequences/store/sequencesSlice';
import shots from 'src/app/main/apps/entities/shots/store/shotsSlice';
import steps from 'src/app/main/apps/entities/steps/store/stepsSlice';
import assets from 'src/app/main/apps/entities/assets/store/assetsSlice';
import status from 'src/app/main/apps/utilities/statuses/store/statusesSlice';
import priorities from 'src/app/main/apps/utilities/priorities/store/prioritiesSlice';
import utilSteps from 'src/app/main/apps/utilities/steps/store/stepsSlice';
import users from 'src/app/main/apps/users/accounts/store/accountsSlice';

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
