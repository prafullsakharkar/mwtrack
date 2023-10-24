import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAssignTasks } from './store/taskSlice';
import { getEpisodes } from 'src/app/entities/episodes/store/episodeSlice';
import { getSequences } from 'src/app/entities/sequences/store/sequenceSlice';
import { getShots } from 'src/app/entities/shots/store/shotSlice';
import { getAsset } from 'src/app/entities/assets/store/assetSlice';
import { getUtilSteps } from 'src/app/utilities/util-steps/store/utilStepSlice';

function AssignTaskSidebar(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const episodeIds = props.episodeIds;
	const sequenceIds = props.sequenceIds;
	const shotIds = props.shotIds;
	const utilSteps = props.utilSteps;
	const assetIds = props.assetIds;
	const project = routeParams.uid.split(':')[0]

	const [episode, setEpisode] = useState(null)
	const [sequence, setSequence] = useState(null)
	const [entity, setEntity] = useState([])
	const [entities, setEntities] = useState([])
	const [step, setStep] = useState(null)

	const entityTypes = ["Asset", "Shot", "Sequence"]
	const [entityType, setEntityType] = useState(null)

	const [assetType, setAssetType] = useState(null)
	const assetTypes = ["Set", "Prop", "Character", "Vehicle", "Fx"]

	function resetFormData() {
		setEpisode(null)
		setSequence(null)
		setAssetType(null)
	}

	useEffect(() => {
		entityType === 'Asset' && assetIds && setEntities(assetIds)
		entityType === 'Shot' && shotIds && setEntities(shotIds)
		entityType === 'Sequence' && shotIds && setEntities(sequenceIds)

		if (['Sequence', 'Shot'].includes(entityType)) {
			const projectParams = {
				uid: project,
				entity: 'project'
			}
			project && dispatch(getEpisodes(projectParams));
		}
	}, [shotIds, assetIds, sequenceIds, entityType])

	useEffect(() => {
		{/* Get Util Steps from entity Type like 'Asset' or 'shot' */ }
		setStep(null)
		setEntity([])
		const params = {
			entity: entityType
		}
		entityType && dispatch(getUtilSteps(params));
	}, [entityType])

	useEffect(() => {
		setEntity([])
		if (assetType) {
			const params = {
				asset_type: assetType,
				uid: project,
				entity: "project"
			}
			dispatch(getAsset(params));
		}
	}, [assetType]);

	useEffect(() => {
		setEntity([])
		setSequence(null)
		const seqRouteParams = {
			uid: episode,
			entity: 'episode'
		}
		episode && dispatch(getSequences(seqRouteParams));
	}, [episode]);

	useEffect(() => {
		setEntity([])
		const shotRouteParams = {
			uid: sequence,
			entity: 'sequence'
		}
		sequence && dispatch(getShots(shotRouteParams));
	}, [sequence]);

	useEffect(() => {
		let stepIds = [];
		if (step && entity.length > 0) {
			stepIds = entity.map(item => [item, step.name].join(':'))
			console.log(step, entity)
		}
		step && entity.length > 0 && dispatch(getAssignTasks(stepIds.length > 0 ? stepIds : undefined));
	}, [step, entity]);


	return (
		<div className="p-0 lg:ltr:pr-4 lg:rtl:pl-4">

			<div className="p-4">
				<Paper className="rounded-0 shadow-none lg:rounded-8 lg:shadow">
					<div className="p-8 flex justify-center">
						<Typography color="secondary" variant='h6' >Task Assignment</Typography>
					</div>

					<Divider />

					<List>
						{/* entityTypes = ["Asset", "Shot", "Sequence"] */}
						<div className="p-8 flex flex-col justify-center">
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
						{entityType && entityType === 'Asset' && (
							<>
								{/* assetTypes = ["Set", "Prop", "Character", "Vehicle", "Fx"] */}
								<div className="p-8 flex flex-col justify-center">
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
							</>
						)}
						{entityType && ['Sequence', 'Shot'].includes(entityType) && (
							<>
								<div className="p-8 flex flex-col justify-center">
									<Autocomplete
										value={episode}
										onChange={(event, newValue) => {
											setEpisode(newValue)
										}}
										disableClearable
										getOptionLabel={option => option.split(':').slice(1).join('_')}
										id="episode"
										options={episodeIds}
										renderInput={(params) => <TextField {...params} label="Episode" required variant="outlined" />}
									/>
								</div>
							</>
						)}
						{entityType && entityType === 'Shot' && (
							<>
								<div className="p-8 flex flex-col justify-center">
									<Autocomplete
										value={sequence}
										onChange={(event, newValue) => {
											setSequence(newValue)
										}}
										disableClearable
										getOptionLabel={option => option.split(':').slice(-1).join('_')}
										id="sequence"
										options={sequenceIds}
										renderInput={(params) => <TextField {...params} label="Sequence" required variant="outlined" />}
									/>
								</div>
							</>
						)}
						<div className="p-8 flex flex-col justify-center">
							<Autocomplete
								multiple
								limitTags={1}
								value={entity}
								onChange={(event, newValue) => {
									setEntity(newValue)
								}}
								// disableClearable
								disableCloseOnSelect
								// isOptionEqualToValue={(option, value) => option === value}
								// renderOption={(option, { selected }) => (
								// 	<li>
								// 		<Checkbox
								// 			icon={icon}
								// 			checkedIcon={checkedIcon}
								// 			style={{ marginRight: 4 }}
								// 			checked={selected}
								// 		/>
								// 		{option.split(':').slice(-1).join('_')}
								// 	</li>
								// )}
								getOptionLabel={option => option.split(':').slice(-1).join('_')}
								id={entityType}
								options={entities}
								renderInput={(params) => <TextField {...params} label={entityType} required variant="outlined" />}
							/>

						</div>
						<div className="p-8 flex flex-col justify-center">
							<Autocomplete
								value={step}
								onChange={(event, newValue) => {
									setStep(newValue)
								}}
								disableClearable
								getOptionLabel={option => option.name}
								id="step"
								options={Object.values(utilSteps)}
								renderInput={(params) => <TextField {...params} label="Step" required variant="outlined" />}
							/>
						</div>
					</List>
				</Paper>
			</div>
		</div>
	);
}

export default AssignTaskSidebar;
