import MaterialReactTable, {
	MRT_ShowHideColumnsButton,
	MRT_ToggleDensePaddingButton,
	MRT_ToggleFiltersButton,
	MRT_ToggleGlobalFilterButton

} from "material-react-table";
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
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
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {
	Edit as EditIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectVersions,
	getVersions,
	openNewVersionDialog,
	openEditVersionDialog,
	openMultipleVersionDialog,
} from './store/versionsSlice';

import LightBoxImageList from "app/shared-components/image/LightBoxImageList";

function VersionsList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const data = useSelector(selectVersions);
	const [uploadMenu, setUploadMenu] = React.useState(null);
	const downloadFileName = routeParams.uid.replace(':', "_") + '_versions.csv';
	const isLoading = useSelector(({ versionsApp }) => versionsApp.versions.isLoading);

	const rowCount = useSelector(({ versionsApp }) => versionsApp.versions.totalCount);
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

			dispatch(getVersions(queryParams));
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
						history.push("/entity/version/" + row.original.uid + "/overview");
					}}>
						{row.original.uid}
					</Typography>
				)
			},
			{
				header    : "Media Files",
				accessorKey  : "media_files",
				Cell     : ({ cell }) => (
					cell.getValue() ? (<LightBoxImageList media_files={cell.getValue()}/>) : null)           
			},
			{
				header: 'Name',
				accessorKey: 'name',
			},
			{
				header: 'Version',
				accessorKey: 'version_number',
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
				header: 'Description',
				accessorKey: 'description',
			},
			{
				header: 'Created By',
				accessorKey: 'created_by.username',
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
				enableRowActions
				enableRowSelection
				enableStickyHeader
				enableStickyFooter
				
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

				initialState={{ density: 'compact' }}
				muiTableContainerProps={{ sx: { maxHeight: (document.documentElement.offsetHeight - 250) } }}
				renderRowActions={({ row, table }) => (
					<Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
						<IconButton
							color="textSecondary"
							onClick={(ev) => {
								ev.stopPropagation();
								dispatch(openEditVersionDialog(row.original));
							}}
						>
							<EditIcon />
						</IconButton>
						{/* <IconButton
							color="error"
							onClick={(ev) => {
								ev.stopPropagation();
								dispatch(removeVersion(row.original.uid));
							}}
						>
							<DeleteIcon />
						</IconButton> */}
					</Box>
				)}

				positionToolbarAlertBanner="bottom" //show selected rows count on bottom versionbar				
				//add custom action buttons to top-left of top versionbar
				renderTopToolbarCustomActions={({ table }) => (
					<Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
						<Button
							color="primary"
							onClick={(ev) => {
								ev.stopPropagation();
								dispatch(openNewVersionDialog());
							}}
							variant="contained"
						>
							Create New
						</Button>
						<Button
							color="primary"
							disabled={!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())}
							onClick={() => {
								const ids = table.getSelectedRowModel().rows.map(row => row.original.uid)
								dispatch(openMultipleVersionDialog(ids));
							}}
							variant="contained"
						>
							Update Selected
						</Button>
					</Box>
				)}
			/>
		</div>
	);
}

export default VersionsList;
