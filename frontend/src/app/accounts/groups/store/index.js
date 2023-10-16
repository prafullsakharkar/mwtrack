import { combineReducers } from '@reduxjs/toolkit';
import groups from './groupSlice';

const reducer = combineReducers({
	groups,
});

export default reducer;
