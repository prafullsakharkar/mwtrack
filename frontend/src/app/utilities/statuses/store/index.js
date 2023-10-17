import { combineReducers } from '@reduxjs/toolkit';
import statuses from './statusSlice';

const reducer = combineReducers({
	statuses,
});

export default reducer;
