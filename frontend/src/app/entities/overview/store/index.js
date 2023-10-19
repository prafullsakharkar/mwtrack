import { combineReducers } from '@reduxjs/toolkit';

import users from 'src/app/accounts/users/store/userSlice';
import statuses from 'src/app/utilities/statuses/store/statusSlice';
import utilSteps from 'src/app/utilities/util-steps/store/utilStepSlice';

import projects from 'src/app/entities/projects/store/projectSlice';
// import assets from 'src/app/entities/assets/store/assetsSlice';
// import episodes from 'src/app/entities/episodes/store/episodesSlice';
// import sequences from 'src/app/entities/sequences/store/sequencesSlice';
// import shots from 'src/app/entities/shots/store/shotsSlice';
// import steps from 'src/app/entities/steps/store/stepsSlice';
// import tasks from 'src/app/entities/tasks/store/tasksSlice';
// import versions from 'src/app/entities/versions/store/versionsSlice';
// import notes from 'src/app/entities/notes/store/notesSlice';
// import activities from 'src/app/tools/activities/store/activitiesSlice';

const reducer = combineReducers({
	statuses,
	users,
	utilSteps,
	projects,
	// assets,	
	// episodes,
	// sequences,
	// shots,
	// steps,
	// tasks,
	// versions,
	// notes,
	// activities
});

export default reducer;
