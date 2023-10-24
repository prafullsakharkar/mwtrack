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
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { useParams } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import diff from 'object-diff';
import _ from '@/lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateShot,
	addShots,
	closeNewShotDialog,
	closeEditShotDialog,
	closeCsvCreateDialog,
	closeCsvUpdateDialog,
	closeMultipleShotDialog,
	updateMultipleShots,
} from './store/shotSlice';

import { getEpisodes } from 'src/app/entities/episodes/store/episodeSlice';
import { getSequences } from 'src/app/entities/sequences/store/sequenceSlice';
// import AtomUploadXls from '@/components/core/xls_table/AtomUploadXls';
import SampleCreateCsv from './sample/sample_create_shot.csv';
import SampleUpdateCsv from './sample/sample_update_shot.csv';

const defaultFormState = {
	name: '',
	end_frame: 102,
	total_frames: 1,
	description: '',
	assets: '',
};

function ShotDialog(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const shotDialog = props.shotDialog;
	const episodeIds = props.episodeIds;
	const sequenceIds = props.sequenceIds;
	const shotIds = props.shotIds;

	const { form, handleChange, setForm, setInForm, resetForm } = useForm(defaultFormState);

	const frames = _.range(101, 3000, 1).map(item => item.toString())
	const projects = useSelector(({ core }) => core.projects.entities)
	const project = routeParams?.uid?.split(':')[0].toLowerCase()
	const is_episodic = projects && projects[project]?.is_episodic
	const start_frame = projects && projects[project]?.start_frame
	const rangeList = ["1x", "5x", "10x", "100x"]

	const [step, setStep] = useState(10);
	const [range, setRange] = useState([10, 100]);
	const [rangeX, setRangeX] = useState(rangeList[2]);
	const [maxValue, setMaxValue] = useState(step * 90);
	const [decimal, setDecimal] = useState("4");
	const [prefix, setPrefix] = useState('');
	const [ext, setExt] = useState('');
	const [shots, setShots] = useState([]);
	const [csvData, setCsvData] = useState([])

	function validateCsvCreate(csvData) {

		const valiData = csvData.map(item => {
			item.reason = "Valid"
			item.valid = true
			item.project = project
			if (!item.description) {
				item.reason = "Invalid Description"
				item.valid = false
			}

			if (!item.sequence) {
				item.reason = "Invalid Sequence"
				item.valid = false
			} else {
				if (item.sequence.split(':').length == 3) {
					item.episode = item.sequence.split(':')[0] + ':' + item.sequence.split(':')[1]
				}
			}
			if (item.episode && episodeIds && !episodeIds.includes(item.episode)) {
				item.reason = "Invalid Episode"
				item.valid = false
			}
			if (shotIds && shotIds.includes(item.sequence + ':' + item.name)) {
				item.reason = "Already Exists"
				item.valid = false
			}
			if (item.assets) {
				const assets = item.assets.split(",")
				item.assets = assets.map(row =>
					!row.startsWith(project + ":")
						? project + ':' + row
						: row
				)
			}
			return item
		})

		const data = valiData.filter(item => item.valid).map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setCsvData(data)
		return valiData

	}

	function validateCsvUpdate(csvData) {

		const valiData = csvData.map(item => {
			item.reason = "Valid"
			item.valid = true
			if (shotIds && !shotIds.includes(item.uid)) {
				item.reason = "Shot Not Exists"
				item.valid = false
			}
			if (item.assets) {
				const assets = item.assets.split(",")
				item.assets = assets.map(row =>
					!row.startsWith(project + ":")
						? project + ':' + row
						: row
				)
			}
			return item
		})

		const data = valiData.filter(item => item.valid).map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setCsvData(data)
		return valiData

	}

	const handleRangeXChange = (event, newValue) => {
		setRangeX(newValue);
		const newRangeX = parseInt(newValue.replace('x', ''))
		setRange([newRangeX, newRangeX * 10])
		setStep(newRangeX)
		setMaxValue(newRangeX * 90)
	};

	useEffect(() => {

		const shs = {}
		_.range(range[0], range[1], step).map(sh => {
			const shot = prefix + (("0".repeat(parseInt(decimal)) + sh).slice(-parseInt(decimal))) + ext
			shs[shot] = (form.sequence && shotIds && shotIds.includes(form.sequence + ':' + shot)) ? false : true
		})
		form.sequence && setShots(shs)


	}, [range, step, decimal, prefix, ext, form.sequence])


	const initDialog = useCallback(() => {
		resetForm()
		if (shotDialog.type === 'edit' && shotDialog.data) {
			setForm({ ...shotDialog.data });
		}

		if (shotDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...shotDialog.data,
			});
			setInForm('project', project)

		}
	}, [shotDialog.data, shotDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (shotDialog.props.open) {
			initDialog();
		}
	}, [shotDialog.props.open, initDialog]);

	useEffect(() => {
		routeParams && is_episodic && dispatch(getEpisodes(routeParams));
	}, [routeParams, is_episodic]);

	useEffect(() => {
		const seqRouteParams = {
			uid: form.episode,
			entity: 'episode'
		}
		form.episode && dispatch(getSequences(seqRouteParams));
	}, [form.episode]);

	const toggleInSelected = (event) => {
		const checked = (form.sequence && shotIds && shotIds.includes(form.sequence + ':' + event.target.name)) ? false : event.target.checked
		setShots({
			...shots,
			[event.target.name]: checked,
		});
	}

	function closeComposeDialog() {
		shotDialog.type === 'edit'
			? dispatch(closeEditShotDialog())
			: shotDialog.type === 'new'
				? dispatch(closeNewShotDialog())
				: shotDialog.type === 'multiple'
					? dispatch(closeMultipleShotDialog())
					: shotDialog.type === 'csvCreate'
						? dispatch(closeCsvCreateDialog())
						: dispatch(closeCsvUpdateDialog())

		handleRangeXChange('', '10x')
		setDecimal('4')
		setPrefix('')
		setExt('')
		setShots({})
	}

	function canBeSubmitted() {
		return (
			shotDialog.type.startsWith('csv')
				? csvData.length > 0
				: shotDialog.type === 'new'
					? Object.values(shots).filter((sh) => sh === true).length > 0
					: (form.description || form.end_frame)
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (shotDialog.type === 'csvCreate' && csvData.length > 0) {
			dispatch(addShots(csvData));
		} else if (shotDialog.type === 'csvUpdate' && csvData.length > 0) {
			dispatch(updateMultipleShots({ multipleShotList: csvData, project }));
		} else if (shotDialog.type === 'multiple' && shotDialog.data && shotDialog.data.length > 0) {
			const formData = shotDialog.data.map(item => {
				const changedValues = diff(defaultFormState, form) // remove blank entries
				changedValues.uid = item
				return changedValues
			})
			dispatch(updateMultipleShots({ multipleShotList: formData, project }));
		} else if (shotDialog.type === 'new') {
			const shotsData = Object.entries(shots).filter(([key, value]) => value === true).map(([key, value]) => {
				const changedValues = diff(defaultFormState, form) // remove blank entries
				return { ...changedValues, ...{ "name": key } }
			})
			dispatch(addShots(shotsData));
		} else {
			const changedValues = diff(shotDialog.data, form)
			changedValues.id = form.uid
			dispatch(updateShot(changedValues));
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...shotDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth={shotDialog.type.startsWith('csv') ? "md" : "xs"}
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full justify-between">
					<Typography variant="subtitle1" color="inherit">
						{
							shotDialog.type === 'new'
								? 'New Shot'
								: shotDialog.type === 'edit'
									? 'Edit Shot'
									: shotDialog.type === 'multiple'
										? 'Multiple Shots'
										: shotDialog.type === 'csvCreate'
											? 'Create Shots from CSV'
											: 'Update Shots from CSV'
						}
					</Typography>
					<Typography variant="subtitle1" color="inherit" >
						{project && project.toUpperCase()}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					{shotDialog.type === 'csvCreate' && (
						<>
							<a variant="contained" color="secondary" href={SampleCreateCsv} download="SampleCreateShot.csv">
								Download Sample CSV
							</a>
							{/* <AtomUploadXls validate={validateCsvCreate} /> */}
						</>
					)}
					{shotDialog.type === 'csvUpdate' && (
						<>
							<a variant="contained" color="secondary" href={SampleUpdateCsv} download="SampleUpdateShot.csv">
								Download Sample CSV
							</a>
							{/* <AtomUploadXls validate={validateCsvUpdate} /> */}
						</>
					)}
					{shotDialog.type === 'edit' && (
						<div className="flex mb-16 justify-center">
							<Typography variant="subtitle1" color="secondary" >
								{form.uid}
							</Typography>
						</div>
					)}
					{['new', 'edit', 'multiple'].includes(shotDialog.type) && (<><div className="flex">
						<TextField
							className="mb-12"
							label="Decription"
							id="description"
							name="description"
							value={form.description}
							onChange={handleChange}
							variant="outlined"
							fullWidth
						/>
					</div>
						<div className="flex mb-12">
							<div className="flex flex-col justify-center m-8">
								<Typography variant="subtitle">
									Start Frame
								</Typography>
								<Typography variant="subtitle1">
									{start_frame}
								</Typography>
							</div>
							<div className="flex-1 m-8">
								<Autocomplete
									value={form.end_frame.toString()}
									onChange={(event, newValue) => {
										setInForm('end_frame', newValue)
										if (parseInt(newValue) <= parseInt(start_frame)) {
											setInForm('start_frame', (parseInt(newValue) - 1).toString())
											setInForm('total_frames', 1)
										} else {
											setInForm('total_frames', parseInt(newValue) - parseInt(start_frame))
										}
									}}
									disableClearable
									// getOptionLabel={option => option.uid}
									id="end_frame"
									options={frames}
									renderInput={(params) => <TextField {...params} label="End Frame" variant="outlined" />}
								/>
							</div>
							<div className="flex flex-col justify-center m-8">
								<Typography variant="subtitle">
									Total Frames
								</Typography>
								<Typography variant="subtitle1">
									{parseInt(form.end_frame) - parseInt(start_frame)}
								</Typography>
							</div>
						</div>

					</>)}
					{shotDialog.type === 'new' && (
						<>
							<div className="flex flex-1 mb-12">
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
										disabled={shotDialog.type === 'edit'}

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
										disabled={shotDialog.type === 'edit'}

									/>
								</div>
							</div>
							<div className="flex flex-row mb-12">
								<div className="mr-5 flex-1">
									<Autocomplete
										value={rangeX}
										onChange={handleRangeXChange}
										// inputValue={inputValue}
										// onInputChange={(event, newInputValue) => {
										//   setInputValue(newInputValue);
										// }}
										disableClearable
										id="range-list-demo"
										options={rangeList}
										// style={{ width: 200 }}
										renderInput={(params) => <TextField {...params} label="Range X" required variant="outlined" />}
									/>
								</div>
								<div className="flex-1">
									<Autocomplete
										value={decimal}
										onChange={(event, newValue) => {
											setDecimal(newValue);
										}}
										disableClearable
										id="decimal"
										options={["3", "4"]}
										// style={{ width: 150 }}
										renderInput={(params) => <TextField {...params} label="Decimal" required variant="outlined" />}
									/>
								</div>
							</div>
							<div className="flex mb-12">
								<div className="mr-5 flex-1">
									<TextField

										label="Starts With"
										value={prefix}
										onChange={(event) => {
											setPrefix(event.target.value);
										}}
										variant="outlined"
										fullWidth
									/>
								</div>
								<div className="flex-1">
									<TextField
										label="Ends With"
										value={ext}
										onChange={(event) => {
											setExt(event.target.value);
										}}
										variant="outlined"
										fullWidth
									/>
								</div>
							</div>

							<div className="flex flex-wrap mb-12">

								<Typography id="range-slider" gutterBottom>
									Shot range
								</Typography>
								<Slider
									value={range}
									min={step}
									max={maxValue}
									step={step}
									marks
									onChange={(event, newValue) => {
										setRange(newValue)
									}}
									valueLabelDisplay="auto"
									aria-labelledby="range-slider"
								/>
							</div>
							<div className="flex flex-col">
								<div className="">
									<Typography id="range-slider" gutterBottom>
										Checked Shots will be created :
									</Typography>
								</div>
								<div className="">
									<FormGroup row>
										{shots && Object.keys(shots).map(key =>
										(<FormControlLabel
											key={key}
											control={<Checkbox
												onChange={toggleInSelected}
												checked={shots[key]}
											/>}
											name={key}
											label={key}
										/>)
										)}
									</FormGroup>
								</div>
							</div>
						</>

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
						{['edit', 'multiple', 'csvUpdate'].includes(shotDialog.type) ? 'Update' : 'Create'}
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

export default ShotDialog;
