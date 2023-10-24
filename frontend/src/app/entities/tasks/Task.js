import PageCarded from '@/components/core/PageCarded';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@/components/core/SvgIcon';
import withReducer from '@/stores/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from '@/components/core/Header/EntityHeader';
import TaskDialog from './TaskDialog';
import TasksList from './TaskList';
import AssignTaskSidebar from './AssignTaskSidebar';
import { getTasks, selectTasks, getAssignTasks } from './store/taskSlice';
import { getStatuses } from 'src/app/utilities/statuses/store/statusSlice';
import { getUsers } from 'src/app/accounts/users/store/userSlice';


function TasksApp(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);

	const type = props.type

	const taskDialog = useSelector(({ taskApp }) => taskApp.tasks.taskDialog);
	const totalCount = useSelector(({ taskApp }) => taskApp.tasks.totalCount);

	const userTasks = useSelector(({ taskApp }) => taskApp.tasks.userTasks);
	const taskEntities = useSelector(({ taskApp }) => taskApp.tasks.entities);
	const utilStepEntities = useSelector(({ taskApp }) => taskApp.utilSteps.entities);

	const users = useSelector(({ taskApp }) => taskApp.users.entities);
	const statuses = useSelector(({ taskApp }) => taskApp.status.entities);

	const episodeIds = useSelector(({ taskApp }) => taskApp.episodes.ids)
	const sequenceIds = useSelector(({ taskApp }) => taskApp.sequences.ids)
	const shotIds = useSelector(({ taskApp }) => taskApp.shots.ids)
	const assetIds = useSelector(({ taskApp }) => taskApp.assets.ids)
	const taskIds = useSelector(({ taskApp }) => taskApp.tasks.ids)

	useEffect(() => {
		if (type === 'Assignment') {
			dispatch(getAssignTasks())
			setLeftSidebarOpen(true)
		} else {
			// dispatch(getTasks(routeParams));
			setLeftSidebarOpen(false)
		}
	}, [type, routeParams]);

	useEffect(() => {
		dispatch(getStatuses());
		dispatch(getUsers());
	}, []);

	return (
		<>
			<PageCarded
				header={<EntityHeader entity='Tasks' totalCount={totalCount} />}
				content={<TasksList users={users} />}
				leftSidebarContent={
					<div className="px-16 py-24">
						<AssignTaskSidebar
							episodeIds={episodeIds}
							sequenceIds={sequenceIds}
							shotIds={shotIds}
							assetIds={assetIds}
							utilSteps={utilStepEntities}
						/>
					</div>
				}
				leftSidebarOpen={leftSidebarOpen}
				leftSidebarWidth={288}
				leftSidebarOnClose={() => {
					setLeftSidebarOpen(false);
				}}
				scroll={isMobile ? 'normal' : 'content'}
			/>
			<TaskDialog
				taskDialog={taskDialog}
				taskEntities={taskEntities}
				users={users}
				statuses={statuses}
				episodeIds={episodeIds}
				sequenceIds={sequenceIds}
				shotIds={shotIds}
				assetIds={assetIds}
				userTasks={userTasks}
				utilSteps={utilStepEntities}
				taskIds={taskIds}
			/>
		</>
	);
}

export default withReducer('taskApp', reducer)(TasksApp);

