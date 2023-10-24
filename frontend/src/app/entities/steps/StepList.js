import React, { useEffect, useState } from 'react';
import history from "@/history";
import { Typography, Button } from '@mui/material';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectSteps,
	getSteps,
	removeSteps,
	openNewStepDialog,
	openEditStepDialog,
	openMultipleStepDialog,
	openCsvCreateDialog,
	openCsvUpdateDialog,
} from './store/stepSlice';
import EntityTable from "@/components/core/Table/EntityTable";

function StepList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const data = useSelector(selectSteps);

	const isLoading = useSelector(({ stepApp }) => stepApp.steps.isLoading);
	const rowCount = useSelector(({ stepApp }) => stepApp.steps.totalCount);
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

			dispatch(getSteps(queryParams));
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
				Cell: ({ row }) => (
					<Typography
						className="cursor-pointer"
						onClick={(event) => {
							event.preventDefault();
							history.push("/entity/step/" + row.original.uid + "/overview");
						}}>
						{row.original.uid}
					</Typography>
				)
			},
			{
				header: 'Name',
				accessorKey: 'name',
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
				header: 'Start Date',
				accessorKey: 'start_date',
				Cell: ({ cell }) => (
					<span>{cell.getValue() && format(new Date(cell.getValue()), 'dd-MM-y hh:mm:ss')}</span>
				),
			},
			{
				header: 'Retakes',
				accessorKey: 'retakes',
			},
			{
				header: 'Created At',
				accessorKey: 'created_at',
				Cell: ({ cell }) => (
					<span>{cell.getValue() && format(new Date(cell.getValue()), 'dd-MM-y hh:mm:ss')}</span>
				),
			},
		],
		[]
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
			openEditDialog={openEditStepDialog}
			openNewDialog={openNewStepDialog}
			removeEntities={removeSteps}
			openMultipleDialog={openMultipleStepDialog}
			openCsvCreateDialog={openCsvCreateDialog}
			openCsvUpdateDialog={openCsvUpdateDialog}
		/>
	);
}

export default StepList;
