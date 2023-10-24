import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { showMessage } from '@/stores/core/messageSlice';

const url = '/api/v1/entity/episodes/';

export const getEpisodes = createAsyncThunk(
	'episodeApp/episode/getEpisodes',
	async (queryParams, { getState }) => {
		const uid = queryParams?.uid
		const entity = queryParams?.entity
		const endPoint = (entity && uid) ? '/api/v1/entity/' + entity + 's/' + uid + '/episodes/' : url

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

export const getEpisode = createAsyncThunk(
	'episodeApp/episode/getEpisode',
	async (routeParams, { dispatch, getState }) => {
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');
		const data = await response.data;
		return data;
	}
);

export const addEpisode = createAsyncThunk(
	'episodeApp/episode/addEpisode',
	async (episode, { dispatch, getState }) => {
		const response = await axios.post(url, episode);
		const data = await response.data;

		return data;
	}
);

export const addEpisodes = createAsyncThunk(
	'episodeApp/episode/addEpisodes',
	async (episodes, { dispatch, getState }) => {
		const response = await axios.post(url, episodes);
		const data = await response.data;

		return data;
	}
);

export const updateEpisode = createAsyncThunk(
	'episodeApp/episode/updateEpisode',
	async (episode, { dispatch, getState }) => {
		const id = episode.id
		delete episode['id']
		const response = await axios.patch(url + id + '/', episode);
		const data = await response.data;

		return data;
	}
);

export const updateMultipleEpisodes = createAsyncThunk(
	'episodeApp/episode/updateMultipleEpisodes',
	async ({ multipleEpisodeList, project }, { dispatch, getState }) => {
		const response = await axios.post('/api/v1/entity/projects/' + project + '/episode_bulk_update/', multipleEpisodeList);
		const data = await response.data;

		return data;
	}
);

export const removeEpisode = createAsyncThunk(
	'episodeApp/episode/removeEpisode',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;

		if (data) return id;

	}
);

export const removeEpisodes = createAsyncThunk(
	'episodeApp/episode/removeEpisodes',
	async (entityIds, { dispatch, getState }) => {
		confirmAlert({
			title: 'Confirm to delete episodes !!!',
			message: 'Are you sure, you want to remove selected episodes ?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						entityIds.map(row => {
							dispatch(removeEpisode(row))
						})
						dispatch(showMessage({ message: 'Episodes has been removed successfully !' }));

					}
				},
				{
					label: 'No',
					onClick: () => console.log("No action to remove episodes")
				}
			]
		});

		return entityIds;
	}
);

const episodesAdapter = createEntityAdapter({
	selectId: (entity) => entity.uid,
});

export const { selectAll: selectEpisodes, selectEntities: selectEpisode, selectById: selectEpisodeById } = episodesAdapter.getSelectors(
	state => state.episodeApp ? state.episodeApp.episodes : state.overviewApp.episodes
);

const episodesSlice = createSlice({
	name: 'episodeApp/episodes',
	initialState: episodesAdapter.getInitialState({
		totalCount: 0,
		isLoading: true,
		routeParams: {},
		episodeDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewEpisodeDialog: (state, action) => {
			state.episodeDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewEpisodeDialog: (state, action) => {
			state.episodeDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditEpisodeDialog: (state, action) => {
			state.episodeDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditEpisodeDialog: (state, action) => {
			state.episodeDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openMultipleEpisodeDialog: (state, action) => {
			state.episodeDialog = {
				type: 'multiple',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeMultipleEpisodeDialog: (state, action) => {
			state.episodeDialog = {
				type: 'multiple',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvCreateDialog: (state, action) => {
			state.episodeDialog = {
				type: 'csvCreate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvCreateDialog: (state, action) => {
			state.episodeDialog = {
				type: 'csvCreate',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvUpdateDialog: (state, action) => {
			state.episodeDialog = {
				type: 'csvUpdate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvUpdateDialog: (state, action) => {
			state.episodeDialog = {
				type: 'csvUpdate',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removeEpisode.fulfilled]: (state, action) => {
			episodesAdapter.removeOne(state, action.payload)
		},
		[updateEpisode.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				episodesAdapter.upsertMany(state, action.payload)
			} else {
				episodesAdapter.upsertOne(state, action.payload)
			}
		},
		[addEpisode.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				episodesAdapter.upsertMany(state, action.payload)
			} else {
				episodesAdapter.upsertOne(state, action.payload)
			}
		},
		[addEpisodes.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				episodesAdapter.upsertMany(state, action.payload)
			} else {
				episodesAdapter.upsertOne(state, action.payload)
			}
		},
		[getEpisode.fulfilled]: (state, action) => {
			episodesAdapter.upsertOne(state, action.payload);
		},
		[getEpisodes.pending]: (state, action) => {
			state.isLoading = true;
		},
		[getEpisodes.fulfilled]: (state, action) => {
			const data = action.payload
			episodesAdapter.setAll(state, data?.results || data);
			state.totalCount = data?.count || data.length
			state.isLoading = false;
		},
		[updateMultipleEpisodes.fulfilled]: (state, action) => {
			episodesAdapter.upsertMany(state, action.payload)
		},
	}
});

export const {
	openNewEpisodeDialog,
	closeNewEpisodeDialog,
	openEditEpisodeDialog,
	closeEditEpisodeDialog,
	openMultipleEpisodeDialog,
	closeMultipleEpisodeDialog,
	openCsvCreateDialog,
	closeCsvCreateDialog,
	openCsvUpdateDialog,
	closeCsvUpdateDialog
} = episodesSlice.actions;

export default episodesSlice.reducer;
