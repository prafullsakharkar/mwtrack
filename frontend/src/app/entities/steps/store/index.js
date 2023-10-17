import { combineReducers } from '@reduxjs/toolkit';
import steps from './stepsSlice';
import episodes from 'src/app/main/apps/entities/episodes/store/episodesSlice';
import sequences from 'src/app/main/apps/entities/sequences/store/sequencesSlice';
import shots from 'src/app/main/apps/entities/shots/store/shotsSlice';
import assets from 'src/app/main/apps/entities/assets/store/assetsSlice';
import status from 'src/app/main/apps/utilities/statuses/store/statusesSlice';
import priorities from 'src/app/main/apps/utilities/priorities/store/prioritiesSlice';
import utilSteps from 'src/app/main/apps/utilities/steps/store/stepsSlice';

const reducer = combineReducers({
	steps,
	episodes,
	sequences,
	shots,
	assets,
	status,
	priorities,
	utilSteps
});

export default reducer;
