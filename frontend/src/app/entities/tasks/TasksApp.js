import FusePageCarded from '@fuse/core/FusePageCarded';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Link } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from './store';
import EntityHeader from 'app/shared-components/header/EntityHeader';
import TaskDialog from './TaskDialog';
import TasksList from './TasksList';
import AssignTaskSidebar from './AssignTaskSidebar';
import { getTasks, selectTasks, getAssignTasks } from './store/tasksSlice';
import { getStatuses } from 'src/app/main/apps/utilities/statuses/store/statusesSlice';
import { getPriorities } from 'src/app/main/apps/utilities/priorities/store/prioritiesSlice';
import { getAccounts } from 'src/app/main/apps/users/accounts/store/accountsSlice';


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
		dispatch(getAccounts());
	}, []);

	return (
		<>
			<FusePageCarded
				header={
					<div className="flex items-center justify-center h-full w-full">
						{ type === 'Assignment' && (<IconButton
							onClick={(ev) => setLeftSidebarOpen(!leftSidebarOpen)}
							aria-label="toggle left sidebar"
							size="large"
						>
							<FuseSvgIcon>heroicons-outline:view-list</FuseSvgIcon>
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

