import React, { useEffect, useState } from 'react';
import history from "@/history";
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectAsset,
	getAssets,
	removeAssets,
	openNewAssetDialog,
	openEditAssetDialog,
	openMultipleAssetDialog,
	openCsvCreateDialog,
	openCsvUpdateDialog,
} from './store/assetSlice';
import EntityTable from "@/components/core/Table/EntityTable";

function AssetList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const data = useSelector(selectAsset);

	const isLoading = useSelector(({ assetApp }) => assetApp.assets.isLoading);
	const rowCount = useSelector(({ assetApp }) => assetApp.assets.totalCount);
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

			dispatch(getAssets(queryParams));
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
							history.push("/entity/asset/" + row.original.uid + "/overview");
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
				header: 'Asset Type',
				accessorKey: 'asset_type',
			},
			{
				header: 'Prefix',
				accessorKey: 'prefix',
			},
			{
				header: 'Client Name',
				accessorKey: 'client_name',
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
			openEditDialog={openEditAssetDialog}
			openNewDialog={openNewAssetDialog}
			removeEntities={removeAssets}
			openMultipleDialog={openMultipleAssetDialog}
			openCsvCreateDialog={openCsvCreateDialog}
			openCsvUpdateDialog={openCsvUpdateDialog}
		/>
	);
}

export default AssetList;
