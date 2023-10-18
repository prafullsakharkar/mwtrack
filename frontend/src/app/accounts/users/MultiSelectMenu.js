import Icon from '@mui/material/Icon';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ConfirmationDialog from './ConfirmationDialog';

function UserMultiSelectMenu(props) {
	const dispatch = useDispatch();
	const { selectedUserIds } = props;

	const [anchorEl, setAnchorEl] = useState(null);

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('Deactivate Users');

	const handleClickListItem = (newTitle) => {
		newTitle && setValue(newTitle);
		setOpen(true);
	};

	const handleClose = (newValue) => {
		setOpen(false);

		if (newValue) {
			setValue(newValue);
		}
	};

	function openSelectedUserMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function closeSelectedUserMenu() {
		setAnchorEl(null);
	}

	return (
		<>
			<Button
				color="secondary"
				aria-owns={anchorEl ? 'selectedUserMenu' : null}
				aria-haspopup="true"
				disabled={!selectedUserIds.length}
				onClick={openSelectedUserMenu}
				variant="contained"
			>
				Action Menu
			</Button>
			<Menu
				id="selectedUserMenu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={closeSelectedUserMenu}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							handleClickListItem('Deactivate Users');
							closeSelectedUserMenu();
						}}
					>
						<ListItemIcon className="min-w-40">
							<Icon>delete</Icon>
						</ListItemIcon>
						<ListItemText primary="Deactivate Users" />
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleClickListItem('Add To Projects');
							closeSelectedUserMenu();
						}}
					>
						<ListItemIcon className="min-w-40">
							<Icon>movie</Icon>
						</ListItemIcon>
						<ListItemText primary="Add To Projects" />
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleClickListItem('Remove From Projects');
							closeSelectedUserMenu();
						}}
					>
						<ListItemIcon className="min-w-40">
							<Icon>movie</Icon>
						</ListItemIcon>
						<ListItemText primary="Remove From Projects" />
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleClickListItem('Add To Groups');
							closeSelectedUserMenu();
						}}
					>
						<ListItemIcon className="min-w-40">
							<Icon>group</Icon>
						</ListItemIcon>
						<ListItemText primary="Add To Groups" />
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleClickListItem('Remove From Groups');
							closeSelectedUserMenu();
						}}
					>
						<ListItemIcon className="min-w-40">
							<Icon>group</Icon>
						</ListItemIcon>
						<ListItemText primary="Remove From Groups" />
					</MenuItem>
				</MenuList>
			</Menu>
			<ConfirmationDialog
				id="action-menu"
				keepMounted
				open={open}
				onClose={handleClose}
				value={value}
				selectedUserIds={selectedUserIds}
			/>

		</>
	);
}

export default UserMultiSelectMenu;
