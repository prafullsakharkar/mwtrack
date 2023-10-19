import { combineReducers } from '@reduxjs/toolkit';
import steps from './stepsSlice';
import episodes from 'src/app/entities/episodes/store/episodesSlice';
import sequences from 'src/app/entities/sequences/store/sequencesSlice';
import shots from 'src/app/entities/shots/store/shotsSlice';
import assets from 'src/app/entities/assets/store/assetsSlice';
import status from 'src/app/utilities/statuses/store/statusesSlice';
import priorities from 'src/app/utilities/priorities/store/prioritiesSlice';
import utilSteps from 'src/app/utilities/steps/store/stepsSlice';

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
