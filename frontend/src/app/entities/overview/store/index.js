import { combineReducers } from '@reduxjs/toolkit';

import users from 'src/app/main/apps/users/accounts/store/accountsSlice';
import statuses from 'src/app/main/apps/utilities/statuses/store/statusesSlice';
import priorities from 'src/app/main/apps/utilities/priorities/store/prioritiesSlice';
import utilSteps from 'src/app/main/apps/utilities/steps/store/stepsSlice';

import projects from 'src/app/main/apps/entities/projects/store/projectsSlice';
import assets from 'src/app/main/apps/entities/assets/store/assetsSlice';
import episodes from 'src/app/main/apps/entities/episodes/store/episodesSlice';
import sequences from 'src/app/main/apps/entities/sequences/store/sequencesSlice';
import shots from 'src/app/main/apps/entities/shots/store/shotsSlice';
import steps from 'src/app/main/apps/entities/steps/store/stepsSlice';
import tasks from 'src/app/main/apps/entities/tasks/store/tasksSlice';
import versions from 'src/app/main/apps/entities/versions/store/versionsSlice';
import notes from 'src/app/main/apps/entities/notes/store/notesSlice';
import activities from 'src/app/main/apps/tools/activities/store/activitiesSlice';

const reducer = combineReducers({
	statuses,
	priorities,
	users,
	utilSteps,
	projects,
	assets,	
	episodes,
	sequences,
	shots,
	steps,
	tasks,
	versions,
	notes,
	activities
});

export default reducer;
