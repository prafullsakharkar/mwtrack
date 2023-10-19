import PageCarded from '@/components/core/PageCarded';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@/components/core/SvgIcon';
import { Link } from 'react-router-dom';
import withReducer from '@/stores/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useThemeMediaQuery from '@/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from '@/components/core/header/EntityHeader';
import TaskDialog from './TaskDialog';
import TasksList from './TasksList';
import AssignTaskSidebar from './AssignTaskSidebar';
import { getTasks, selectTasks, getAssignTasks } from './store/tasksSlice';
import { getStatuses } from 'src/app/utilities/statuses/store/statusesSlice';
import { getPriorities } from 'src/app/utilities/priorities/store/prioritiesSlice';
import { getUsers } from 'src/app/accounts/users/store/userSlice';


function TasksApp(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);

	const type = props.type

	const data = useSelector(selectTasks);
	const taskDialog = useSelector(({ tasksApp }) => tasksApp.tasks.taskDialog);
	const totalCount = useSelector(({ tasksApp }) => tasksApp.tasks.totalCount);

	const userTasks = useSelector(({ tasksApp }) => tasksApp.tasks.userTasks);
	const taskEntities = useSelector(({ tasksApp }) => tasksApp.tasks.entities);
	const utilStepEntities = useSelector(({ tasksApp }) => tasksApp.utilSteps.entities);

	const users = useSelector(({ tasksApp }) => tasksApp.users.entities);
	const statuses = useSelector(({ tasksApp }) => tasksApp.status.entities);
	const priorities = useSelector(({ tasksApp }) => tasksApp.priorities.entities);

	const episodeIds = useSelector(({ tasksApp }) => tasksApp.episodes.ids)
	const sequenceIds = useSelector(({ tasksApp }) => tasksApp.sequences.ids)
	const shotIds = useSelector(({ tasksApp }) => tasksApp.shots.ids)
	const assetIds = useSelector(({ tasksApp }) => tasksApp.assets.ids)
	const taskIds = useSelector(({ tasksApp }) => tasksApp.tasks.ids)

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
		dispatch(getPriorities());
		dispatch(getUsers());
	}, []);

	return (
		<>
			<PageCarded
				header={
					<div className="flex items-center justify-center h-full w-full">
						{type === 'Assignment' && (<IconButton
							onClick={(ev) => setLeftSidebarOpen(!leftSidebarOpen)}
							aria-label="toggle left sidebar"
							size="large"
						>
							<SvgIcon>heroicons-outline:view-list</SvgIcon>
						</IconButton>)}
						<EntityHeader entity='Tasks' totalCount={totalCount} />
					</div>
				}
				content={<TasksList
					users={users}
					statuses={statuses}
					priorities={priorities}
				/>}
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
				priorities={priorities}
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

export default withReducer('tasksApp', reducer)(TasksApp);

