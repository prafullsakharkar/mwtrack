import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const url = '/api/v1/utility/statuses/';

export const getStatuses = createAsyncThunk('statusApp/statuses/getStatuses', async () => {
	const response = await axios.get(url);
	const data = await response.data;
	return data;
});

export const getStatus = createAsyncThunk(
	'statusApp/statuses/getStatus',
	async (routeParams, { dispatch, getState }) => {
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');
		const data = await response.data;
		return data;
	}
);

export const addStatus = createAsyncThunk(
	'statusApp/statuses/addStatus',
	async (status, { dispatch, getState }) => {
		const response = await axios.post(url, status);
		const data = await response.data;
		return data;
	}
);

export const updateStatus = createAsyncThunk(
	'statusApp/statuses/updateStatus',
	async (status, { dispatch, getState }) => {
		const id = status.id
		delete status['id']
		const response = await axios.patch(url + id + '/', status);
		const data = await response.data;
		return data;
	}
);

export const removeStatus = createAsyncThunk(
	'statusApp/statuses/removeStatus',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;
		return id;
	}
);

const statusAdapter = createEntityAdapter({});

export const { selectAll: selectStatuses, selectById: selectStatusById } = statusAdapter.getSelectors(
	state => state.statusApp.statuses
);

const statusSlice = createSlice({
	name: 'statusApp/statuses',
	initialState: statusAdapter.getInitialState({
		statusDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewStatusDialog: (state, action) => {
			state.statusDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewStatusDialog: (state, action) => {
			state.statusDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditStatusDialog: (state, action) => {
			state.statusDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditStatusDialog: (state, action) => {
			state.statusDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removeStatus.fulfilled]: (state, action) => {
			statusAdapter.removeOne(state, action.payload)
		},
		[updateStatus.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				statusAdapter.upsertMany(state, action.payload)
			} else {
				statusAdapter.upsertOne(state, action.payload)
			}
		},
		[addStatus.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				statusAdapter.upsertMany(state, action.payload)
			} else {
				statusAdapter.upsertOne(state, action.payload)
			}
		},
		[getStatus.fulfilled]: (state, action) => {
			statusAdapter.upsertOne(state, action.payload);
		},
		[getStatuses.fulfilled]: (state, action) => {
			statusAdapter.setAll(state, action.payload);
		}
	}
});

export const {
	openNewStatusDialog,
	closeNewStatusDialog,
	openEditStatusDialog,
	closeEditStatusDialog,
} = statusSlice.actions;

export default statusSlice.reducer;
