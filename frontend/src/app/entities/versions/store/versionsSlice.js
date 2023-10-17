import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const url = '/api/v1/entity/version/';
export const getVersions = createAsyncThunk(
	'versionsApp/version/getVersions',
	async (queryParams, { getState }) => {
		const uid = queryParams?.uid
		const entity = queryParams?.entity

		const endPoint = (entity && uid) ? '/api/v1/entity/'+entity+'/'+uid+'/versions/' : url

		delete queryParams?.uid
		delete queryParams?.entity

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

export const getVersion = createAsyncThunk(
	'versionsApp/version/getVersion', 
	async (routeParams, { dispatch, getState }) => {
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');
		const data = await response.data;
		return data;
	}
);

export const addVersion = createAsyncThunk(
	'versionsApp/versions/addVersion',
	async (version, { dispatch, getState }) => {

		if (version.files && version.files.length > 0) {
			const formData = new FormData();
			for (let i = 0; i < version.files.length; i++) {
				formData.append(`files`, version.files[i])
			}

			const uploadResponse = await axios.post('/api/v1/upload/file/', formData);
			const uploadData = await uploadResponse.data;
			version.media_files = uploadData.map(item => item.id)
			delete version.files
		}
		const response = await axios.post(url, version);
		const data = await response.data;
		return data;
	}
);

export const updateVersion = createAsyncThunk(
	'versionsApp/versions/updateVersion',
	async (version, { dispatch, getState }) => {
		const id = version.id
		delete version['id']

		if (version.files && version.files.length > 0) {
			version.media_files = []
			const formData = new FormData();
			for (let i = 0; i < version.files.length; i++) {

				if (!version.files[i].id) {
					formData.append(`files`, version.files[i])
				} else {
					version.media_files = [...version.media_files, version.files[i].id]
				}
			}

			if (formData.get('files')) {
				const uploadResponse = await axios.post('/api/v1/upload/file/', formData);
				const uploadData = await uploadResponse.data;
				version.media_files = [...version.media_files, ...uploadData.map(item => item.id)]
			}
			delete version.files
		}
		const response = await axios.patch(url + id + '/', version);
		const data = await response.data;

		return data;
	}
);

export const updateMultipleVersions = createAsyncThunk(
	'versionsApp/version/updateMultipleVersions',
	async ({ multipleVersionList, project }, { dispatch, getState }) => {
		const response = await axios.post('/api/v1/entity/project/' + project + '/version_bulk_update/', multipleVersionList);
		const data = await response.data;
		return data;
	}
);

export const removeVersion = createAsyncThunk(
	'versionsApp/versions/removeVersion',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;
		return id;
	}
);

export const removeVersions = createAsyncThunk(
	'versionsApp/versions/removeVersions',
	async (versionIds, { dispatch, getState }) => {
		const response = await axios.post('/api/versions-app/remove-versions', { versionIds });
		const data = await response.data;
		return versionIds;
	}
);

const versionsAdapter = createEntityAdapter({
	selectId: (entity) => entity.uid,
	// sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const { selectAll: selectVersions, selectById: selectVersionById } = versionsAdapter.getSelectors(
	state => state.versionsApp?.versions || state.overviewApp?.versions 
);

const versionsSlice = createSlice({
	name: 'versionsApp/versions',
	initialState: versionsAdapter.getInitialState({
		totalCount: 0,
		isLoading: true,
		versionDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewVersionDialog: (state, action) => {
			state.versionDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewVersionDialog: (state, action) => {
			state.versionDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditVersionDialog: (state, action) => {
			state.versionDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditVersionDialog: (state, action) => {
			state.versionDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openMultipleVersionDialog: (state, action) => {
			state.versionDialog = {
				type: 'multiple',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeMultipleVersionDialog: (state, action) => {
			state.versionDialog = {
				type: 'multiple',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removeVersion.fulfilled]: (state, action) => {			
			versionsAdapter.removeOne(state, action.payload)		
		},
		[updateVersion.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				versionsAdapter.upsertMany(state, action.payload)
			} else {
				versionsAdapter.upsertOne(state, action.payload)
			}
		},
		[addVersion.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				versionsAdapter.upsertMany(state, action.payload)
			} else {
				versionsAdapter.addOne(state, action.payload)
			}
		},
		[getVersion.fulfilled]: (state, action) => {
			versionsAdapter.upsertOne(state, action.payload);
		},
		[getVersions.pending]: (state, action) => {
			state.isLoading = true;
		},
		[getVersions.fulfilled]: (state, action) => {
			const data = action.payload
			versionsAdapter.setAll(state, data?.results || data );
			state.totalCount = data?.count || data.length
			state.isLoading = false;
		},
		[updateMultipleVersions.fulfilled]: (state, action) => {
			versionsAdapter.upsertMany(state, action.payload)
		},
	}
});

export const {
	setVersionsSearchText,
	resetVersionsSearchText,
	openNewVersionDialog,
	closeNewVersionDialog,
	openEditVersionDialog,
	closeEditVersionDialog,
	openMultipleVersionDialog,
	closeMultipleVersionDialog
} = versionsSlice.actions;

export default versionsSlice.reducer;
