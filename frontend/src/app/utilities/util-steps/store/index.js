import { combineReducers } from '@reduxjs/toolkit';
import utilSteps from './utilStepSlice';

const reducer = combineReducers({
	utilSteps,
});

export default reducer;
