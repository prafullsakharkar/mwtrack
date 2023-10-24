import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { showMessage } from '@/stores/core/messageSlice';

const url = '/api/v1/entity/notes/';
export const getNotes = createAsyncThunk(
	'noteApp/note/getNotes',
	async (queryParams, { getState }) => {
		const uid = queryParams?.uid
		const entity = queryParams?.entity
		const user = queryParams?.user

		const endPoint = (entity && uid)
			? '/api/v1/entity/' + entity + 's/' + uid + '/notes/'
			: (user)
				? '/api/v1/account/users/' + user + '/notes/'
				: url

		delete queryParams?.uid
		delete queryParams?.entity

		return await axios.get(endPoint, { params: queryParams })
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

export const getNote = createAsyncThunk(
	'noteApp/note/getNote',
	async (routeParams, { dispatch, getState }) => {
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');
		const data = await response.data;
		return data;
	}
);

export const addNote = createAsyncThunk('noteApp/notes/addNote', async note => {

	if (note.files && note.files.length > 0) {
		const formData = new FormData();
		for (let i = 0; i < note.files.length; i++) {
			formData.append(`files`, note.files[i])
		}

		const uploadResponse = await axios.post('/api/v1/utility/uploadfiles/', formData);
		const uploadData = await uploadResponse.data;
		note.attachments = uploadData.map(item => item.id)
		delete note.files
	}
	const response = await axios.post(url, note);
	const data = await response.data;

	// dispatch(showMessage({ message: 'Note has been Added successfully !' }));
	return data;
});

export const addNotes = createAsyncThunk(
	'noteApp/note/addNotes',
	async (multipleNoteList, { dispatch, getState }) => {
		const response = await axios.post(url, multipleNoteList);
		const data = await response.data;
		return data;
	}
);

export const updateNote = createAsyncThunk(
	'noteApp/note/updateNote',
	async (note, { dispatch, getState }) => {
		const id = note.id
		delete note['id']
		const response = await axios.patch(url + id + '/', note);
		const data = await response.data;
		return data;
	}
);

export const updateMultipleNotes = createAsyncThunk(
	'noteApp/note/updateMultipleNotes',
	async ({ multipleNoteList, project }, { dispatch, getState }) => {
		const response = await axios.post('/api/v1/entity/projects/' + project + '/note_bulk_update/', multipleNoteList);
		const data = await response.data;
		return data;
	}
);

export const removeNote = createAsyncThunk(
	'noteApp/note/removeNote',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;
		if (data) return id;

	}
);

export const removeNotes = createAsyncThunk(
	'noteApp/note/removeNotes',
	async (entityIds, { dispatch, getState }) => {
		confirmAlert({
			title: 'Confirm to delete notes !!!',
			message: 'Are you sure, you want to remove selected notes ?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						entityIds.map(row => {
							dispatch(removeNote(row))
						})
						dispatch(showMessage({ message: 'Notes has been removed successfully !' }));

					}
				},
				{
					label: 'No',
					onClick: () => console.log("No action to remove notes")
				}
			]
		});

		return entityIds;
	}
);

export const replyNote = createAsyncThunk('noteApp/notes/replyNote', async (reply, { dispatch, getState }) => {

	console.log(reply)
	const formData = new FormData();
	formData.append('message', reply.message)
	formData.append('note', reply.id)
	formData.append('project', reply.project)
	if (reply.files && reply.files.length > 0) {
		for (let i = 0; i < reply.files.length; i++) {
			formData.append(`attachments`, reply.files[i])
		}
	}
	const response = await axios.post('/api/v1/entity/replies/', formData);
	const data = await response.data;

	dispatch(getNote({ uid: reply.id }))
	return data;
});

export const updateReply = createAsyncThunk(
	'noteApp/notes/updateNote',
	async (reply, { dispatch, getState }) => {
		const id = reply.id
		delete reply['id']
		const response = await axios.patch('/api/v1/entity/replies/' + id + '/', reply);
		const data = await response.data;

		dispatch(getNote({ uid: reply.note_id }))
		return data;
	}
);

const notesAdapter = createEntityAdapter({
	// sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const { selectAll: selectNotes, selectEntities: selectNote, selectById: selectNoteById } = notesAdapter.getSelectors(
	state => state.noteApp ? state.noteApp.notes : state.overviewApp ? state.overviewApp.notes : state.profileApp.notes
);

const notesSlice = createSlice({
	name: 'noteApp/notes',
	initialState: notesAdapter.getInitialState({
		totalCount: 0,
		isLoading: true,
		noteDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewNoteDialog: (state, action) => {
			state.noteDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewNoteDialog: (state, action) => {
			state.noteDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditNoteDialog: (state, action) => {
			state.noteDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditNoteDialog: (state, action) => {
			state.noteDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditReplyDialog: (state, action) => {
			state.noteDialog = {
				type: 'editReply',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditReplyDialog: (state, action) => {
			state.noteDialog = {
				type: 'editReply',
				props: {
					open: false
				},
				data: null
			};
		},
		openMultipleNoteDialog: (state, action) => {
			state.noteDialog = {
				type: 'multiple',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeMultipleNoteDialog: (state, action) => {
			state.noteDialog = {
				type: 'multiple',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvCreateDialog: (state, action) => {
			state.noteDialog = {
				type: 'csvCreate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvCreateDialog: (state, action) => {
			state.noteDialog = {
				type: 'csvCreate',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvUpdateDialog: (state, action) => {
			state.noteDialog = {
				type: 'csvUpdate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvUpdateDialog: (state, action) => {
			state.noteDialog = {
				type: 'csvUpdate',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removeNote.fulfilled]: (state, action) => {
			notesAdapter.removeOne(state, action.payload)
		},
		[updateNote.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				notesAdapter.upsertMany(state, action.payload)
			} else {
				notesAdapter.upsertOne(state, action.payload)
			}
		},
		[addNote.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				notesAdapter.upsertMany(state, action.payload)
			} else {
				notesAdapter.upsertOne(state, action.payload)
			}
		},
		[addNotes.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				notesAdapter.upsertMany(state, action.payload)
			} else {
				notesAdapter.upsertOne(state, action.payload)
			}
		},
		[getNote.fulfilled]: (state, action) => {
			notesAdapter.upsertOne(state, action.payload);
		},
		[getNotes.pending]: (state, action) => {
			state.isLoading = true;
		},
		[getNotes.fulfilled]: (state, action) => {
			const data = action.payload
			notesAdapter.setAll(state, data?.results || data);
			state.totalCount = data?.count || data.length
			state.isLoading = false;
		},
		[updateMultipleNotes.fulfilled]: (state, action) => {
			notesAdapter.upsertMany(state, action.payload)
		},
	}
});

export const {
	openNewNoteDialog,
	closeNewNoteDialog,
	openEditNoteDialog,
	closeEditNoteDialog,
	openMultipleNoteDialog,
	closeMultipleNoteDialog,
	openCsvCreateDialog,
	closeCsvCreateDialog,
	openCsvUpdateDialog,
	closeCsvUpdateDialog,
	openEditReplyDialog,
	closeEditReplyDialog
} = notesSlice.actions;

export default notesSlice.reducer;
