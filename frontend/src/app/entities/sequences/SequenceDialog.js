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
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useParams } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import _ from '@/lodash';
import diff from 'object-diff';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateSequence,
	addSequences,
	closeNewSequenceDialog,
	closeEditSequenceDialog,
	closeMultipleSequenceDialog,
	closeCsvCreateDialog,
	closeCsvUpdateDialog,
	updateMultipleSequences,
} from './store/sequenceSlice';
// import AtomUploadXls from '@/components/core/xls_table/AtomUploadXls';
import SampleCreateCsv from './sample/sample_create_sequence.csv';
import SampleUpdateCsv from './sample/sample_update_sequence.csv';
import { getEpisodes } from 'src/app/entities/episodes/store/episodeSlice';

const defaultFormState = {
	name: '',
	episode: '',
	project_code: '',
	description: '',
};

function SequenceDialog(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const sequenceDialog = props.sequenceDialog;
	const episodeIds = props.episodeIds;
	const sequenceIds = props.sequenceIds;

	const { form, handleChange, setForm, setInForm, resetForm } = useForm(defaultFormState);

	const projects = useSelector(({ core }) => core.projects.entities)
	const project = routeParams?.uid?.split(':')[0].toLowerCase()
	const is_episodic = projects && projects[project]?.is_episodic

	const rangeList = ["1x", "5x", "10x", "100x"]
	const [parent, setParent] = useState(project)

	const [step, setStep] = useState(1);
	const [range, setRange] = useState([1, 10]);
	const [rangeX, setRangeX] = useState(rangeList[0]);
	const [maxValue, setMaxValue] = useState(step * 90);
	const [decimal, setDecimal] = useState("3");
	const [prefix, setPrefix] = useState('');
	const [ext, setExt] = useState('');
	const [sequences, setSequences] = useState([]);
	const [multipleSequenceList, setMultipleSequenceList] = useState([])

	function validateCsvCreate(csvData) {

		const valiData = csvData.map(item => {
			item.reason = "Valid"
			item.valid = true
			item.project = project
			if (!item.description) {
				item.reason = "Invalid Description"
				item.valid = false
			}
			if (episodeIds && !episodeIds.includes(item.episode)) {
				item.reason = "Invalid Episode"
				item.valid = false
			}
			if (sequenceIds && sequenceIds.includes(item.episode + ':' + item.name)) {
				item.reason = "Already Exists"
				item.valid = false
			}
			return item
		})

		const data = valiData.filter(item => item.valid).map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setMultipleSequenceList(data)
		return valiData

	}

	function validateCsvUpdate(csvData) {

		const valiData = csvData.map(item => {
			item.reason = "Valid"
			item.valid = true
			if (sequenceIds && !sequenceIds.includes(item.uid)) {
				item.reason = "Sequence Not Exists"
				item.valid = false
			}
			return item
		})

		const data = valiData.filter(item => item.valid).map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setMultipleSequenceList(data)
		return valiData
	}

	const handleSliderChange = (event, newValue) => {
		setRange(newValue);
	};

	const handleRangeXChange = (event, newValue) => {
		setRangeX(newValue);
		const newRangeX = parseInt(newValue.replace('x', ''))
		setRange([newRangeX, newRangeX * 10])
		setStep(newRangeX)
		setMaxValue(newRangeX * 90)
	};

	useEffect(() => {
		routeParams && is_episodic && dispatch(getEpisodes(routeParams));
	}, [routeParams, is_episodic]);

	useEffect(() => {

		const seqs = {}
		_.range(range[0], range[1], step).map(sq => {
			const sequence = prefix + (("0".repeat(parseInt(decimal)) + sq).slice(-parseInt(decimal))) + ext
			seqs[sequence] = (sequenceIds && sequenceIds.includes(parent + ':' + sequence)) ? false : true
		})
		parent && setSequences(seqs)

	}, [range, step, decimal, prefix, ext, parent])


	const initDialog = useCallback(() => {
		resetForm()
		if (sequenceDialog.type === 'edit' && sequenceDialog.data) {
			setForm({ ...sequenceDialog.data });
		}

		if (sequenceDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...sequenceDialog.data,
			});
			setInForm('project', project)
			setParent(project)
		}
	}, [sequenceDialog.data, sequenceDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (sequenceDialog.props.open) {
			initDialog();
		}
	}, [sequenceDialog.props.open, initDialog]);

	const toggleInSelected = (event) => {
		const checked = (sequenceIds && sequenceIds.includes(project + ':' + event.target.name)) ? false : event.target.checked
		setSequences({
			...sequences,
			[event.target.name]: checked,
		});
	}

	function closeComposeDialog() {
		sequenceDialog.type === 'edit'
			? dispatch(closeEditSequenceDialog())
			: sequenceDialog.type === 'new'
				? dispatch(closeNewSequenceDialog())
				: sequenceDialog.type === 'multiple'
					? dispatch(closeMultipleSequenceDialog())
					: sequenceDialog.type === 'csvCreate'
						? dispatch(closeCsvCreateDialog())
						: dispatch(closeCsvUpdateDialog())

		handleRangeXChange('', '1x')
		setDecimal('3')
		setPrefix('')
		setExt('')
		setSequences({})
	}

	function canBeSubmitted() {
		const check = Object.values(sequences).filter((sq) => sq === true)
		return (
			sequenceDialog.type.startsWith('csv')
				? multipleSequenceList.length > 0
				: check.length > 0
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (sequenceDialog.type === 'csvCreate' && multipleSequenceList.length > 0) {
			dispatch(addSequences(multipleSequenceList));
		} else if (sequenceDialog.type === 'csvUpdate' && multipleSequenceList.length > 0) {
			dispatch(updateMultipleSequences({ multipleSequenceList, project }));
		} else if (sequenceDialog.type === 'multiple' && sequenceDialog.data && sequenceDialog.data.length > 0) {
			const formData = sequenceDialog.data.map(item => {
				const changedValues = diff(defaultFormState, form) // remove blank entries
				changedValues.uid = item
				return changedValues
			})
			dispatch(updateMultipleSequences({ multipleSequenceList: formData, project }));
		} else if (sequenceDialog.type === 'new') {
			const sequencesData = Object.entries(sequences).filter(([key, value]) => value === true).map(([key, value]) => {
				return { ...form, ...{ "name": key } }
			})
			dispatch(addSequences(sequencesData));
		} else {
			const changedValues = diff(sequenceDialog.data, form)
			changedValues.id = form.uid
			dispatch(updateSequence(changedValues));
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...sequenceDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth={sequenceDialog.type.startsWith('csv') ? "md" : "xs"}
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full justify-between">
					<Typography variant="subtitle1" color="inherit">
						{
							sequenceDialog.type === 'new'
								? 'New Sequence'
								: sequenceDialog.type === 'edit'
									? 'Edit Sequence'
									: sequenceDialog.type === 'multiple'
										? 'Multiple Sequences'
										: sequenceDialog.type === 'csvCreate'
											? 'Create Sequences from CSV'
											: 'Update Sequences from CSV'
						}
					</Typography>
					<Typography variant="subtitle1" color="inherit" >
						{project && project.toUpperCase()}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					{sequenceDialog.type === 'csvCreate' && (
						<>
							<a variant="contained" color="secondary" href={SampleCreateCsv} download="SampleCreateSequence.csv">
								Download Sample CSV
							</a>
							{/* <AtomUploadXls validate={validateCsvCreate} /> */}
						</>
					)}
					{sequenceDialog.type === 'csvUpdate' && (
						<>
							<a variant="contained" color="secondary" href={SampleUpdateCsv} download="SampleUpdateSequence.csv">
								Download Sample CSV
							</a>
							{/* <AtomUploadXls validate={validateCsvUpdate} /> */}
						</>
					)}
					{sequenceDialog.type === 'edit' && (
						<div className="flex mb-16 justify-center">
							<Typography variant="subtitle1" color="secondary" >
								{form.uid}
							</Typography>
						</div>
					)}
					{['new', 'edit', 'multiple'].includes(sequenceDialog.type) && (<div className="flex">
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
					</div>)}
					{sequenceDialog.type === 'new' && (
						<>
							{is_episodic && (<div className="flex flex-row mb-16">
								<div className="flex-1">
									<Autocomplete
										value={form.episode}
										onChange={(event, newValue) => {
											setInForm('episode', newValue)
											setParent(newValue)
										}}
										disableClearable
										getOptionLabel={option => option.split(':').slice(-1).join()}
										id="episode"
										options={episodeIds}
										renderInput={(params) =>
											<TextField {...params}
												label="Episode"
												required
												variant="outlined"
											/>
										}
									/>
								</div>
							</div>)}

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
									Sequence range
								</Typography>
								<Slider
									value={range}
									min={step}
									max={maxValue}
									step={step}
									marks
									onChange={handleSliderChange}
									valueLabelDisplay="auto"
									aria-labelledby="range-slider"
								/>
							</div>
							<div className="flex flex-col">
								<div className="">
									<Typography id="range-slider" gutterBottom>
										Checked Sequences will be created :
									</Typography>
								</div><div className="">
									<FormGroup row>
										{sequences && Object.keys(sequences).map(key =>
										(<FormControlLabel
											key={key}
											control={<Checkbox
												onChange={toggleInSelected}
												checked={sequences[key]}
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
						{['edit', 'multiple', 'csvUpdate'].includes(sequenceDialog.type) ? 'Update' : 'Create'}
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

export default SequenceDialog;
