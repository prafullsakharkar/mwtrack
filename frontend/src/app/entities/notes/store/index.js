import { combineReducers } from '@reduxjs/toolkit';
import notes from './noteSlice';

const reducer = combineReducers({
	notes,
});

export default reducer;
