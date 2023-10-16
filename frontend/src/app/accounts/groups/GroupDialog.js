import { useForm } from '@/hooks';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect } from 'react';
import diff from 'object-diff';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateGroup,
	addGroup,
	closeNewGroupDialog,
	closeEditGroupDialog,
} from './store/groupSlice';

const defaultFormState = {
	name: '',
	description: '',
};

function GroupDialog(props) {
	const dispatch = useDispatch();
	const groupDialog = useSelector(({ groupApp }) => groupApp.groups.groupDialog);

	const { form, handleChange, setForm, setInForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		if (groupDialog.type === 'edit' && groupDialog.data) {
			setForm({ ...groupDialog.data });
		}

		if (groupDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...groupDialog.data,
			});
		}
	}, [groupDialog.data, groupDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (groupDialog.props.open) {
			initDialog();
		}
	}, [groupDialog.props.open, initDialog]);

	function closeComposeDialog() {
		groupDialog.type === 'edit'
			? dispatch(closeEditGroupDialog())
			: dispatch(closeNewGroupDialog())
	}

	function canBeSubmitted() {
		return (
			form.name.length > 4
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (groupDialog.type === 'new') {
			dispatch(addGroup(form));
		} else {
			const changedValues = diff(groupDialog.data, form)
			changedValues.id = form.id
			dispatch(updateGroup(changedValues));
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...groupDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{groupDialog.type === 'new' ? 'New Group' : 'Edit Group'}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<TextField
							className="mb-24"
							label="Name"
							autoFocus
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							variant="outlined"
							required
							fullWidth
						/>
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
						{groupDialog.type === 'new' ? 'Add' : 'Save'}
					</Button>
					<IconButton
						onClick={closeComposeDialog}
					>
						<Icon>close</Icon>
					</IconButton>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default GroupDialog;
