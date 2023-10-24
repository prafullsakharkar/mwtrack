import React, { useEffect, useState } from 'react';
import history from "@/history";
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectNotes,
	getNotes,
	removeNotes,
	openNewNoteDialog,
	openEditNoteDialog,
	openMultipleNoteDialog,
} from './store/noteSlice';
import EntityTable from "@/components/core/Table/EntityTable";
import LightBoxImageList from '@/components/core/Image/LightBoxImageList';

function NoteList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const data = useSelector(selectNotes);

	const isLoading = useSelector(({ noteApp }) => noteApp.notes.isLoading);
	const rowCount = useSelector(({ noteApp }) => noteApp.notes.totalCount);
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

			dispatch(getNotes(queryParams));
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
				accessorKey: 'id',
				Cell: ({ cell }) => (
					<Typography
						className="cursor-pointer"
						onClick={(event) => {
							event.preventDefault();
							history.push("/entity/note/" + cell.getValue() + "/overview");
						}}>
						{cell.getValue()}
					</Typography>
				)
			},
			{
				header: "Attachments",
				accessorKey: "attachments",
				Cell: ({ cell }) => (
					cell.getValue() ? (<LightBoxImageList media_files={cell.getValue()} />) : null)
			},
			{
				header: 'Comment',
				accessorKey: 'message',
			},
			{
				header: 'Link',
				accessorKey: 'step',
				Cell: ({ row }) => (
					<span>
						{row.original.step
							? row.original.step : row.original.asset
								? row.original.asset : row.original.shot
									? row.original.shot : row.original.sequence
										? row.original.sequence : row.original.episode
											? row.original.episode : row.original.project
						}
					</span>
				),
			},
			{
				header: 'Created By',
				accessorKey: 'created_by.username',
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
			openEditDialog={openEditNoteDialog}
			openNewDialog={openNewNoteDialog}
			removeEntities={removeNotes}
			openMultipleDialog={openMultipleNoteDialog}
		/>
	);
}

export default NoteList;
