import { combineReducers } from '@reduxjs/toolkit';
import steps from './stepSlice';
import episodes from 'src/app/entities/episodes/store/episodeSlice';
import sequences from 'src/app/entities/sequences/store/sequenceSlice';
import shots from 'src/app/entities/shots/store/shotSlice';
import assets from 'src/app/entities/assets/store/assetSlice';
import status from 'src/app/utilities/statuses/store/statusSlice';
import utilSteps from 'src/app/utilities/util-steps/store/utilStepSlice';

const reducer = combineReducers({
	steps,
	episodes,
	sequences,
	shots,
	assets,
	status,
	utilSteps
});

export default reducer;
