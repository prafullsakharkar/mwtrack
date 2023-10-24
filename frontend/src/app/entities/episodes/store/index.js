import { combineReducers } from '@reduxjs/toolkit';
import episodes from './episodeSlice';

const reducer = combineReducers({
	episodes,
});

export default reducer;
