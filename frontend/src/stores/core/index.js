import { combineReducers } from '@reduxjs/toolkit';
import dialog from './dialogSlice';
import message from './messageSlice';
import navbar from './navbarSlice';
import navigation from './navigationSlice';
import settings from './settingsSlice';

const reducers = combineReducers({
  navigation,
  settings,
  navbar,
  message,
  dialog,
});

export default reducers;
