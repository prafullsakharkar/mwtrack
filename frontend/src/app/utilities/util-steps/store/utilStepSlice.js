import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const url = '/api/v1/utility/utilsteps/';

export const getUtilSteps = createAsyncThunk('utilStepApp/utilStep/getUtilSteps', async (routeParams, { getState }) => {
	routeParams = routeParams || getState().utilStepApp.utilSteps.routeParams;
	const response = await axios.get(url, {
		params: routeParams
	});
	const data = await response.data;

	return { data, routeParams };
});

export const getUtilStep = createAsyncThunk(
	'utilStepApp/utilStep/getStep',
	async (routeParams, { dispatch, getState }) => {
		routeParams = routeParams || getState().utilStepApp.utilSteps.routeParams;
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');

		const data = await response.data;
		return { data, routeParams };
	}
);

export const addUtilStep = createAsyncThunk(
	'utilStepApp/utilStep/addStep',
	async (step, { dispatch, getState }) => {
		const response = await axios.post(url, step);
		const data = await response.data;

		return data;
	}
);

export const updateUtilStep = createAsyncThunk(
	'utilStepApp/utilStep/updateStep',
	async (step, { dispatch, getState }) => {
		const id = step.id
		delete step['id']
		const response = await axios.patch(url + id + '/', step);
		const data = await response.data;

		return data;
	}
);

export const removeUtilStep = createAsyncThunk(
	'utilStepApp/utilStep/removeStep',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;

		return id;
	}
);

const utilStepAdapter = createEntityAdapter({});

export const { selectAll: selectUtilSteps, selectById: selectUtilStepById } = utilStepAdapter.getSelectors(
	state => state.utilStepApp.utilSteps
);

const utilStepSlice = createSlice({
	name: 'utilStepApp/utilStep',
	initialState: utilStepAdapter.getInitialState({
		searchText: '',
		routeParams: {},
		stepDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		setStepsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		resetStepsSearchText: (state, action) => {
			state.searchText = '';
		},
		openNewUtilStepDialog: (state, action) => {
			state.stepDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewUtilStepDialog: (state, action) => {
			state.stepDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditUtilStepDialog: (state, action) => {
			state.stepDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditUtilStepDialog: (state, action) => {
			state.stepDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removeUtilStep.fulfilled]: (state, action) => {
			utilStepAdapter.removeOne(state, action.payload)
		},
		[updateUtilStep.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				utilStepAdapter.upsertMany(state, action.payload)
			} else {
				utilStepAdapter.upsertOne(state, action.payload)
			}
		},
		[addUtilStep.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				utilStepAdapter.upsertMany(state, action.payload)
			} else {
				utilStepAdapter.upsertOne(state, action.payload)
			}
		},
		[getUtilStep.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;

			utilStepAdapter.upsertOne(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		},
		[getUtilSteps.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;
			utilStepAdapter.setAll(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		}
	}
});

export const {
	setStepsSearchText,
	resetStepsSearchText,
	openNewUtilStepDialog,
	closeNewUtilStepDialog,
	openEditUtilStepDialog,
	closeEditUtilStepDialog,
} = utilStepSlice.actions;

export default utilStepSlice.reducer;
