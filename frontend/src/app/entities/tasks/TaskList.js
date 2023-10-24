import React, { useEffect, useState } from 'react';
import history from "@/history";
import { Typography, Button, Tooltip, Avatar, AvatarGroup } from '@mui/material';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectTasks,
	getTasks,
	removeTasks,
	openNewTaskDialog,
	openEditTaskDialog,
	openMultipleTaskDialog,
	openCsvCreateDialog,
	openCsvUpdateDialog,
} from './store/taskSlice';
import EntityTable from "@/components/core/Table/EntityTable";

function TaskList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const users = props.users
	const data = useSelector(selectTasks);

	const isLoading = useSelector(({ taskApp }) => taskApp.tasks.isLoading);
	const rowCount = useSelector(({ taskApp }) => taskApp.tasks.totalCount);
	const [isRefetching, setIsRefetching] = useState(false);
	const [globalFilter, setGlobalFilter] = useState('');
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 25,
	});


	useEffect(() => {
		const fetchData = () => {
			if (data.length) setIsRefetching(true);

			const queryParams = {
				page_size: pagination.pageSize,
				start: pagination.pageIndex * pagination.pageSize,
			}
			queryParams[routeParams.entity] = routeParams.uid
			if (globalFilter) queryParams.search = globalFilter

			const newSort = sorting.length > 0 && sorting.map(row => {
				return (row.desc) ? "-" + row.id : row.id
			}) || []

			if (newSort.length > 0) queryParams.ordering = newSort.join(',');

			dispatch(getTasks(queryParams));
			setIsRefetching(false);
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		globalFilter,
		pagination.pageIndex,
		pagination.pageSize,
		sorting,
		routeParams,
	]);

	useEffect(() => {
		setPagination({ pageIndex: 0, pageSize: 25 })
	}, [globalFilter])

	const columns = React.useMemo(
		() => [
			{
				header: 'Id',
				accessorKey: 'uid',
				Cell: ({ cell }) => (
					<Typography
						className="cursor-pointer"
						onClick={(event) => {
							event.preventDefault();
							history.push("/entity/task/" + cell.getValue() + "/overview");
						}}>
						{cell.getValue()}
					</Typography>
				)
			},
			{
				header: 'Name',
				accessorKey: 'name',
			},
			{
				header: "Assignee(s)",
				accessorKey: "users",
				Cell: ({ cell }) => (
					cell.getValue()?.length > 0 ? (<AvatarGroup max={3}>
						{cell.getValue().map((userId, index) => (
							<Tooltip key={index} title={users && users[userId]?.username} placement="top">
								<Avatar key={index} src={users && users[userId]?.avatar} sx={{ width: 32, height: 32 }} />
							</Tooltip>
						))}
					</AvatarGroup>) : (<span> No User </span>)
				),
			},
			{
				header: 'Bid (in days)',
				accessorKey: 'bid_days',
			},
			{
				header: 'Status',
				accessorKey: 'status',
				Cell: ({ cell }) => (
					<Button size="small" variant="outlined" sx={{ color: cell.getValue()?.color }}>
						{cell.getValue()?.name}
					</Button>
				),
			},
			{
				header: 'Priority',
				accessorKey: 'priority',
			},
			{
				header: 'Start Date',
				accessorKey: 'start_date',
				Cell: ({ cell }) => (
					<span>{cell.getValue() && format(new Date(cell.getValue()), 'dd-MM-y hh:mm:ss')}</span>
				),
			},
			{
				header: 'Reviewer',
				accessorKey: 'reviewer.username',
			},
			{
				header: 'Created At',
				accessorKey: 'created_at',
				Cell: ({ cell }) => (
					<span>{cell.getValue() && format(new Date(cell.getValue()), 'dd-MM-y hh:mm:ss')}</span>
				),
			},
		],
		[users]
	);

	return (
		<EntityTable
			columns={columns}
			data={data}

			onGlobalFilterChange={setGlobalFilter}
			onPaginationChange={setPagination}
			onSortingChange={setSorting}
			rowCount={rowCount}
			state={{
				globalFilter,
				isLoading,
				pagination,
				showProgressBars: isRefetching,
				sorting,
			}}
			openEditDialog={openEditTaskDialog}
			openNewDialog={openNewTaskDialog}
			removeEntities={removeTasks}
			openMultipleDialog={openMultipleTaskDialog}
			openCsvCreateDialog={openCsvCreateDialog}
			openCsvUpdateDialog={openCsvUpdateDialog}
		/>
	);
}

export default TaskList;
