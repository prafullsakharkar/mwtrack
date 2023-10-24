import { useForm } from '@/hooks';
import AppBar from '@mui/material/AppBar';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import diff from 'object-diff';
import axios from 'axios';
import _ from '@/lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateVersion,
	addVersion,
	updateMultipleVersions,
	closeNewVersionDialog,
	closeEditVersionDialog,
	closeMultipleVersionDialog,
} from './store/versionSlice';

import { getAssets } from 'src/app/entities/assets/store/assetSlice';
import { getEpisodes } from 'src/app/entities/episodes/store/episodeSlice';
import { getSequences } from 'src/app/entities/sequences/store/sequenceSlice';
import { getShots } from 'src/app/entities/shots/store/shotSlice';
import { getUtilSteps } from 'src/app/utilities/util-steps/store/utilStepSlice';

import ImageUpload from '@/components/core/Upload/ImageUpload';

const defaultFormState = {
	status: null,
	description: '',
};

function VersionDialog(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const versionDialog = props.versionDialog;
	const versionEntities = props.versionEntities;

	const statuses = props.statuses;

	const episodeIds = props.episodeIds;
	const sequenceIds = props.sequenceIds;
	const shotIds = props.shotIds;
	const assetIds = props.assetIds;
	const versionIds = props.versionIds
	const steps = props.utilSteps && Object.values(props.utilSteps).map(item => item.name) || []

	const [files, setFiles] = useState([])
	const [parent, setParent] = useState(null)
	const [entities, setEntities] = useState([])
	const [entityType, setEntityType] = useState(null)
	const entityTypes = ["Asset", "Shot", "Sequence"]
	const projects = useSelector(({ core }) => core.projects.entities)
	const user = useSelector(({ user }) => user.id)
	const project = routeParams?.uid?.split(':')[0].toLowerCase()
	const is_episodic = projects && projects[project]?.is_episodic

	const [assetType, setAssetType] = useState(null)
	const assetTypes = ["Set", "Prop", "Character", "Vehicle", "Fx"]

	const { form, handleChange, setForm, setInForm, resetForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		resetForm()
		setFiles([])
		if (versionDialog.type === 'edit' && versionDialog.data) {
			setForm({ ...versionDialog.data });
			setInForm('updated_by', user)
		}

		if (versionDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...versionDialog.data,
			});
			setInForm('project', project)
			setInForm('created_by', user)
			setInForm('updated_by', user)
		}
	}, [versionDialog.data, versionDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (versionDialog.props.open) {
			initDialog();
		}
	}, [versionDialog.props.open, initDialog]);

	useEffect(() => {
		const getMediaFiles = async () => {

			if (versionDialog.data && versionDialog.data.media_files && versionDialog.data.media_files.length > 0) {

				const response = await axios.get('/api/v1/utility/uploadfiles/', {
					params: { id__in: versionDialog.data.media_files.join(',') }
				});
				const data = await response.data;

				setFiles(data);
			}
		};

	}, [versionDialog.data])

	useEffect(() => {
		entityType === 'Asset' && assetIds && setEntities(assetIds)
		entityType === 'Shot' && shotIds && setEntities(shotIds)
		entityType === 'Sequence' && shotIds && setEntities(sequenceIds)
	}, [shotIds, assetIds, sequenceIds, entityType])

	useEffect(() => {
		if (['Sequence', 'Shot'].includes(entityType)) {
			const project = routeParams?.uid?.split(':')[0].toLowerCase()
			const projectParams = {
				uid: project,
				entity: 'project'
			}
			is_episodic ? dispatch(getEpisodes(projectParams)) : dispatch(getSequences(projectParams))
		}
	}, [entityType, is_episodic])

	{/* Get Util Steps from entity Type like 'Asset' or 'shot' */ }
	useEffect(() => {
		const params = {
			entity: entityType
		}
		entityType && dispatch(getUtilSteps(params));
	}, [entityType])

	useEffect(() => {
		if (assetType) {
			const params = {
				asset_type: assetType,
				uid: project,
				entity: 'project'
			}
			dispatch(getAssets(params));
		}
	}, [assetType]);

	useEffect(() => {
		const seqRouteParams = {
			uid: form.episode,
			entity: 'episode'
		}
		form.episode && dispatch(getSequences(seqRouteParams));
	}, [form.episode]);

	useEffect(() => {
		const shotRouteParams = {
			uid: form.sequence,
			entity: 'sequence'
		}
		form.sequence && dispatch(getShots(shotRouteParams));
	}, [form.sequence]);

	async function setFormName(step) {
		const stepId = parent + ':' + step
		setInForm('step', stepId)

		try {
			const response = await axios.get('/api/v1/entity/steps/' + stepId + '/versions/');
			const data = await response.data;

			const sorted = data.sort((a, b) => (b.version_number - a.version_number))
			let latestTask = 'Review_v1'
			if (sorted.length > 0) {
				const version = sorted[0].version_number
				const versionNumber = (parseInt(version) + 1)
				latestTask = 'Review_v' + versionNumber
				setInForm('version_number', versionNumber)
			}
			setInForm('name', latestTask)
		} catch {
			setInForm('name', '')
			console.log("Step Not found ...")
		}

	}

	function resetFormData() {
		setInForm("name", null)
		setAssetType(null)
		setParent(null)
	}
	function closeComposeDialog() {
		versionDialog.type === 'edit'
			? dispatch(closeEditVersionDialog())
			: versionDialog.type === 'multiple'
				? dispatch(closeMultipleVersionDialog())
				: dispatch(closeNewVersionDialog())

		resetFormData()
		setEntityType(null)
	}

	function canBeSubmitted() {
		return (
			versionDialog.type === 'new'
				? versionIds && form.step && form.name && !versionIds.includes(form.step + ":" + form.name) && files.length > 0
				: form.status || form.description
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (versionDialog.type === 'multiple' && versionDialog.data && versionDialog.data.length > 0) {
			const formData = versionDialog.data.map(item => {
				const changedValues = diff(defaultFormState, form) // remove blank entries
				changedValues.uid = item
				return changedValues
			})
			dispatch(updateMultipleVersions({ multipleVersionList: formData, project }));
		} else if (versionDialog.type === 'new') {
			if (files.length > 0) {
				form.files = files
			}
			dispatch(addVersion(form));
		} else {
			const changedValues = diff(versionDialog.data, form)
			changedValues.id = form.uid
			if (files.length > 0) {
				changedValues.files = files
			}
			dispatch(updateVersion(changedValues));
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...versionDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="xs"
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full justify-between">
					<Typography variant="subtitle1" color="inherit">
						{versionDialog.type === 'new' ? 'New Version' : versionDialog.type === 'multiple' ? 'Multiple Versions' : 'Edit Version'}
					</Typography>
					<Typography variant="subtitle1" color="inherit" >
						{form.project && form.project.toUpperCase()}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<>
						{versionDialog.type !== 'multiple' && (<ImageUpload setFiles={setFiles} files={files} multiple={true} />)}

						{versionDialog.type === 'new' && (
							<>
								<div className="flex flex-row mb-12">
									<div className="flex-1 mr-5">
										<Autocomplete
											value={entityType}
											onChange={(event, newValue) => {
												setEntityType(newValue)
												resetFormData()
											}}
											disableClearable
											id="entityType"
											options={entityTypes}
											renderInput={(params) => <TextField {...params} label="Entity" required variant="outlined" />}
										/>
									</div>
									{entityType && entityType === 'Asset' && (<div className="flex-1">
										<Autocomplete
											value={assetType}
											onChange={(event, newValue) => {
												setAssetType(newValue)
											}}
											disableClearable
											id="assetType"
											options={assetTypes}
											renderInput={(params) => <TextField {...params} label="Asset Type" required variant="outlined" />}
										/>
									</div>
									)}
									{entityType && entityType === 'Shot' && is_episodic && (<div className="flex-1">
										<Autocomplete
											value={form.episode}
											onChange={(event, newValue) => {
												setInForm('episode', newValue)
											}}
											disableClearable
											getOptionLabel={option => option.split(':').slice(-1).join('_')}
											id="episode"
											options={episodeIds}
											renderInput={(params) => <TextField {...params} label="Episode" required variant="outlined" />}
										/>
									</div>
									)}
								</div>
								{entityType && entityType === 'Shot' && (
									<div className="mb-12">
										<Autocomplete
											value={form.sequence}
											onChange={(event, newValue) => {
												setInForm('sequence', newValue)
											}}
											disableClearable
											getOptionLabel={option => option.split(':').slice(-1).join('_')}
											id="sequence"
											options={sequenceIds}
											renderInput={(params) => <TextField {...params} label="Sequence" required variant="outlined" />}
										/>
									</div>

								)}
								<div className="flex flex-row mb-12">
									<div className="mr-5 flex-1">
										<Autocomplete
											value={parent}
											onChange={(event, newValue) => {
												(entityType === 'Asset')
													? setInForm('asset', newValue) : (entityType === 'Sequence')
														? setInForm('sequence', newValue) : setInForm('shot', newValue)

												setParent(newValue)
											}}
											disableClearable
											getOptionLabel={option => option.split(':').slice(-1).join()}
											id={entityType}
											options={entities}
											renderInput={(params) => <TextField {...params} label={entityType} required variant="outlined" />}
										// disabled={versionDialog.type === 'edit'}
										/>
									</div>
									<div className="flex-1">
										<Autocomplete
											value={form.step}
											onChange={(event, newValue) => {
												setFormName(newValue)
											}}
											disableClearable
											// getOptionLabel={option => option.split(':').slice(-1).join()}
											id="step"
											options={steps}
											renderInput={(params) => <TextField {...params} label="Step" required variant="outlined" />}
										// disabled={versionDialog.type === 'edit'}

										/>
									</div>
								</div>

							</>

						)}

						{versionDialog.type === 'edit' && (
							<div className="flex mb-16 justify-center">
								<Typography variant="subtitle1" color="secondary" >
									{form.uid}
								</Typography>
							</div>
						)}

						<div className="flex flex-row mb-12">
							{versionDialog.type !== 'multiple' && (<div className="mr-5 flex-1">
								<TextField
									className="mb-12"
									// label="Name"
									autoFocus
									id="name"
									name="name"
									value={form.name}
									onChange={handleChange}
									variant="outlined"
									fullWidth
									disabled
								/>
							</div>)}
							<div className="flex-1">

								<Autocomplete
									value={form.status && statuses[form.status?.id || form.status]}
									onChange={(event, newValue) => {
										setInForm('status', newValue.id)
									}}
									disableClearable
									getOptionLabel={option => option.name}
									id="status"
									options={Object.values(statuses)}
									renderInput={(params) => <TextField {...params} label="Status" required variant="outlined" />}

								/>

							</div>
						</div>
						<div className="flex">
							<TextField
								className="mb-12"
								label="Description"
								autoFocus
								id="description"
								name="description"
								value={form.description}
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
						{['edit', 'multiple'].includes(versionDialog.type) ? 'Update' : 'Create'}
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

export default VersionDialog;
