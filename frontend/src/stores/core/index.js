import { combineReducers } from '@reduxjs/toolkit';
import dialog from './dialogSlice';
import message from './messageSlice';
import navbar from './navbarSlice';
import navigation from './navigationSlice';
import settings from './settingsSlice';
import projects from 'src/app/entities/projects/store/projectSlice';

const reducers = combineReducers({
  navigation,
  settings,
  navbar,
  message,
  dialog,
  projects,
});

export default reducers;
