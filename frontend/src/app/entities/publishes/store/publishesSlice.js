import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const url = '/api/v1/entity/publishfile/';
export const getPublishes = createAsyncThunk(
	'publishesApp/publish/getPublishes',
	async (queryParams, { getState }) => {
		const uid = queryParams?.uid
		const entity = queryParams?.entity

		const endPoint = (entity && uid) ? '/api/v1/entity/'+entity+'/'+uid+'/publishes/' : url

		return await axios.get(endPoint, { params: queryParams })
			.then((response) => {
				const data = response.data;
				return data;
			})
			.catch((response) => {
				console.error(response)
			})
	}
);

export const getPublish = createAsyncThunk(
	'publishesApp/publish/getPublish', 
	async (routeParams, { dispatch, getState }) => {
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');
		const data = await response.data;
		return data;
	}
);

export const addPublish = createAsyncThunk(
	'publishesApp/publishes/addPublish',
	async (publish, { dispatch, getState }) => {

		if (publish.files && publish.files.length > 0) {
			const formData = new FormData();
			for (let i = 0; i < publish.files.length; i++) {
				formData.append(`files`, publish.files[i])
			}

			const uploadResponse = await axios.post('/api/v1/upload/file/', formData);
			const uploadData = await uploadResponse.data;
			publish.media_files = uploadData.map(item => item.id)
			delete publish.files
		}
		const response = await axios.post(url, publish);
		const data = await response.data;
		return data;
	}
);

export const updatePublish = createAsyncThunk(
	'publishesApp/publishes/updatePublish',
	async (publish, { dispatch, getState }) => {
		const id = publish.id
		delete publish['id']

		if (publish.files && publish.files.length > 0) {
			publish.media_files = []
			const formData = new FormData();
			for (let i = 0; i < publish.files.length; i++) {

				if (!publish.files[i].id) {
					formData.append(`files`, publish.files[i])
				} else {
					publish.media_files = [...publish.media_files, publish.files[i].id]
				}
			}

			if (formData.get('files')) {
				const uploadResponse = await axios.post('/api/v1/upload/file/', formData);
				const uploadData = await uploadResponse.data;
				publish.media_files = [...publish.media_files, ...uploadData.map(item => item.id)]
			}
			delete publish.files
		}
		const response = await axios.patch(url + id + '/', publish);
		const data = await response.data;

		return data;
	}
);

export const updateMultiplepublishes = createAsyncThunk(
	'publishesApp/publish/updateMultiplepublishes',
	async ({ multiplePublishList, project }, { dispatch, getState }) => {
		const response = await axios.post('/api/v1/entity/project/' + project + '/publish_bulk_update/', multiplePublishList);
		const data = await response.data;
		return data;
	}
);

export const removePublish = createAsyncThunk(
	'publishesApp/publishes/removePublish',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;
		return id;
	}
);

export const removepublishes = createAsyncThunk(
	'publishesApp/publishes/removepublishes',
	async (publishIds, { dispatch, getState }) => {
		const response = await axios.post('/api/publishes-app/remove-publishes', { publishIds });
		const data = await response.data;
		return publishIds;
	}
);

const publishesAdapter = createEntityAdapter({
	selectId: (entity) => entity.uid,
	// sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const { selectAll: selectPublishes, selectById: selectPublishById } = publishesAdapter.getSelectors(
	state => state.publishesApp?.publishes || state.overviewApp?.publishes 
);

const publishesSlice = createSlice({
	name: 'publishesApp/publishes',
	initialState: publishesAdapter.getInitialState({
		totalCount: 0,
		isLoading: true,
		publishDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewPublishDialog: (state, action) => {
			state.publishDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewPublishDialog: (state, action) => {
			state.publishDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditPublishDialog: (state, action) => {
			state.publishDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditPublishDialog: (state, action) => {
			state.publishDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openMultiplePublishDialog: (state, action) => {
			state.publishDialog = {
				type: 'multiple',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeMultiplePublishDialog: (state, action) => {
			state.publishDialog = {
				type: 'multiple',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removePublish.fulfilled]: (state, action) => {			
			publishesAdapter.removeOne(state, action.payload)		
		},
		[updatePublish.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				publishesAdapter.upsertMany(state, action.payload)
			} else {
				publishesAdapter.upsertOne(state, action.payload)
			}
		},
		[addPublish.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				publishesAdapter.upsertMany(state, action.payload)
			} else {
				publishesAdapter.addOne(state, action.payload)
			}
		},
		[getPublish.fulfilled]: (state, action) => {
			publishesAdapter.upsertOne(state, action.payload);
		},
		[getPublishes.pending]: (state, action) => {
			state.isLoading = true;
		},
		[getPublishes.fulfilled]: (state, action) => {
			const data = action.payload
			publishesAdapter.setAll(state, data?.results || data );
			state.totalCount = data?.count || data.length
			state.isLoading = false;
		},
		[updateMultiplepublishes.fulfilled]: (state, action) => {
			publishesAdapter.upsertMany(state, action.payload)
		},
	}
});

export const {
	openNewPublishDialog,
	closeNewPublishDialog,
	openEditPublishDialog,
	closeEditPublishDialog,
	openMultiplePublishDialog,
	closeMultiplePublishDialog
} = publishesSlice.actions;

export default publishesSlice.reducer;
