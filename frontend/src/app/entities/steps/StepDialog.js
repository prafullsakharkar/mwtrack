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
import _ from '@/lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
	removeSteps,
	updateStep,
	addSteps,
	closeNewStepDialog,
	closeEditStepDialog,
	closeCsvCreateDialog,
	closeCsvUpdateDialog,
	closeMultipleStepDialog,
	updateMultipleSteps,
} from './store/stepSlice';

import { getAssets } from 'src/app/entities/assets/store/assetSlice';
import { getEpisodes } from 'src/app/entities/episodes/store/episodeSlice';
import { getSequences } from 'src/app/entities/sequences/store/sequenceSlice';
import { getShots } from 'src/app/entities/shots/store/shotSlice';
import { getUtilSteps } from 'src/app/utilities/util-steps/store/utilStepSlice';

// import AtomUploadXls from '@/components/core/xls_table/AtomUploadXls';
import SampleCreateCsv from './sample/sample_create_step.csv';
import SampleUpdateCsv from './sample/sample_update_step.csv';

const defaultFormState = {
	status: null,
};

function StepDialog(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const stepDialog = props.stepDialog;
	const statuses = props.statuses;

	const episodeIds = props.episodeIds;
	const sequenceIds = props.sequenceIds;
	const shotIds = props.shotIds;
	const stepIds = props.stepIds;
	const assetIds = props.assetIds;
	const utilSteps = props.utilSteps;

	const [parent, setParent] = useState(null)
	const [entities, setEntities] = useState([])

	const [entityType, setEntityType] = useState(null)
	const entityTypes = ["Asset", "Shot", "Sequence"]

	const [assetType, setAssetType] = useState(null)
	const assetTypes = ["Set", "Prop", "Character", "Vehicle", "Fx"]
	const projects = useSelector(({ core }) => core.projects.entities)
	const project = routeParams?.uid?.split(':')[0].toLowerCase()
	const is_episodic = projects && projects[project]?.is_episodic

	const { form, handleChange, setForm, setInForm, resetForm } = useForm(defaultFormState);

	const steps = utilSteps && Object.values(utilSteps).map(item => item.name) || []
	const [csvData, setCsvData] = useState([])

	function validateCsvCreate(csvData) {

		const validList = []
		const valiData = csvData.map(item => {
			const requestData = { ...item }
			item.reason = "Valid"
			item.valid = true
			requestData.project = project
			if (!item.shot && !item.asset) {
				item.reason = "Invalid Parent (Shot/Asset)"
				item.valid = false
			}
			if (!item.name || steps && !steps.includes(item.name)) {
				item.reason = "Invalid Step (" + item.name + ")"
				item.valid = false
			}
			const status = statuses ? _.find(statuses, { name: "Ready To Start" }) : null
			if (status) {
				requestData.status = status.id
			}

			const step = item.shot ? item.shot + ':' + item.name : item.asset + ':' + item.name
			if (stepIds && stepIds.includes(step)) {
				item.reason = "Already Exists"
				item.valid = false
			}

			if (item.shot) {
				item.asset = null
				const shotList = item.shot.split(":")
				requestData.episode = (shotList.length == 4) ? [project, shotList[1]].join(":") : null
				requestData.sequence = requestData.episode ? [requestData.episode, shotList[2]].join(":") : [project, shotList[1]].join(":")
			}
			if (item.valid) {
				validList.push(requestData)
			}
			return item
		})

		const data = validList.map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setCsvData(data)
		return valiData

	}

	function validateCsvUpdate(csvData) {

		const validList = []
		const valiData = csvData.map(item => {
			const requestData = { ...item }
			item.reason = "Valid"
			item.valid = true
			if (stepIds && !stepIds.includes(item.uid)) {
				item.reason = "Step Not Exists"
				item.valid = false
			}
			const status = item.status && statuses ? _.find(statuses, { name: item.status }) : null
			if (status) {
				requestData.status = status.id
			} else if (item.status) {
				item.reason = "Invalid Status"
				item.valid = false
			}
			if (item.valid) {
				validList.push(requestData)
			}
			return item
		})

		const data = validList.map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setCsvData(data)
		return valiData

	}

	const initDialog = useCallback(() => {
		resetForm()
		if (stepDialog.type === 'edit' && stepDialog.data) {
			setForm({ ...stepDialog.data });
		}

		if (stepDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...stepDialog.data,
			});
		}
		setInForm('project', project)
	}, [stepDialog.data, stepDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (stepDialog.props.open) {
			initDialog();
		}
	}, [stepDialog.props.open, initDialog]);

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

	useEffect(() => {
		{/* Get Util Steps from entity Type like 'Asset' or 'shot' */ }
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
				entity: "project"
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


	function resetFormData() {
		setInForm("name", null)
		setAssetType(null)
	}

	function closeComposeDialog() {
		stepDialog.type === 'edit'
			? dispatch(closeEditStepDialog())
			: stepDialog.type === 'new'
				? dispatch(closeNewStepDialog())
				: stepDialog.type === 'multiple'
					? dispatch(closeMultipleStepDialog())
					: stepDialog.type === 'csvCreate'
						? dispatch(closeCsvCreateDialog())
						: dispatch(closeCsvUpdateDialog())

		resetFormData()
		setEntityType(null)
	}

	function canBeSubmitted() {
		return (
			stepDialog.type.startsWith('csv')
				? csvData.length > 0
				: stepDialog.type === 'new'
					? stepIds && parent && form.name && !stepIds.includes(parent + ":" + form.name)
					: (form.status || form.priority)
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (stepDialog.type === 'csvCreate' && csvData.length > 0) {
			dispatch(addSteps(csvData));
		} else if (stepDialog.type === 'csvUpdate' && csvData.length > 0) {
			dispatch(updateMultipleSteps({ multipleStepList: csvData, project }));
		} else if (stepDialog.type === 'multiple' && stepDialog.data && stepDialog.data.length > 0) {
			const formData = stepDialog.data.map(item => {
				const changedValues = diff(defaultFormState, form) // remove blank entries
				changedValues.uid = item
				return changedValues
			})
			dispatch(updateMultipleSteps({ multipleStepList: formData, project }));
		} else if (stepDialog.type === 'new') {
			dispatch(addSteps(form));
		} else {
			const changedValues = diff(stepDialog.data, form)
			changedValues.id = form.uid
			dispatch(updateStep(changedValues));
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...stepDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth={stepDialog.type.startsWith('csv') ? "md" : "xs"}
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full justify-between">
					<Typography variant="subtitle1" color="inherit">
						{
							stepDialog.type === 'new'
								? 'New Step'
								: stepDialog.type === 'edit'
									? 'Edit Step'
									: stepDialog.type === 'multiple'
										? 'Multiple Steps'
										: stepDialog.type === 'csvCreate'
											? 'Create Steps from CSV'
											: 'Update Steps from CSV'
						}
					</Typography>
					<Typography variant="subtitle1" color="inherit" >
						{project && project.toUpperCase()}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					{stepDialog.type === 'csvCreate' && (
						<>
							<a variant="contained" color="secondary" href={SampleCreateCsv} download="SampleCreateStep.csv">
								Download Sample CSV
							</a>
							{/* <AtomUploadXls validate={validateCsvCreate} /> */}
						</>
					)}
					{stepDialog.type === 'csvUpdate' && (
						<>
							<a variant="contained" color="secondary" href={SampleUpdateCsv} download="SampleUpdateStep.csv">
								Download Sample CSV
							</a>
							{/* <AtomUploadXls validate={validateCsvUpdate} /> */}
						</>
					)}
					{stepDialog.type === 'edit' && (
						<div className="flex mb-16 justify-center">
							<Typography variant="subtitle1" color="secondary" >
								{form.uid}
							</Typography>
						</div>
					)}
					{stepDialog.type === 'new' && (
						<>
							<div className="flex flex-row mb-16">
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
								</div>)}
							</div>
							{entityType && entityType === 'Shot' && (
								<>
									<div className="flex flex-1 mb-16">
										{is_episodic && (<div className="flex-1 mr-5">
											<Autocomplete
												value={form.episode}
												onChange={(event, newValue) => {
													setInForm('episode', newValue)
												}}
												disableClearable
												getOptionLabel={option => option.split(':').slice(-1).join()}
												id="episode"
												options={episodeIds}
												renderInput={(params) => <TextField {...params} label="Episode" required variant="outlined" />}
											/>
										</div>)}
										<div className="flex-1">
											<Autocomplete
												value={form.sequence}
												onChange={(event, newValue) => {
													setInForm('sequence', newValue)
												}}
												disableClearable
												getOptionLabel={option => option.split(':').slice(-1).join()}
												id="sequence"
												options={sequenceIds}
												renderInput={(params) => <TextField {...params} label="Sequence" required variant="outlined" />}
											/>
										</div>
									</div>

								</>
							)}
							{['new', 'edit', 'multiple'].includes(stepDialog.type) && (<div className="flex flex-row mb-16">
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
									// disabled={stepDialog.type === 'edit'}
									/>
								</div>
								<div className="flex-1">
									<Autocomplete
										value={form.name}
										onChange={(event, newValue) => {
											setInForm('name', newValue)
										}}
										disableClearable
										// getOptionLabel={option => option.name}
										id="name"
										options={steps}
										renderInput={(params) => <TextField {...params} label="Name" required variant="outlined" />}
									// disabled={stepDialog.type === 'edit'}
									/>
								</div>
							</div>)}

						</>

					)}

					{['new', 'edit', 'multiple'].includes(stepDialog.type) && (<div className="flex mb-16">
						<div className="mr-5 flex-1">
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
					</div>)}

				</DialogContent>

				<DialogActions className="justify-between pl-16">

					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						type="submit"
						disabled={!canBeSubmitted()}
					>
						{['edit', 'multiple', 'csvUpdate'].includes(stepDialog.type) ? 'Update' : 'Create'}
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

export default StepDialog;
