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
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect } from 'react';
import diff from 'object-diff';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateUtilStep,
	addUtilStep,
	closeNewUtilStepDialog,
	closeEditUtilStepDialog,
} from './store/utilStepSlice';

const defaultFormState = {
	name: '',
	entity: '',
	step_asset_type: [],
	short_name: '',
};


function not(a, b) {
	return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
	return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
	return [...a, ...not(b, a)];
}

function UtilStepDialog(props) {
	const dispatch = useDispatch();
	const stepDialog = useSelector(({ utilStepApp }) => utilStepApp.utilSteps.stepDialog);
	const entityTypes = ["Asset", "Shot", "Sequence"]

	const { form, handleChange, setForm, setInForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		if (stepDialog.type === 'edit' && stepDialog.data) {
			setForm({ ...stepDialog.data });
		}

		if (stepDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...stepDialog.data,
			});
		}
	}, [stepDialog.data, stepDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (stepDialog.props.open) {
			initDialog();
		}
	}, [stepDialog.props.open, initDialog]);

	function closeComposeDialog() {
		stepDialog.type === 'edit'
			? dispatch(closeEditUtilStepDialog())
			: dispatch(closeNewUtilStepDialog())
	}

	function canBeSubmitted() {
		return (
			form.name.length > 1
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (stepDialog.type === 'new') {
			dispatch(addUtilStep(form));
		} else {
			const changedValues = diff(stepDialog.data, form)
			changedValues.id = form.id
			dispatch(updateUtilStep(changedValues));
		}
		closeComposeDialog();
	}

	const handleToggleAll = (items) => () => {
		if (numberOfChecked(items) === items.length) {
			setInForm("step_asset_type", not(form.step_asset_type, items));
		} else {
			setInForm("step_asset_type", union(form.step_asset_type, items));
		}
	};

	const numberOfChecked = (items) => intersection(form.step_asset_type, items).length;

	const handleToggle = (value) => () => {
		const currentIndex = form.step_asset_type.indexOf(value);
		const newChecked = [...form.step_asset_type];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setInForm("step_asset_type", newChecked);
	};

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...stepDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{stepDialog.type === 'new' ? 'New UtilStep' : 'Edit UtilStep'}
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
							<Autocomplete
								className="mb-24"
								value={form?.entity}
								onChange={(event, newValue) => {
									setInForm("entity", newValue)
								}}
								disableClearable
								id="entityType"
								options={entityTypes}
								renderInput={(params) => <TextField {...params} label="Entity" required variant="outlined" />}
								required
								fullWidth
							/>
						</div>
						<div className="flex">
							<TextField
								className="mb-24"
								label="Short Name"
								id="short_name"
								name="short_name"
								value={form.short_name}
								onChange={handleChange}
								variant="outlined"
								fullWidth
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
						{stepDialog.type === 'new' ? 'Add' : 'Save'}
					</Button>

					<IconButton
						onClick={closeComposeDialog}
					>
						<Icon>close</Icon>
					</IconButton>
				</DialogActions>
			</form>
		</Dialog >
	);
}

export default UtilStepDialog;
