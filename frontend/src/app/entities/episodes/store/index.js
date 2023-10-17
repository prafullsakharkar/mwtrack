import { combineReducers } from '@reduxjs/toolkit';
import episodes from './episodesSlice';

const reducer = combineReducers({
	episodes,
});

export default reducer;
