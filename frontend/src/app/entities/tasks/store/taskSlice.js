import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { showMessage } from '@/stores/core/messageSlice';

const url = '/api/v1/entity/tasks/';
export const getTasks = createAsyncThunk(
	'taskApp/task/getTasks',
	async (queryParams, { getState }) => {
		const uid = queryParams?.uid
		const entity = queryParams?.entity

		const endPoint = (entity && uid) ? '/api/v1/entity/' + entity + 's/' + uid + '/tasks/' : url

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

export const getTask = createAsyncThunk(
	'taskApp/task/getTask',
	async (routeParams, { dispatch, getState }) => {
		const id = routeParams.uid
		const response = await axios.get(url + id + '/');
		const data = await response.data;
		return data;
	}
);

export const getTaskUsers = createAsyncThunk(
	'taskApp/tasks/getTaskUser',
	async (taskId, { dispatch, getState }) => {
		const response = await axios.get('/api/v1/entity/tasks/' + taskId + "/user_tasks/");
		const data = await response.data;
		return data;
	}
);

export const getAssignTasks = createAsyncThunk(
	'taskApp/tasks/getAssignTasks',
	async (stepIds, { dispatch, getState }) => {
		const response = await axios.get(url, {
			params: { steps: stepIds + '' }
		});
		const data = await response.data;
		return data;
	}
);

export const addTasks = createAsyncThunk(
	'taskApp/task/addTasks',
	async (tasks, { dispatch, getState }) => {
		let task_users = []
		if (Array.isArray(tasks)) {
			tasks.map((item) => {
				if (item?.task_users?.length > 0) {
					task_users = [...task_users, ...item.task_users]
				}
			})
		} else {
			task_users = tasks?.task_users && [...task_users, ...tasks.task_users]
		}

		return await axios.post(url, tasks)
			.then((response) => {
				task_users.length > 0 && dispatch(addUserTasks(task_users))
				return response.data
			})
			.catch((error) => {
				console.info(error.response)
				return []
			})
	}
);

export const addUserTasks = createAsyncThunk(
	'taskApp/task/addUserTasks',
	async (usertasks, { dispatch, getState }) => {
		const response = await axios.post('/api/v1/entity/usertasks/', usertasks);
		const data = await response.data;
		return data;
	}
);

export const updateUserTasks = createAsyncThunk(
	'taskApp/task/updateTask',
	async (task_users, { dispatch, getState }) => {
		const response = await axios.post('/api/v1/entity/projects/' + project + '/user_task_bulk_update/', task_users);
		const data = await response.data;
		return data;
	}
);

export const removeUserTask = createAsyncThunk(
	'taskApp/tasks/updateTaskUser',
	async (id, { dispatch, getState }) => {
		await axios.delete('/api/v1/entity/usertasks/' + id + '/');
		return id
	}
);

export const updateMultipleTasks = createAsyncThunk(
	'taskApp/task/updateMultipleTasks',
	async ({ multipleTaskList, project }, { dispatch, getState }) => {

		let task_users = []
		let remove_users = []
		if (Array.isArray(multipleTaskList)) {
			multipleTaskList.map((item) => {
				if (item?.task_users?.length > 0) {
					task_users = [...task_users, ...item.task_users]
				}
				if (item?.remove_users?.length > 0) {
					remove_users = [...remove_users, ...item.remove_users]
				}
			})
		} else {
			task_users = multipleTaskList?.task_users && [...task_users, ...multipleTaskList.task_users] || []
			remove_users = multipleTaskList?.remove_users && [...remove_users, ...multipleTaskList.remove_users] || []
		}
		const add_users = task_users.length > 0 && task_users.filter((item) => !item.id)
		add_users.length > 0 && dispatch(addUserTasks(add_users))

		const update_users = task_users.length > 0 && task_users.filter((item) => item.id)
		update_users.length > 0 && dispatch(updateUserTasks(update_users))

		remove_users.length > 0 && remove_users.map((item) => dispatch(removeUserTask(item)))
		let response = null
		if (Array.isArray(multipleTaskList)) {
			response = await axios.post('/api/v1/entity/projects/' + project + '/task_bulk_update/', multipleTaskList);
		} else {
			response = await axios.patch(url + multipleTaskList.id + '/', multipleTaskList);
		}
		const data = await response.data;
		return data
	}
);

export const removeTask = createAsyncThunk(
	'taskApp/task/removeTask',
	async (id, { dispatch, getState }) => {
		const response = await axios.delete(url + id + '/');
		const data = await response.data;
		if (data) return id;
	}
);

export const removeTasks = createAsyncThunk(
	'taskApp/task/removeTasks',
	async (entityIds, { dispatch, getState }) => {
		confirmAlert({
			title: 'Confirm to delete tasks !!!',
			message: 'Are you sure, you want to remove selected tasks ?',
			buttons: [
				{
					label: 'Yes',
					onClick: () => {
						entityIds.map(row => {
							dispatch(removeTask(row))
						})
						dispatch(showMessage({ message: 'Tasks has been removed successfully !' }));
					}
				},
				{
					label: 'No',
					onClick: () => console.log("No action to remove tasks")
				}
			]
		});

		return entityIds;
	}
);

const tasksAdapter = createEntityAdapter({
	selectId: (entity) => entity.uid,
});

export const { selectAll: selectTasks, selectEntities: selectTask, selectById: selectTaskById } = tasksAdapter.getSelectors(
	state => state.taskApp ? state.taskApp.tasks : state.overviewApp.tasks
);

const tasksSlice = createSlice({
	name: 'taskApp/tasks',
	initialState: tasksAdapter.getInitialState({
		totalCount: 0,
		isLoading: true,
		taskDialog: {
			type: 'new',
			props: {
				open: false
			},
			data: null
		}
	}),
	reducers: {
		openNewTaskDialog: (state, action) => {
			state.taskDialog = {
				type: 'new',
				props: {
					open: true
				},
				data: null
			};
		},
		closeNewTaskDialog: (state, action) => {
			state.taskDialog = {
				type: 'new',
				props: {
					open: false
				},
				data: null
			};
		},
		openEditTaskDialog: (state, action) => {
			state.taskDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditTaskDialog: (state, action) => {
			state.taskDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		},
		openMultipleTaskDialog: (state, action) => {
			state.taskDialog = {
				type: 'multiple',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeMultipleTaskDialog: (state, action) => {
			state.taskDialog = {
				type: 'multiple',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvCreateDialog: (state, action) => {
			state.taskDialog = {
				type: 'csvCreate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvCreateDialog: (state, action) => {
			state.taskDialog = {
				type: 'csvCreate',
				props: {
					open: false
				},
				data: null
			};
		},
		openCsvUpdateDialog: (state, action) => {
			state.taskDialog = {
				type: 'csvUpdate',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeCsvUpdateDialog: (state, action) => {
			state.taskDialog = {
				type: 'csvUpdate',
				props: {
					open: false
				},
				data: null
			};
		},
	},
	extraReducers: {
		[removeTask.fulfilled]: (state, action) => {
			tasksAdapter.removeOne(state, action.payload)
		},
		[addTasks.fulfilled]: (state, action) => {
			if (action.payload.length > 0) {
				tasksAdapter.upsertMany(state, action.payload)
			} else {
				tasksAdapter.upsertOne(state, action.payload)
			}
		},
		[getTask.fulfilled]: (state, action) => {
			tasksAdapter.upsertOne(state, action.payload);
		},
		[getTasks.pending]: (state, action) => {
			state.isLoading = true;
		},
		[getTasks.fulfilled]: (state, action) => {
			const data = action.payload
			tasksAdapter.setAll(state, data?.results || data);
			state.totalCount = data?.count || data.length
			state.isLoading = false;
		},
		[getTaskUsers.fulfilled]: (state, action) => {
			state.userTasks = action.payload;
		},
		[getAssignTasks.fulfilled]: (state, action) => {
			// state.assignTasks = action.payload;
			const data = action.payload;
			tasksAdapter.setAll(state, data ? data : []);
		},
		[updateMultipleTasks.fulfilled]: (state, action) => {
			if (Array.isArray(action.payload)) {
				tasksAdapter.upsertMany(state, action.payload)
			} else {
				tasksAdapter.upsertOne(state, action.payload)
			}
		},
	}
});

export const {
	openNewTaskDialog,
	closeNewTaskDialog,
	openEditTaskDialog,
	closeEditTaskDialog,
	openMultipleTaskDialog,
	closeMultipleTaskDialog,
	openCsvCreateDialog,
	closeCsvCreateDialog,
	openCsvUpdateDialog,
	closeCsvUpdateDialog
} = tasksSlice.actions;

export default tasksSlice.reducer;
