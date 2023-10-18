import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const url = '/api/v1/account/groups/';

export const getGroups = createAsyncThunk('groupApp/groups/getGroups', async () => {
	const response = await axios.get(url);
	const data = await response.data;
	return data;
});

export const getGroup = createAsyncThunk(
	'groupApp/groups/getGroup',
	async (routeParams, { dispatch, getState }) => {
		routeParams = routeParams || getState().groupApp.groups.routeParams;
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');

		const data = await response.data;
		return { data, routeParams };
	}
);

export const addGroup = createAsyncThunk(
	'groupApp/groups/addGroup',
	async (group, { dispatch, getState }) => {
		const response = await axios.post(url, group);
		const data = await response.data;

		return data;
	}
);

export const updateGroup = createAsyncThunk(
	'groupApp/groups/updateGroup',
	async (group, { dispatch, getState }) => {
		const id = group.id
		delete group['id']
		const response = await axios.patch(url + id + '/', group);
		const data = await response.data;

		return data;
	}
);

export const removeGroup = createAsyncThunk(
	'groupApp/groups/removeGroup',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;

		return id;
	}
);

const groupsAdapter = createEntityAdapter({});

export const { selectAll: selectGroups, selectById: selectGroupsById } = groupsAdapter.getSelectors(
	state => state.groupApp.groups
);

const groupsSlice = createSlice({
	name: 'groupApp/groups',
	initialState: groupsAdapter.getInitialState({
		searchText: '',
		routeParams: {},
		groupDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		setGroupsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		resetGroupsSearchText: (state, action) => {
			state.searchText = '';
		},
		openNewGroupDialog: (state, action) => {
			state.groupDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewGroupDialog: (state, action) => {
			state.groupDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditGroupDialog: (state, action) => {
			state.groupDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditGroupDialog: (state, action) => {
			state.groupDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removeGroup.fulfilled]: (state, action) => {
			groupsAdapter.removeOne(state, action.payload)
		},
		[updateGroup.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				groupsAdapter.upsertMany(state, action.payload)
			} else {
				groupsAdapter.upsertOne(state, action.payload)
			}
		},
		[addGroup.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				groupsAdapter.upsertMany(state, action.payload)
			} else {
				groupsAdapter.upsertOne(state, action.payload)
			}
		},
		[getGroup.fulfilled]: (state, action) => {
			const { data, routeParams } = action.payload;

			groupsAdapter.upsertOne(state, data);
			state.routeParams = routeParams;
			state.searchText = '';
		},
		[getGroups.fulfilled]: (state, action) => {
			groupsAdapter.setAll(state, action.payload);
			state.searchText = '';
		}
	}
});

export const {
	setGroupsSearchText,
	resetGroupsSearchText,
	openNewGroupDialog,
	closeNewGroupDialog,
	openEditGroupDialog,
	closeEditGroupDialog,
} = groupsSlice.actions;

export default groupsSlice.reducer;
