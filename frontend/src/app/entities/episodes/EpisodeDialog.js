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
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import React, { useCallback, useEffect, useState } from 'react';
import _ from '@/lodash';
import diff from 'object-diff';
import { useDispatch, useSelector } from 'react-redux';
import {
	addEpisodes,
	updateEpisode,
	closeNewEpisodeDialog,
	closeEditEpisodeDialog,
	closeMultipleEpisodeDialog,
	closeCsvCreateDialog,
	closeCsvUpdateDialog,
	updateMultipleEpisodes,
} from './store/episodeSlice';
// import AtomUploadXls from '@/components/core/xls_table/AtomUploadXls';
import SampleCreateCsv from './sample/sample_create_episode.csv';
import SampleUpdateCsv from './sample/sample_update_episode.csv';

const defaultFormState = {
	name: '',
	description: '',
};

function EpisodeDialog(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const episodeDialog = props.episodeDialog;
	const episodeIds = props.episodeIds

	const { form, handleChange, setForm, setInForm } = useForm(defaultFormState);

	const project = routeParams.uid.split(':')[0].toLowerCase()

	const rangeList = ["1x", "5x", "10x", "100x"]

	const [step, setStep] = useState(1);
	const [range, setRange] = useState([1, 10]);
	const [rangeX, setRangeX] = useState(rangeList[0]);
	const [maxValue, setMaxValue] = useState(step * 1000);
	const [decimal, setDecimal] = useState("3");
	const [prefix, setPrefix] = useState('');
	const [ext, setExt] = useState('');

	const [episodes, setEpisodes] = useState({})
	const [multipleEpisodeList, setMultipleEpisodeList] = useState([])

	function validateCsvCreate(csvData) {

		const valiData = csvData.map(item => {
			item.reason = "Valid"
			item.valid = true
			item.project = project
			if (!item.description) {
				item.reason = "Invalid Description"
				item.valid = false
			}
			if (episodeIds && episodeIds.includes(project + ':' + item.name)) {
				item.reason = "Already Exists"
				item.valid = false
			}
			return item
		})

		const data = valiData.filter(item => item.valid).map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setMultipleEpisodeList(data)
		return valiData

	}

	function validateCsvUpdate(csvData) {

		const valiData = csvData.map(item => {
			item.reason = "Valid"
			item.valid = true
			if (episodeIds && !episodeIds.includes(item.uid)) {
				item.reason = "Episode Not Exists"
				item.valid = false
			}
			return item
		})

		const data = valiData.filter(item => item.valid).map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setMultipleEpisodeList(data)
		return valiData

	}

	const handleRangeChange = (event, newValue) => {
		setRange(newValue);
	};

	const handleRangeXChange = (event, newValue) => {
		setRangeX(newValue);
		const newRangeX = parseInt(newValue.replace('x', ''))
		setRange([newRangeX, newRangeX * 10])
		setStep(newRangeX)
		setMaxValue(newRangeX * 1000)
	};

	const toggleInSelected = (event) => {
		const checked = (episodeIds && episodeIds.includes(project + ':' + event.target.name)) ? false : event.target.checked
		setEpisodes({
			...episodes,
			[event.target.name]: checked,
		});
	}

	useEffect(() => {

		const epis = {}
		_.range(range[0], range[1], step).map(ep => {
			const episode = prefix + (("0".repeat(parseInt(decimal)) + ep).slice(-parseInt(decimal))) + ext
			epis[episode] = (episodeIds && episodeIds.includes(project + ':' + episode)) ? false : true
		})
		setEpisodes(epis)

	}, [range, step, decimal, prefix, ext])

	const initDialog = useCallback(() => {
		if (episodeDialog.type === 'edit' && episodeDialog.data) {
			setForm({ ...episodeDialog.data });
		}

		if (episodeDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...episodeDialog.data,
			});
			setInForm('project', project)

		}
	}, [episodeDialog.data, episodeDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (episodeDialog.props.open) {
			initDialog();
		}
	}, [episodeDialog.props.open, initDialog]);

	function closeComposeDialog() {
		episodeDialog.type === 'edit'
			? dispatch(closeEditEpisodeDialog())
			: episodeDialog.type === 'new'
				? dispatch(closeNewEpisodeDialog())
				: episodeDialog.type === 'multiple'
					? dispatch(closeMultipleEpisodeDialog())
					: episodeDialog.type === 'csvCreate'
						? dispatch(closeCsvCreateDialog())
						: dispatch(closeCsvUpdateDialog())

		handleRangeXChange('', '1x')
		setDecimal('3')
		setPrefix('')
		setExt('')
	}

	function canBeSubmitted() {
		const check = Object.values(episodes).filter((ep) => ep === true)
		return (
			episodeDialog.type.startsWith('csv')
				? multipleEpisodeList.length > 0
				: check.length > 0
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (episodeDialog.type === 'csvCreate' && multipleEpisodeList.length > 0) {
			dispatch(addEpisodes(multipleEpisodeList));
		} else if (episodeDialog.type === 'csvUpdate' && multipleEpisodeList.length > 0) {
			dispatch(updateMultipleEpisodes({ multipleEpisodeList, project }));
		} else if (episodeDialog.type === 'multiple' && episodeDialog.data && episodeDialog.data.length > 0) {
			const formData = episodeDialog.data.map(item => {
				const changedValues = diff(defaultFormState, form) // remove blank entries
				changedValues.uid = item
				return changedValues
			})
			dispatch(updateMultipleEpisodes({ multipleEpisodeList: formData, project }));
		} else if (episodeDialog.type === 'new') {
			const episodesData = Object.entries(episodes).filter(([key, value]) => value === true).map(([key, value]) => {
				return { ...form, ...{ "name": key } }
			})
			dispatch(addEpisodes(episodesData));
		} else {
			const changedValues = diff(episodeDialog.data, form)
			changedValues.id = form.uid
			dispatch(updateEpisode(changedValues));
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...episodeDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth={episodeDialog.type.startsWith('csv') ? "md" : "xs"}
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full justify-between">
					<Typography variant="subtitle1" color="inherit">
						{
							episodeDialog.type === 'new'
								? 'New Episode'
								: episodeDialog.type === 'edit'
									? 'Edit Episode'
									: episodeDialog.type === 'multiple'
										? 'Multiple Episodes'
										: episodeDialog.type === 'csvCreate'
											? 'Create Episodes from CSV'
											: 'Update Episodes from CSV'
						}
					</Typography>
					<Typography variant="subtitle1" color="inherit" >
						{project && project.toUpperCase()}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					{episodeDialog.type === 'csvCreate' && (
						<>
							<a variant="contained" color="secondary" href={SampleCreateCsv} download="SampleCreateEpisode.csv">
								Download Sample CSV
							</a>
							{/* <AtomUploadXls validate={validateCsvCreate} /> */}
						</>
					)}
					{episodeDialog.type === 'csvUpdate' && (
						<>
							<a variant="contained" color="secondary" href={SampleUpdateCsv} download="SampleUpdateEpisode.csv">
								Download Sample CSV
							</a>
							{/* <AtomUploadXls validate={validateCsvUpdate} /> */}
						</>
					)}
					{episodeDialog.type === 'edit' && (
						<div className="flex mb-16 justify-center">
							<Typography variant="subtitle1" color="secondary" >
								{form.uid}
							</Typography>
						</div>
					)}
					{['new', 'edit', 'multiple'].includes(episodeDialog.type) && (<div className="flex flex-1 mb-16">
						<TextField
							label="Description"
							autoFocus
							onChange={handleChange}
							id="description"
							name="description"
							value={form.description}
							variant="outlined"
							fullWidth
						/>
					</div>)}
					{episodeDialog.type === 'new' && (
						<>
							<div className="flex flex-row mb-16">
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
							<div className="flex mb-16">
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

							<div className="flex flex-wrap mb-16">

								<Typography id="range-slider" gutterBottom>
									Episode range
								</Typography>
								<Slider
									value={range}
									min={step}
									max={maxValue}
									step={step}
									marks
									onChange={handleRangeChange}
									valueLabelDisplay="auto"
									aria-labelledby="range-slider"
								/>
							</div>
							<div className="flex flex-col">
								<div className="">
									<Typography id="range-slider" gutterBottom>
										Checked Episodes will be created :
									</Typography>
								</div><div className="">
									<FormGroup row>
										{episodes && Object.keys(episodes).map(key =>
										(<FormControlLabel
											key={key}
											control={<Checkbox
												onChange={toggleInSelected}
												checked={episodes[key]}
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
						{['edit', 'multiple', 'csvUpdate'].includes(episodeDialog.type) ? 'Update' : 'Create'}
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

export default EpisodeDialog;
