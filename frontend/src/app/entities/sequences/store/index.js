import { combineReducers } from '@reduxjs/toolkit';
import sequences from './sequencesSlice';
import episodes from 'src/app/entities/episodes/store/episodesSlice';

const reducer = combineReducers({
	sequences,
	episodes
});

export default reducer;
