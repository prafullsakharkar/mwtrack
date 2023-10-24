import { combineReducers } from '@reduxjs/toolkit';
import sequences from './sequenceSlice';
import episodes from 'src/app/entities/episodes/store/episodeSlice';

const reducer = combineReducers({
	sequences,
	episodes
});

export default reducer;
