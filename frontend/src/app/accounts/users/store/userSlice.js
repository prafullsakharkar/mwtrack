import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const url = '/api/v1/account/users/';

export const getUsers = createAsyncThunk(
	'userApp/users/getUsers',
	async (queryParams, { getState }) => {
		const id = queryParams?.id
		const entity = queryParams?.entity

		const endPoint = (entity === 'group' && id)
			? '/api/v1/user/group/' + id + '/users/'
			: (entity === 'project' && id)
				? '/api/v1/entity/project/' + id + '/users/'
				: url

		delete queryParams?.id
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

export const addUser = createAsyncThunk(
	'userApp/users/addUser',
	async (data, { dispatch, getState }) => {
		delete data.avatar;
		// user['re_password'] = user['password'];
		console.log(data)
		const response = await axios.post(url, data);
		const payload = await response.data;

		return payload;
	}
);

export const updateUser = createAsyncThunk(
	'userApp/users/updateUser',
	async (data, { dispatch, getState }) => {
		const id = data.id
		delete data.id
		const response = await axios.patch(url + id + '/', data);
		const payload = await response.data;

		return payload;
	}
);

export const addUserToProjects = createAsyncThunk(
	'userApp/users/addUserToProject',
	async (data, { dispatch, getState }) => {
		data.projects.forEach((project, index) => {
			const response = axios.post('/api/v1/entity/project/' + project + '/add_users/', data.users);
			const r_data = response.data;
		})
	}
);

export const removeUserFromProjects = createAsyncThunk(
	'userApp/users/removeUserFromProjects',
	async (data, { dispatch, getState }) => {
		data.projects.forEach((project, index) => {
			const response = axios.post('/api/v1/entity/project/' + project + '/remove_users/', data.users);
			const r_data = response.data;
		})
	}
);

export const addUserToGroups = createAsyncThunk(
	'userApp/users/addUserToGroups',
	async (data, { dispatch, getState }) => {
		data.users.forEach((userId, index) => {
			const response = axios.post(url + userId + '/add_groups/', data.groups);
			const r_data = response.data;
		})
	}
);

export const removeUserFromGroups = createAsyncThunk(
	'userApp/users/removeUserFromGroups',
	async (data, { dispatch, getState }) => {
		data.users.forEach((userId, index) => {
			const response = axios.post(url + userId + '/remove_groups/', data.groups);
			const r_data = response.data;
		})
	}
);

export const removeUser = createAsyncThunk(
	'userApp/users/removeUser',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;

		return data;
	}
);

export const removeUsers = createAsyncThunk(
	'userApp/users/removeUsers',
	async (userIds, { dispatch, getState }) => {
		userIds.forEach((id, index) => {
			const data = {
				id: id,
				is_active: false
			}
			dispatch(updateUser(data))
		})

	}
);

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectUsers, selectById: selectUserById } = usersAdapter.getSelectors(
	state => state.userApp.users
);

const usersSlice = createSlice({
	name: 'userApp/users',
	initialState: usersAdapter.getInitialState({
		totalCount: 0,
		isLoading: true,
	}),
	extraReducers: {
		[removeUser.fulfilled]: usersAdapter.removeOne,
		[updateUser.fulfilled]: usersAdapter.upsertOne,
		[addUser.fulfilled]: usersAdapter.addOne,
		[getUsers.pending]: (state, action) => {
			// usersAdapter.setAll(state, []);
			state.isLoading = true;
		},
		[getUsers.fulfilled]: (state, action) => {
			const data = action.payload
			usersAdapter.setAll(state, data?.results || data);
			state.totalCount = data?.count || data.length
			state.isLoading = false;
		}
	}
});

export default usersSlice.reducer;
