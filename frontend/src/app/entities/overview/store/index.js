import { combineReducers } from '@reduxjs/toolkit';

import users from 'src/app/accounts/users/store/userSlice';
import statuses from 'src/app/utilities/statuses/store/statusSlice';
import utilSteps from 'src/app/utilities/util-steps/store/utilStepSlice';

import projects from 'src/app/entities/projects/store/projectSlice';
import assets from 'src/app/entities/assets/store/assetSlice';
import episodes from 'src/app/entities/episodes/store/episodeSlice';
import sequences from 'src/app/entities/sequences/store/sequenceSlice';
import shots from 'src/app/entities/shots/store/shotSlice';
import steps from 'src/app/entities/steps/store/stepSlice';
import tasks from 'src/app/entities/tasks/store/taskSlice';
import versions from 'src/app/entities/versions/store/versionSlice';
import notes from 'src/app/entities/notes/store/noteSlice';
// import activities from 'src/app/tools/activities/store/activitiesSlice';

const reducer = combineReducers({
	statuses,
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
	// activities
});

export default reducer;
