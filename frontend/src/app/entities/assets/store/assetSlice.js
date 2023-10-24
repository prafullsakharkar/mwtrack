import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { showMessage } from '@/stores/core/messageSlice';

const url = '/api/v1/entity/assets/';

export const getAssets = createAsyncThunk(
	'assetApp/asset/getAsset',
	async (queryParams, { getState }) => {
		const uid = queryParams?.uid
		const entity = queryParams?.entity

		const endPoint = (entity && uid) ? '/api/v1/entity/' + entity + 's/' + uid + '/assets/' : url

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
				return []
			})
	}
);

export const getAsset = createAsyncThunk(
	'assetApp/asset/getAsset',
	async (routeParams, { dispatch, getState }) => {
		routeParams = routeParams || getState().overviewApp.assets.routeParams;
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');
		// console.log(response.status)

		const data = await response.data;
		return data;
	}
);

export const addAsset = createAsyncThunk(
	'assetApp/asset/addAsset',
	async (asset, { dispatch, getState }) => {
		const response = await axios.post(url, asset);
		const data = await response.data;

		return data;
	}
);

export const updateAsset = createAsyncThunk(
	'assetApp/asset/updateAsset',
	async (asset, { dispatch, getState }) => {
		const id = asset.id
		delete asset['id']
		const response = await axios.patch(url + id + '/', asset);
		const data = await response.data;

		return data;
	}
);

export const updateMultipleAsset = createAsyncThunk(
	'assetApp/asset/updateMultipleAsset',
	async ({ multipleAssetList, project }, { dispatch, getState }) => {
		const response = await axios.post('/api/v1/entity/projects/' + project + '/asset_bulk_update/', multipleAssetList);
		const data = await response.data;

		return data;
	}
);

export const removeAsset = createAsyncThunk(
	'assetApp/asset/removeAsset',
	async (id, { dispatch, getState }) => {
		return await axios.delete(url + id + '/')
			.then((response) => {
				console.info(response)
				return id;
			})
			.catch((response) => {
				console.error(response)
			})
	}
);

export const removeAssets = createAsyncThunk(
	'assetApp/asset/removeAsset',
	async (entityIds, { dispatch, getState }) => {
		confirmAlert({
			title: 'Confirm to delete assets !!!',
			message: 'Are you sure, you want to remove selected assets ?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						entityIds.map(row => {
							dispatch(removeAsset(row))
						})
						dispatch(showMessage({ message: 'Asset has been removed successfully !', veriant: 'success' }));
						return entityIds;
					}
				},
				{
					label: 'No',
					onClick: () => console.log("No action to remove assets")
				}
			]
		});

	}
);

const assetsAdapter = createEntityAdapter({
	selectId: (entity) => entity.uid,
	// sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const { selectAll: selectAsset, selectById: selectAssetById } = assetsAdapter.getSelectors(
	state => state.assetApp ? state.assetApp.assets : state.overviewApp.assets
);

const assetsSlice = createSlice({
	name: 'assetApp/assets',
	initialState: assetsAdapter.getInitialState({
		totalCount: 0,
		isLoading: true,
		assetDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewAssetDialog: (state, action) => {
			state.assetDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewAssetDialog: (state, action) => {
			state.assetDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditAssetDialog: (state, action) => {
			state.assetDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditAssetDialog: (state, action) => {
			state.assetDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openMultipleAssetDialog: (state, action) => {
			state.assetDialog = {
				type: 'multiple',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeMultipleAssetDialog: (state, action) => {
			state.assetDialog = {
				type: 'multiple',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvCreateDialog: (state, action) => {
			state.assetDialog = {
				type: 'csvCreate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvCreateDialog: (state, action) => {
			state.assetDialog = {
				type: 'csvCreate',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvUpdateDialog: (state, action) => {
			state.assetDialog = {
				type: 'csvUpdate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvUpdateDialog: (state, action) => {
			state.assetDialog = {
				type: 'csvUpdate',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removeAsset.fulfilled]: (state, action) => {
			assetsAdapter.removeOne(state, action.payload)
		},
		[updateAsset.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				assetsAdapter.upsertMany(state, action.payload)
			} else {
				assetsAdapter.upsertOne(state, action.payload)
			}
		},
		[addAsset.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				assetsAdapter.upsertMany(state, action.payload)
			} else {
				assetsAdapter.upsertOne(state, action.payload)
			}
		},
		[getAsset.fulfilled]: (state, action) => {
			assetsAdapter.upsertOne(state, action.payload);
		},
		[getAsset.pending]: (state, action) => {
			state.isLoading = true;
			assetsAdapter.setAll(state, []);
		},
		[getAsset.fulfilled]: (state, action) => {
			const data = action.payload
			assetsAdapter.setAll(state, data?.results || data);
			state.totalCount = data?.count || data.length
			state.isLoading = false;
		},
		[updateMultipleAsset.fulfilled]: (state, action) => {
			assetsAdapter.upsertMany(state, action.payload)
		},
	}
});

export const {
	openNewAssetDialog,
	closeNewAssetDialog,
	openEditAssetDialog,
	closeEditAssetDialog,
	openMultipleAssetDialog,
	closeMultipleAssetDialog,
	openCsvCreateDialog,
	closeCsvCreateDialog,
	openCsvUpdateDialog,
	closeCsvUpdateDialog
} = assetsSlice.actions;

export default assetsSlice.reducer;
