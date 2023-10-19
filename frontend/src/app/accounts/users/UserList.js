import React from 'react';
import Avatar from '@mui/material/Avatar';
import Icon from '@mui/material/Icon';
import format from 'date-fns/format';
import { useSelector } from 'react-redux';
import { selectUsers } from './store/userSlice';
import MuiTable from '@/components/core/Table/MuiTable';
import { Typography } from '@mui/material';
import UserMultiSelectMenu from './MultiSelectMenu';

function UserList(props) {
	const data = useSelector(selectUsers) || [];
	const isLoading = useSelector(({ userApp }) => userApp.users.isLoading);

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

	if (data.length == 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="text.secondary" variant="h5">
					There are no users!
				</Typography>
			</div>
		)
	}

	return (
		<MuiTable
			isLoading={isLoading}
			data={data}
			columns={columns}
			renderTopToolbarCustomActions={({ table }) => (
				<UserMultiSelectMenu selectedUserIds={table.getSelectedRowModel().rows.map(row => row.original.id)} />
			)}
		/>
	);
}

export default UserList;
