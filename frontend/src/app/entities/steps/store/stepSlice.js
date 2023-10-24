import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { showMessage } from '@/stores/core/messageSlice';

const url = '/api/v1/entity/steps/';
export const getSteps = createAsyncThunk(
	'stepApp/step/getSteps',
	async (queryParams, { getState }) => {
		const uid = queryParams?.uid
		const entity = queryParams?.entity

		const endPoint = (entity && uid) ? '/api/v1/entity/' + entity + 's/' + uid + '/steps/' : url

		const params = { ...queryParams }
		delete params?.uid
		delete params?.entity

		return await axios.get(endPoint, { params: params })
			.then((response) => {
				const data = response.data;
				return data;
			})
			.catch((response) => {
				console.error(response)
			})
	}
);

export const getStep = createAsyncThunk(
	'stepApp/step/getStep',
	async (routeParams, { dispatch, getState }) => {
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');
		const data = await response.data;
		return data;
	}
);

export const addStep = createAsyncThunk(
	'stepApp/step/addStep',
	async (step, { dispatch, getState }) => {
		const response = await axios.post(url, step);
		const data = await response.data;
		return data;
	}
);

export const addSteps = createAsyncThunk(
	'stepApp/step/addSteps',
	async (steps, { dispatch, getState }) => {
		const response = await axios.post(url, steps);
		const data = await response.data;
		return data;
	}
);

export const updateStep = createAsyncThunk(
	'stepApp/step/updateStep',
	async (step, { dispatch, getState }) => {
		const id = step.id
		delete step['id']
		const response = await axios.patch(url + id + '/', step);
		const data = await response.data;
		return data;
	}
);

export const updateMultipleSteps = createAsyncThunk(
	'stepApp/step/updateMultipleSteps',
	async ({ multipleStepList, project }, { dispatch, getState }) => {
		const response = await axios.post('/api/v1/entity/projects/' + project + '/step_bulk_update/', multipleStepList);
		const data = await response.data;

		return data;
	}
);

export const removeStep = createAsyncThunk(
	'stepApp/step/removeStep',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;
		if (data) return id;
	}
);

export const removeSteps = createAsyncThunk(
	'stepApp/step/removeSteps',
	async (entityIds, { dispatch, getState }) => {
		confirmAlert({
			title: 'Confirm to delete steps !!!',
			message: 'Are you sure, you want to remove selected steps ?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						entityIds.map(row => {
							dispatch(removeStep(row))
						})
						dispatch(showMessage({ message: 'Steps has been removed successfully !' }));

					}
				},
				{
					label: 'No',
					onClick: () => console.log("No action to remove steps")
				}
			]
		});

		return entityIds;
	}
);

const stepsAdapter = createEntityAdapter({
	selectId: (entity) => entity.uid,
});

export const { selectAll: selectSteps, selectEntities: selectStep, selectById: selectStepById } = stepsAdapter.getSelectors(
	state => state.stepApp ? state.stepApp.steps : state.overviewApp.steps
);

const stepsSlice = createSlice({
	name: 'stepApp/steps',
	initialState: stepsAdapter.getInitialState({
		totalCount: 0,
		isLoading: true,
		stepDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewStepDialog: (state, action) => {
			state.stepDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewStepDialog: (state, action) => {
			state.stepDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditStepDialog: (state, action) => {
			state.stepDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditStepDialog: (state, action) => {
			state.stepDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openMultipleStepDialog: (state, action) => {
			state.stepDialog = {
				type: 'multiple',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeMultipleStepDialog: (state, action) => {
			state.stepDialog = {
				type: 'multiple',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvCreateDialog: (state, action) => {
			state.stepDialog = {
				type: 'csvCreate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvCreateDialog: (state, action) => {
			state.stepDialog = {
				type: 'csvCreate',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvUpdateDialog: (state, action) => {
			state.stepDialog = {
				type: 'csvUpdate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvUpdateDialog: (state, action) => {
			state.stepDialog = {
				type: 'csvUpdate',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removeStep.fulfilled]: (state, action) => {
			stepsAdapter.removeOne(state, action.payload)
		},
		[updateStep.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				stepsAdapter.upsertMany(state, action.payload)
			} else {
				stepsAdapter.upsertOne(state, action.payload)
			}
		},
		[addStep.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				stepsAdapter.upsertMany(state, action.payload)
			} else {
				stepsAdapter.upsertOne(state, action.payload)
			}
		},
		[addSteps.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				stepsAdapter.upsertMany(state, action.payload)
			} else {
				stepsAdapter.upsertOne(state, action.payload)
			}
		},
		[getStep.fulfilled]: (state, action) => {
			stepsAdapter.upsertOne(state, action.payload);
		},
		[getSteps.pending]: (state, action) => {
			state.isLoading = true;
		},
		[getSteps.fulfilled]: (state, action) => {
			const data = action.payload
			stepsAdapter.setAll(state, data?.results || data);
			state.totalCount = data?.count || data.length
			state.isLoading = false;
		},
		[updateMultipleSteps.fulfilled]: (state, action) => {
			stepsAdapter.upsertMany(state, action.payload)
		},
	}
});

export const {
	openNewStepDialog,
	closeNewStepDialog,
	openEditStepDialog,
	closeEditStepDialog,
	openMultipleStepDialog,
	closeMultipleStepDialog,
	openCsvCreateDialog,
	closeCsvCreateDialog,
	openCsvUpdateDialog,
	closeCsvUpdateDialog
} = stepsSlice.actions;

export default stepsSlice.reducer;
