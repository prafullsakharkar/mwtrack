import MaterialReactTable, {
	MRT_ShowHideColumnsButton,
	MRT_ToggleDensePaddingButton,
	MRT_ToggleFiltersButton,
	MRT_ToggleGlobalFilterButton

} from "material-react-table";
import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import history from "@history";
import Popover from '@mui/material/Popover';
import format from 'date-fns/format';
import { useParams, Link } from 'react-router-dom';
import { ExportToCsv } from 'export-to-csv';
import { CSVLink, CSVDownload } from "react-csv";
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectTasks,
	getTasks,
	removeTasks,
	openNewTaskDialog,
	openEditTaskDialog,
	openMultipleTaskDialog,
	openCsvCreateDialog,
	openCsvUpdateDialog
} from './store/tasksSlice';

function TasksList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const users = props.users;

	const data = useSelector(selectTasks);
	const [uploadMenu, setUploadMenu] = React.useState(null);
	const downloadFileName = routeParams.uid.replace(':', "_") + '_tasks.csv';
	const isLoading = useSelector(({ tasksApp }) => tasksApp.tasks.isLoading);

	const rowCount = useSelector(({ tasksApp }) => tasksApp.tasks.totalCount);
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
				header: '#',
				accessorKey: 'uid',
				Cell: ({ row }) => (
					<Typography 
						className="cursor-pointer"
						onClick={(event) => {
						event.preventDefault();
						history.push("/entity/task/" + row.original.uid + "/overview");
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
				header    : "Assignee(s)",
				accessorKey  : "users",
				Cell     : ({ row }) => (
					row.original.users ? (<AvatarGroup max={3}>
						{row.original.users.map((userId, index) => (
							<Tooltip key={index} title={users && users[userId]?.username} placement="top">
								<Avatar key={index} src={users && users[userId]?.avatar} sx={{ width: 32, height: 32 }}/>
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
				  <Button size="small" variant="outlined" sx={{ color : cell.getValue()?.color }}>
						{ cell.getValue()?.name }
					</Button>
				),
			},
			{
				header: 'Priority',
				accessorKey: 'priority',
				Cell: ({ cell }) => (                  
				  <Button size="small" variant="outlined" sx={{ color : cell.getValue()?.color }}>
						{ cell.getValue()?.name }
					</Button>
				),
			},
			{
				header: 'Start Date',
				accessorKey: 'start_date',
				Cell: ({ row }) => (
					<span>{row.original.start_date && format(new Date(row.original.start_date), 'dd-MM-y hh:mm:ss')}</span>
				),
			},
			{
				header: 'Reviewer',
				accessorKey: 'reviewer.username',
			},
			{
				header: 'Created At',
				accessorKey: 'created_at',
				Cell: ({ row }) => (
					<span>{row.original.created_at && format(new Date(row.original.created_at), 'dd-MM-y hh:mm:ss')}</span>
				),
			},
		],
		[users]
	);

	const csvOptions = {
		fieldSeparator: ',',
		quoteStrings: '"',
		decimalSeparator: '.',
		showLabels: true,
		useBom: true,
		useKeysAsHeaders: false,
		headers: columns.map((c) => c.header),
	};

	const csvExporter = new ExportToCsv(csvOptions);

	const handleExportRows = (rows) => {
		csvExporter.generateCsv(data);
	};

	const uploadMenuClick = event => {
		setUploadMenu(event.currentTarget);
	};

	const uploadMenuClose = () => {
		setUploadMenu(null);
	};

	return (
		<div className="flex flex-1 flex-col justify-center">
			<MaterialReactTable
				columns={columns}
				data={data}
				enableFullScreenToggle={false}
				enableColumnResizing
				enableColumnOrdering
				enablePinning
				enableRowSelection
				enableRowActions
				enableStickyHeader
				
				enableColumnFilters={false}
				manualFiltering
				manualPagination
				manualSorting
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

				muiTableContainerProps={{ sx: { maxHeight: (document.documentElement.offsetHeight - 250) } }}
				initialState={{ density: 'compact' }}
				displayColumnDefOptions={{
					'mrt-row-actions': {
						header: 'Actions', //change header text
						size: 100, //make actions column wider
					},
				}}
				renderRowActions={({ row, table }) => (
					<Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
						<IconButton
							color="textSecondary"
							onClick={(ev) => {
								ev.stopPropagation();
								dispatch(openEditTaskDialog(row.original));
							}}
						>
							<EditIcon />
						</IconButton>
						{/* <IconButton
							color="error"
							onClick={(ev) => {
								ev.stopPropagation();
								dispatch(removeTask(row.original.uid));
							}}
						>
							<DeleteIcon />
						</IconButton> */}
					</Box>
				)}

				positionToolbarAlertBanner="bottom" //show selected rows count on bottom taskbar				
				//add custom action buttons to top-left of top taskbar
				renderTopToolbarCustomActions={({ table }) => (
					<Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
						<Button
							color="primary"
							onClick={(ev) => {
								ev.stopPropagation();
								dispatch(openNewTaskDialog());
							}}
							variant="contained"
						>
							Create New
						</Button>
						{/* <Button
							color="error"
							disabled={!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())}
							onClick={() => {
								const ids = table.getSelectedRowModel().rows.map(row => row.original.uid)
								dispatch(removeTasks(ids));
							}}
							variant="contained"
						>
							Delete Selected
						</Button> */}
						<Button
							color="primary"
							disabled={!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())}
							onClick={() => {
								const ids = table.getSelectedRowModel().rows.map(row => row.original.uid)
								dispatch(openMultipleTaskDialog(ids));
							}}
							variant="contained"
						>
							Update Selected
						</Button>
					</Box>
				)}
				//customize built-in buttons in the top-right of top toolbar
				renderToolbarInternalActions={({ table }) => (
					<Box>

						{/* along-side built-in buttons in whatever order you want them */}
						<MRT_ToggleGlobalFilterButton table={table} />
						{/* <MRT_ToggleFiltersButton table={table} /> */}
						<MRT_ShowHideColumnsButton table={table} />
						{/* <MRT_ToggleDensePaddingButton table={table} /> */}
						{/* add custom button to print table  */}

						<Tooltip title="Upload From CSV">
							<IconButton
								onClick={uploadMenuClick}
								aria-label="open right sidebar"
							>
								<Icon>backup</Icon>
							</IconButton>
						</Tooltip>
						<Popover
							open={Boolean(uploadMenu)}
							anchorEl={uploadMenu}
							onClose={uploadMenuClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center'
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center'
							}}
							classes={{
								paper: 'py-8'
							}}
						>
							<>
								<MenuItem
									onClick={() => {
										dispatch(openCsvCreateDialog());
										uploadMenuClose();
									}}
								>
									<ListItemIcon className="min-w-40">
										<Icon>add_box</Icon>
									</ListItemIcon>
									<ListItemText primary="Bulk Create" />
								</MenuItem>
								<MenuItem
									onClick={() => {
										dispatch(openCsvUpdateDialog());
										uploadMenuClose();
									}}
								>
									<ListItemIcon className="min-w-40">
										<Icon>update</Icon>
									</ListItemIcon>
									<ListItemText primary="Bulk Update" />
								</MenuItem>
							</>
						</Popover>
						{/* <Tooltip title="Download Tasks">
							<CSVLink data={data} filename={downloadFileName}>
								<IconButton>
									<Icon>get_app</Icon>
								</IconButton>
							</CSVLink>
						</Tooltip> */}

						{/* <Tooltip title="Download Tasks">
							<IconButton
								disabled={table.getPrePaginationRowModel().rows.length === 0}
								//export all rows, including from the next page, (still respects filtering and sorting)
								onClick={() =>
									handleExportRows(table.getPrePaginationRowModel().rows)
								}
							>
								<FileDownloadIcon />
							</IconButton>
						</Tooltip> */}
					</Box>
				)}
			/>
		</div>
	);
}

export default TasksList;
