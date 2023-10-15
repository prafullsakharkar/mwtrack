import { motion } from 'framer-motion';
import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import MaterialReactTable from 'material-react-table';
import React, { useEffect, useState } from 'react';
import { Box, IconButton, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import format from 'date-fns/format';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUsers } from './store/userSlice';
import SvgIcon from '@/components/core/SvgIcon';

function UsersList(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();
	const data = useSelector(selectUsers);
	const isLoading = useSelector(({ userApp }) => userApp.users.isLoading);

	if (!data) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="text.secondary" variant="h5">
					There are no contacts!
				</Typography>
			</div>
		)
	}

	const columns = React.useMemo(
		() => [
			{
				header: 'Id',
				accessorKey: 'id',
				size: 60,
			},
			{
				header: 'Avatar',
				accessorKey: 'avatar',
				Cell: ({ row }) => {
					return <Avatar className="mx-8" alt={row.original.name} src={row.original.avatar} sx={{ width: 32, height: 32 }} />;
				},
				size: 80,
			},
			{
				header: 'User Name',
				accessorKey: 'username',
				size: 120,
			},
			{
				header: 'First Name',
				accessorKey: 'first_name',
			},
			{
				header: 'Last Name',
				accessorKey: 'last_name',
			},
			{
				header: 'Role',
				accessorKey: 'role',
				size: 100,
			},
			{
				header: 'Email',
				accessorKey: 'email',
				size: 250,
			},
			{
				header: 'Active',
				accessorKey: 'is_active',
				Cell: ({ cell }) => (
					cell.getValue() ? (
						<Icon className="text-green text-20">check_circle</Icon>
					) : (
						<Icon className="text-red text-20">remove_circle</Icon>
					)
				),
				size: 80,
			},
			{
				header: 'Joining Date',
				accessorKey: 'date_joined',
				Cell: ({ cell }) => (
					<span>{cell.getValue() && format(new Date(cell.getValue()), 'dd-MM-y hh:mm:ss')}</span>
				),
			},
			{
				header: 'Last Login',
				accessorKey: 'last_login',
				sortable: true,
				Cell: ({ cell }) => (
					<span>{cell.getValue() && format(new Date(cell.getValue()), 'dd-MM-y hh:mm:ss')}</span>
				),
			},
		],
		[]
	);

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			className="flex flex-col flex-auto w-full max-h-full"
		>
			<MaterialReactTable
				columns={columns}
				data={data}
				enableFullScreenToggle={false}
				enableColumnResizing
				enableColumnOrdering
				enablePinning
				enableColumnDragging={false}
				enableRowSelection
				enableRowActions
				enableStickyHeader
				muiTableContainerProps={{ sx: { maxHeight: '490px', } }}
				state={{ isLoading: isLoading, showSkeletons: isLoading }}
				displayColumnDefOptions={{
					'mrt-row-actions': {
						header: 'Actions', //change header text
						size: 70, //make actions column wider
					},
				}}
				renderRowActions={({ row, table }) => (
					<Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
						<IconButton
							variant="contained"
							color="secondary"
							component={NavLinkAdapter}
							to={row.original.id + "/edit"}
						>
							<SvgIcon size={20}>heroicons-outline:pencil-alt</SvgIcon>
						</IconButton>
						{/* <IconButton
							variant="contained"
							color="secondary"
							component={NavLinkAdapter}
							to={row.original.id + "/password/change"}
						>
							<SvgIcon size={20}>heroicons-outline:key</SvgIcon>
						</IconButton> */}
					</Box>
				)}
				positionToolbarAlertBanner="bottom" //show selected rows count on bottom toolbar
			/>
		</motion.div>
	);
}

export default UsersList;
