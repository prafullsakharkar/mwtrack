import { useForm } from '@/hooks';
import { HexColorPicker } from "react-colorful";
import Utils from '@/libs/Utils';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import InputColor from 'react-input-color';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect } from 'react';
import diff from 'object-diff';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateStatus,
	addStatus,
	closeNewStatusDialog,
	closeEditStatusDialog,
} from './store/statusSlice';

const defaultFormState = {
	name: '',
	color: '#aabbcc',
	status_type: '',
};

function StatusDialog(props) {
	const dispatch = useDispatch();
	const statusDialog = useSelector(({ statusApp }) => statusApp.statuses.statusDialog);

	const { form, handleChange, setForm, setInForm } = useForm(defaultFormState);
	const [color, setColor] = React.useState(null);

	const initDialog = useCallback(() => {
		if (statusDialog.type === 'edit' && statusDialog.data) {
			setForm({ ...statusDialog.data });
			setColor(statusDialog.data.color)
		}

		if (statusDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...statusDialog.data,
			});
		}
	}, [statusDialog.data, statusDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (statusDialog.props.open) {
			initDialog();
		}
	}, [statusDialog.props.open, initDialog]);

	useEffect(() => {
		color && setInForm('color', color)
	}, [color])

	function closeComposeDialog() {
		statusDialog.type === 'edit'
			? dispatch(closeEditStatusDialog())
			: dispatch(closeNewStatusDialog())
	}

	function canBeSubmitted() {
		return (
			form.name.length > 3
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (statusDialog.type === 'new') {
			dispatch(addStatus(form));
		} else {
			const changedValues = diff(statusDialog.data, form)
			changedValues.id = form.id
			dispatch(updateStatus(changedValues));
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...statusDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{statusDialog.type === 'new' ? 'New Status' : 'Edit Status'}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<>
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

						<div className="flex">
							<TextField
								className="mb-24"
								label="Type"
								id="status_type"
								name="status_type"
								value={form.status_type}
								onChange={handleChange}
								variant="outlined"
								fullWidth
							/>
						</div>

						<div className="flex flex-1">
							<TextField
								className="mb-24"
								label="Color"
								id="color"
								name="color"
								value={form.color}
								onChange={handleChange}
								variant="outlined"
								sx={{ backgroundColor: form.color }}
							/>
						</div>
						<div className="flex flex-1">
							<HexColorPicker
								color={form.color}
								onChange={setColor}
							/>
						</div>
					</>
				</DialogContent>

				<DialogActions className="justify-between pl-16">

					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						type="submit"
						disabled={!canBeSubmitted()}
					>
						{statusDialog.type === 'new' ? 'Add' : 'Save'}
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

export default StatusDialog;
