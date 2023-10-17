import { combineReducers } from '@reduxjs/toolkit';
import notes from './notesSlice';

const reducer = combineReducers({
	notes,
});

export default reducer;
