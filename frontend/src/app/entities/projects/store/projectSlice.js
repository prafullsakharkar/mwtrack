import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from '@/stores/core/messageSlice';

const url = '/api/v1/entity/projects/';

export const getProjects = createAsyncThunk('projectApp/projects/getProjects', async () => {
	const response = await axios.get(url);
	const data = await response.data;

	return data;
});

export const getProject = createAsyncThunk(
	'projectApp/projects/getProject',
	async (routeParams, { dispatch, getState }) => {
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');
		const data = await response.data;
		return data;
	}
);

export const addProject = createAsyncThunk(
	'projectApp/projects/addProject',
	async (project, { dispatch, getState }) => {
		delete project.thumbnail
		const response = await axios.post(url, project);
		const data = await response.data;
		dispatch(showMessage({ message: `Project (${project.code}) has created !!!`, variant: "success" }));
		return data;
	}
);

export const updateProject = createAsyncThunk(
	'projectApp/projects/updateProject',
	async (project, { dispatch, getState }) => {
		const id = project.id
		delete project['id']
		const response = await axios.patch(url + id + '/', project);
		const data = await response.data;

		dispatch(showMessage({ message: `Project (${id}) has updated !!!`, variant: "success" }));
		return data;
	}
);

export const removeProject = createAsyncThunk(
	'projectApp/projects/removeProject',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;

		return data;
	}
);

export const setEmptyProjects = createAsyncThunk(
	'projectApp/projects/setEmptyProjects',
	async () => {
		return [];
	}
);

const projectAdapter = createEntityAdapter({
	selectId: (project) => project.uid,
});

export const { selectAll: selectProjects, selectById: selectProjectById } = projectAdapter.getSelectors(
	state => state.projectApp ? state.projectApp.projects : state.overviewApp.projects
);

export const selectProjectSearchText = ({ projectApp }) => projectApp.projects.searchText;

const projectSlice = createSlice({
	name: 'projectApp/projects',
	initialState: projectAdapter.getInitialState({
		searchText: '',
		projectDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		setProjectSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: (event) => ({ payload: event.target.value || '' }),
		},
		openNewProjectDialog: (state, action) => {
			state.projectDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewProjectDialog: (state, action) => {
			state.projectDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditProjectDialog: (state, action) => {
			state.projectDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditProjectDialog: (state, action) => {
			state.projectDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[updateProject.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				projectAdapter.upsertMany(state, action.payload)
			} else {
				projectAdapter.upsertOne(state, action.payload)
			}
		},
		[addProject.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				projectAdapter.upsertMany(state, action.payload)
			} else {
				projectAdapter.upsertOne(state, action.payload)
			}
		},
		[getProject.fulfilled]: (state, action) => {
			projectAdapter.setOne(state, action.payload);
			state.searchText = '';
		},
		[getProjects.fulfilled]: (state, action) => {
			projectAdapter.setAll(state, action.payload);
			state.searchText = '';
		},
		[setEmptyProjects.fulfilled]: (state, action) => {
			projectAdapter.setAll(state, action.payload);
			state.searchText = '';
		}
	}
});

export const {
	setProjectSearchText,
	openNewProjectDialog,
	closeNewProjectDialog,
	openEditProjectDialog,
	closeEditProjectDialog,
} = projectSlice.actions;

export default projectSlice.reducer;
