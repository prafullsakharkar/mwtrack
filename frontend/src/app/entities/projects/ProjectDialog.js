import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Autocomplete from '@mui/material/Autocomplete';
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
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import diff from 'object-diff';
import { useDispatch, useSelector } from 'react-redux';
import {
	removeProject,
	updateProject,
	addProject,
	closeNewProjectDialog,
	closeEditProjectDialog,
} from './store/projectSlice';

const defaultFormState = {
	name: '',
	code: '',
	cg_supervisor: 0,
	duration: 1,
	is_episodic: true,
	resolution: '',
	is_active: true,
	start_frame: 101,
	fps: 24,
	project_path: '',
};

function ProjectDialog(props) {
	const dispatch = useDispatch();
	const projectDialog = props.projectDialog;
	const users = props.users;

	const { form, handleChange, setForm, setInForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		if (projectDialog.type === 'edit' && projectDialog.data) {
			setForm({ ...projectDialog.data });
		}

		if (projectDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...projectDialog.data,
			});
		}
	}, [projectDialog.data, projectDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (projectDialog.props.open) {
			initDialog();
		}
	}, [projectDialog.props.open, initDialog]);

	useEffect(() => {
		setInForm("project_path", "/ASEX/01prj/" + form.code.toUpperCase())
	}, [form.code])

	function closeComposeDialog() {
		projectDialog.type === 'edit'
			? dispatch(closeEditProjectDialog())
			: dispatch(closeNewProjectDialog())
	}

	function canBeSubmitted() {
		return (
			form.code.length > 2 && form.name
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (projectDialog.type === 'new') {
			dispatch(addProject(form));
		} else {
			const changedValues = diff(projectDialog.data, form)
			if (changedValues) {
				changedValues.id = form.uid
				dispatch(updateProject(changedValues));
			}
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(removeProject(form.id));
		closeComposeDialog();
	}

	function handleUploadChange(e) {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('thumbnail', file);
		formData.id = form.uid;
		dispatch(updateProject(formData));

		const reader = new FileReader();

		reader.readAsBinaryString(file);

		reader.onload = () => {
			setInForm('thumbnail', `data:${file.type};base64,${btoa(reader.result)}`)
		};

		reader.onerror = () => {
			console.error('error on load image');
		};

	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...projectDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						{projectDialog.type === 'new' ? 'New Project' : form.code}
					</Typography>
					{projectDialog.type === 'edit' && <div className="flex flex-1 items-center justify-end">
						<FormControlLabel label="Is Active" labelPlacement="start"
							control={<Switch checked={form.is_active} onChange={(event, newValue) => {
								setInForm('is_active', newValue)
							}} name="Active" />}
						/>
					</div>}
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					{projectDialog.type === 'new' && (
						<>

							<div className="flex">
								<TextField
									className="mb-24"
									label="Code"
									id="code"
									name="code"
									value={form.code}
									onChange={handleChange}
									variant="outlined"
									required
									fullWidth
								// disabled
								/>
							</div>
						</>
					)}

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

					<div className="mb-24">

						<Autocomplete
							value={form?.cg_supervisor && users[form.cg_supervisor]}
							onChange={(event, newValue) => {
								setInForm('cg_supervisor', newValue.id)
							}}
							disableClearable
							getOptionLabel={option => option.full_name}
							id="cg_supervisor"
							options={Object.values(users)}
							renderInput={(params) => <TextField {...params} label="CG Supervisor" required variant="outlined" />}
						/>

					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							label="Start Frame"
							id="start_frame"
							name="start_frame"
							value={form.start_frame}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							label="Duration (in days)"
							id="duration"
							name="duration"
							value={form.duration}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							label="FPS"
							id="fps"
							name="fps"
							value={form.fps}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							label="Resolution"
							id="resolution"
							name="resolution"
							value={form.resolution}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div>

					<div className="flex">
						<TextField
							className="mb-24"
							label="Project Path"
							id="project_path"
							name="project_path"
							value={form.project_path}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div>

					<div className="mb-24">
						<FormControlLabel label="Is Episodic" labelPlacement="start"
							control={<Switch checked={form.is_episodic} onChange={(event, newValue) => {
								setInForm('is_episodic', newValue)
							}} name="Is Episodic" />}
						/>
					</div>

					{projectDialog.type === 'edit' && (
						<label>
							<Avatar className="w-96 h-96 cursor-pointer border-3" src={form.thumbnail} />
							<input accept="image/*" className="hidden" type="file" onChange={handleUploadChange} />
						</label>
					)}

				</DialogContent>

				<DialogActions className="justify-between pl-16">

					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						type="submit"
						disabled={!canBeSubmitted()}
					>
						{projectDialog.type === 'new' ? 'Add' : 'Save'}
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

export default ProjectDialog;
