import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { showMessage } from '@/stores/core/messageSlice';

const url = '/api/v1/entity/shots/';
export const getShots = createAsyncThunk(
	'shotApp/shot/getShots',
	async (queryParams, { getState }) => {
		const uid = queryParams?.uid
		const entity = queryParams?.entity
		const endPoint = (entity && uid) ? '/api/v1/entity/' + entity + 's/' + uid + '/shots/' : url

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
				return [];
			})
	}
);

export const getShot = createAsyncThunk(
	'shotApp/shot/getShot',
	async (routeParams, { dispatch, getState }) => {
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');
		const data = await response.data;
		return data;
	}
);

export const addShot = createAsyncThunk(
	'shotApp/shot/addShot',
	async (shot, { dispatch, getState }) => {
		const response = await axios.post(url, shot);
		const data = await response.data;

		return data;
	}
);

export const addShots = createAsyncThunk(
	'shotApp/shot/addShots',
	async (shots, { dispatch, getState }) => {
		const response = await axios.post(url, shots);
		const data = await response.data;

		return data;
	}
);

export const updateShot = createAsyncThunk(
	'shotApp/shot/updateShot',
	async (shot, { dispatch, getState }) => {
		const id = shot.id
		delete shot['id']
		const response = await axios.patch(url + id + '/', shot);
		const data = await response.data;

		return data;
	}
);

export const updateMultipleShots = createAsyncThunk(
	'shotApp/shot/updateMultipleShots',
	async ({ multipleShotList, project }, { dispatch, getState }) => {
		const response = await axios.post('/api/v1/entity/projects/' + project + '/shot_bulk_update/', multipleShotList);
		const data = await response.data;

		return data;
	}
);

export const removeShot = createAsyncThunk(
	'shotApp/shot/removeShot',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;
		if (data) return id;
	}
);

export const removeShots = createAsyncThunk(
	'shotApp/shot/removeShots',
	async (entityIds, { dispatch, getState }) => {
		confirmAlert({
			title: 'Confirm to delete shots !!!',
			message: 'Are you sure, you want to remove selected shots ?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						entityIds.map(row => {
							dispatch(removeShot(row))
						})
						dispatch(showMessage({ message: 'Shots has been removed successfully !' }));

					}
				},
				{
					label: 'No',
					onClick: () => console.log("No action to remove shots")
				}
			]
		});

		return entityIds;
	}
);

const shotsAdapter = createEntityAdapter({
	selectId: (entity) => entity.uid,
});

export const { selectAll: selectShots, selectEntities: selectShot, selectById: selectShotById } = shotsAdapter.getSelectors(
	state => state.shotApp ? state.shotApp.shots : state.overviewApp.shots
);

const shotsSlice = createSlice({
	name: 'shotApp/shots',
	initialState: shotsAdapter.getInitialState({
		totalCount: 0,
		isLoading: true,
		shotDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewShotDialog: (state, action) => {
			state.shotDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewShotDialog: (state, action) => {
			state.shotDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditShotDialog: (state, action) => {
			state.shotDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditShotDialog: (state, action) => {
			state.shotDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openMultipleShotDialog: (state, action) => {
			state.shotDialog = {
				type: 'multiple',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeMultipleShotDialog: (state, action) => {
			state.shotDialog = {
				type: 'multiple',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvCreateDialog: (state, action) => {
			state.shotDialog = {
				type: 'csvCreate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvCreateDialog: (state, action) => {
			state.shotDialog = {
				type: 'csvCreate',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvUpdateDialog: (state, action) => {
			state.shotDialog = {
				type: 'csvUpdate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvUpdateDialog: (state, action) => {
			state.shotDialog = {
				type: 'csvUpdate',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removeShot.fulfilled]: (state, action) => {
			shotsAdapter.removeOne(state, action.payload)
		},
		[updateShot.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				shotsAdapter.upsertMany(state, action.payload)
			} else {
				shotsAdapter.upsertOne(state, action.payload)
			}
		},
		[addShot.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				shotsAdapter.upsertMany(state, action.payload)
			} else {
				shotsAdapter.upsertOne(state, action.payload)
			}
		},
		[addShots.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				shotsAdapter.upsertMany(state, action.payload)
			} else {
				shotsAdapter.upsertOne(state, action.payload)
			}
		},
		[getShot.fulfilled]: (state, action) => {
			shotsAdapter.upsertOne(state, action.payload);
		},
		[getShots.pending]: (state, action) => {
			state.isLoading = true;
		},
		[getShots.fulfilled]: (state, action) => {
			const data = action.payload
			shotsAdapter.setAll(state, data?.results || data);
			state.totalCount = data?.count || data.length
			state.isLoading = false;
		},
		[updateMultipleShots.fulfilled]: (state, action) => {
			shotsAdapter.upsertMany(state, action.payload)
		},
	}
});

export const {
	openNewShotDialog,
	closeNewShotDialog,
	openEditShotDialog,
	closeEditShotDialog,
	openMultipleShotDialog,
	closeMultipleShotDialog,
	openCsvCreateDialog,
	closeCsvCreateDialog,
	openCsvUpdateDialog,
	closeCsvUpdateDialog
} = shotsSlice.actions;

export default shotsSlice.reducer;
