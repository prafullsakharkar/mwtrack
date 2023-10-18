import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes, { object } from 'prop-types';

import { addUserToProjects, addUserToGroups, removeUsers, removeUserFromGroups, removeUserFromProjects } from './store/userSlice';
import authRoles from '@/auth/authRoles';

function not(a, b) {
	return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
	return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
	return [...a, ...not(b, a)];
}

function ConfirmationDialog(props) {
	const dispatch = useDispatch();
	const { onClose, value: valueProp, open, selectedUserIds, ...other } = props;
	// const projects = [];
	const projects = useSelector(({ core }) => core?.projects?.ids) || [];
	const user = useSelector(({ userApp }) => userApp.users.entities);
	const groups = useSelector(({ userApp }) => userApp.groups.entities);
	const roles = authRoles && Object.keys(authRoles) || []
	const [items, setItems] = useState([]);
	const [checked, setChecked] = useState([]);
	const [action, setAction] = useState(null)
	const [entity, setEntity] = useState(null)

	useEffect(() => {
		if (open && selectedUserIds) {
			if (valueProp == 'Deactivate Users') {
				const users = selectedUserIds.map(item => user[item].username)
				setItems(users)
				setChecked(users);
				setEntity('Users')
			} else if (['Add To Projects', 'Remove From Projects'].includes(valueProp)) {
				// const project_ids = projects.map(item => item.code)
				setItems(projects)
				setEntity('Projects')
			} else if (['Add To Groups', 'Remove From Groups'].includes(valueProp)) {
				const group_ids = Object.values(groups).filter(item => !roles.includes(item.name)).map(item => item.name)
				setItems(group_ids)
				setEntity('Groups')
			}
			setAction(valueProp.startsWith("Deactivate") ? 'Deactivate' : valueProp.startsWith("Add") ? 'Add' : 'Remove')
		}
	}, [valueProp, open, selectedUserIds]);

	const handleCancel = () => {
		onClose();
		setChecked([]);
	};

	function canBeSubmitted() {
		return (
			checked.length > 0
		);
	}

	const handleToggleAll = (items) => () => {
		if (numberOfChecked(items) === items.length) {
			setChecked(not(checked, items));
		} else {
			setChecked(union(checked, items));
		}
	};

	const numberOfChecked = (items) => intersection(checked, items).length;

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	function handleSubmit(event) {
		event.preventDefault();

		if (valueProp === 'Deactivate Users') {
			const changeValues = Object.values(user).filter(item => checked.includes(item.username)).map(item => item.id)
			dispatch(removeUsers(changeValues))
		} else if (valueProp === 'Add To Projects') {
			const changeValues = projects.filter(item => checked.includes(item))
			const data = {
				projects: changeValues,
				users: selectedUserIds
			}
			dispatch(addUserToProjects(data))
		} else if (valueProp === 'Remove From Projects') {
			const changeValues = projects.filter(item => checked.includes(item))
			const data = {
				projects: changeValues,
				users: selectedUserIds
			}
			dispatch(removeUserFromProjects(data))
		} else if (valueProp === 'Add To Groups') {
			const changeValues = Object.values(groups).filter(item => checked.includes(item.name)).map(item => item.id)
			const data = {
				groups: changeValues,
				users: selectedUserIds
			}
			dispatch(addUserToGroups(data))
		} else if (valueProp === 'Remove From Groups') {
			const changeValues = Object.values(groups).filter(item => checked.includes(item.name)).map(item => item.id)
			const data = {
				groups: changeValues,
				users: selectedUserIds
			}
			dispatch(removeUserFromGroups(data))
		}
		handleCancel();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-16'
			}}
			open={open}
			{...other}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{valueProp}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent className='p-24'>
					<div className="flex flex-1 justify-between">
						<Card className='w-full'>
							<CardHeader
								avatar={
									<Checkbox
										onClick={handleToggleAll(items)}
										checked={numberOfChecked(items) === items.length && items.length !== 0}
										indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
										disabled={items.length === 0}
										inputProps={{ 'aria-label': 'all items selected' }}
									/>
								}
								title={`${entity} (${numberOfChecked(items)}/${items.length} selected)`}
								subheader={
									<p>{checked.join(', ')}</p>
								}
							/>
							<Divider />
							<List dense component="div" role="list">
								{items.map((value) => {
									const labelId = `transfer-list-all-item-${value}-label`;

									return (
										<ListItem key={value} role="listitem" onClick={handleToggle(value)}>
											<ListItemIcon>
												<Checkbox
													checked={checked.indexOf(value) !== -1}
													tabIndex={-1}
													disableRipple
													inputProps={{ 'aria-labelledby': labelId }}
												/>
											</ListItemIcon>
											<ListItemText id={labelId} primary={value} />
										</ListItem>
									);
								})}
								<ListItem />
							</List>
						</Card>
					</div>
				</DialogContent>

				<DialogActions className="justify-between pl-16">

					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						type="submit"
						disabled={!canBeSubmitted()}
					>
						{action}
					</Button>

					<IconButton
						onClick={handleCancel}
					>
						<Icon>close</Icon>
					</IconButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}
ConfirmationDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	value: PropTypes.string.isRequired,
};
export default ConfirmationDialog;
