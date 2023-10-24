import React, { useEffect, useState } from 'react';
import history from "@/history";
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectSequences,
	getSequences,
	removeSequences,
	openNewSequenceDialog,
	openEditSequenceDialog,
	openMultipleSequenceDialog,
	openCsvCreateDialog,
	openCsvUpdateDialog,
} from './store/sequenceSlice';
import EntityTable from "@/components/core/Table/EntityTable";

function SequenceList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const data = useSelector(selectSequences);

	const isLoading = useSelector(({ sequenceApp }) => sequenceApp.sequences.isLoading);
	const rowCount = useSelector(({ sequenceApp }) => sequenceApp.sequences.totalCount);
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

			dispatch(getSequences(queryParams));
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
							history.push("/entity/sequence/" + row.original.uid + "/overview");
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
				header: 'Description',
				accessorKey: 'description',
			},
			{
				header: 'Created At',
				accessorKey: 'created_at',
				Cell: ({ row }) => (
					<span>{row.original.created_at && format(new Date(row.original.created_at), 'dd-MM-y hh:mm:ss')}</span>
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
			openEditDialog={openEditSequenceDialog}
			openNewDialog={openNewSequenceDialog}
			removeEntities={removeSequences}
			openMultipleDialog={openMultipleSequenceDialog}
			openCsvCreateDialog={openCsvCreateDialog}
			openCsvUpdateDialog={openCsvUpdateDialog}
		/>
	);
}

export default SequenceList;
