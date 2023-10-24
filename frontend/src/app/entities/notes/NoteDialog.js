import { useForm } from '@/hooks';
import CustomScrollbars from '@/components/core/CustomScrollbars';
import Tooltip from '@mui/material/Tooltip';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Fab from '@mui/material/Fab';
import { useParams } from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import _ from '@/lodash';
import clsx from 'clsx';
import diff from 'object-diff';
import { useDispatch, useSelector } from 'react-redux';
import {
	addNote,
	addNotes,
	updateNote,
	updateReply,
	closeNewNoteDialog,
	closeEditNoteDialog,
	closeEditReplyDialog,
	closeCsvCreateDialog,
	closeCsvUpdateDialog,
	updateMultipleNotes,
} from './store/noteSlice';
import XLSUpload from '@/components/core/Upload/XLSUpload';
import SampleCreateCsv from './sample/sample_create_note.csv';
import SampleUpdateCsv from './sample/sample_update_note.csv';

const defaultFormState = {
	message: '',
};

function NoteDialog(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const noteDialog = props.noteDialog;
	const noteIds = props.noteIds
	const user = useSelector(({ user }) => user.id)

	const { form, handleChange, setForm, setInForm } = useForm(defaultFormState);

	const project = routeParams.uid.split(':')[0].toLowerCase()
	const entity = routeParams.entity.toLowerCase()

	const [files, setFiles] = useState([])
	const [notes, setNotes] = useState({})
	const [multipleNoteList, setMultipleNoteList] = useState([])

	function validateCsvCreate(csvData) {

		const valiData = csvData.map(item => {
			item.reason = "Valid"
			item.valid = true
			item.project = project
			item.created_by = user
			if (!item.message) {
				item.reason = "Invalid Message"
				item.valid = false
			}
			return item
		})

		const data = valiData.filter(item => item.valid).map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setMultipleNoteList(data)
		return valiData

	}

	function validateCsvUpdate(csvData) {

		const valiData = csvData.map(item => {
			item.reason = "Valid"
			item.valid = true
			item.updated_by = user
			if (noteIds && !noteIds.includes(item.id)) {
				item.reason = "Note Not Exists"
				item.valid = false
			}
			return item
		})

		const data = valiData.filter(item => item.valid).map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setMultipleNoteList(data)
		return valiData

	}


	function handleRemoveImage() {
		setForm(_.setIn(form, `preview`, ''));
	}

	function handleAttachmentRemove(fileName) {
		const updatedFiles = Array.from(files).filter(item => item.name !== fileName)
		setFiles(updatedFiles)
	}

	function handleUploadChange(e) {

		const file = e.target.files[0];
		if (!file) {
			return;
		}
		const reader = new FileReader();

		reader.readAsBinaryString(file);

		reader.onload = () => {
			setForm(_.setIn(form, `preview`, `data:${file.type};base64,${btoa(reader.result)}`));
		};

		reader.onerror = () => {
			console.log('error on load image');
		};

		const newFiles = e.target.files

		const uploaded = []
		Array.from(newFiles).map(item => {
			if (Array.from(files).length > 0) {
				(Array.from(files).filter(value => value.name === item.name)).length == 0 && uploaded.push(item)
			} else {
				uploaded.push(item)
			}
		})


		setFiles([...files, ...uploaded])
	}

	const initDialog = useCallback(() => {
		if (['edit', 'editReply'].includes(noteDialog.type) && noteDialog.data) {
			setForm({ ...noteDialog.data });
			setInForm('updated_by', user)
		}

		if (noteDialog.type === 'new') {
			setFiles([])
			setForm({
				...defaultFormState,
				...noteDialog.data,
			});
			setInForm('project', project)
			setInForm('created_by', user)
			setInForm('updated_by', user)

		}
	}, [noteDialog.data, noteDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (noteDialog.props.open) {
			initDialog();
		}
	}, [noteDialog.props.open, initDialog]);

	function closeComposeDialog() {
		noteDialog.type === 'editReply'
			? dispatch(closeEditReplyDialog())
			: noteDialog.type === 'edit'
				? dispatch(closeEditNoteDialog())
				: noteDialog.type === 'new'
					? dispatch(closeNewNoteDialog())
					: noteDialog.type === 'csvCreate'
						? dispatch(closeCsvCreateDialog())
						: dispatch(closeCsvUpdateDialog())
	}

	function canBeSubmitted() {
		return (
			noteDialog.type.startsWith('csv')
				? multipleNoteList.length > 0
				: form.message
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (noteDialog.type === 'csvCreate' && multipleNoteList.length > 0) {
			dispatch(addNotes(multipleNoteList));
		} else if (noteDialog.type === 'csvUpdate' && multipleNoteList.length > 0) {
			dispatch(updateMultipleNotes({ multipleNoteList, project }));
		} else if (noteDialog.type === 'new') {
			form.files = files
			form[entity] = routeParams.uid
			form.project = project
			console.info(form)
			dispatch(addNote(form));
		} else {
			const changedValues = diff(noteDialog.data, form)
			changedValues.id = form.id
			if (noteDialog.type === 'editReply') {
				changedValues.note_id = form.note
				dispatch(updateReply(changedValues))
			} else {
				dispatch(updateNote(changedValues))
			}
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...noteDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth={noteDialog.type.startsWith('csv') ? "md" : "xs"}
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full justify-between">
					<Typography variant="subtitle1" color="inherit">
						{
							noteDialog.type === 'new'
								? 'New Note'
								: noteDialog.type === 'edit'
									? 'Edit Note'
									: noteDialog.type === 'editReply'
										? 'Edit Reply'
										: noteDialog.type === 'csvCreate'
											? 'Create Notes from CSV'
											: 'Update Notes from CSV'
						}
					</Typography>
					<Typography variant="subtitle1" color="inherit" >
						{project && project.toUpperCase()}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					{noteDialog.type === 'csvCreate' && (
						<>
							<a variant="contained" color="secondary" href={SampleCreateCsv} download="SampleCreateNote.csv">
								Download Sample CSV
							</a>
							<XLSUpload validate={validateCsvCreate} />
						</>
					)}
					{noteDialog.type === 'csvUpdate' && (
						<>
							<a variant="contained" color="secondary" href={SampleUpdateCsv} download="SampleUpdateNote.csv">
								Download Sample CSV
							</a>
							<XLSUpload validate={validateCsvUpdate} />
						</>
					)}
					{['new', 'edit', 'editReply'].includes(noteDialog.type) && (
						<div className="flex flex-1 mb-16">
							<Input
								placeholder='Add a comment..'
								multiline
								rows="4"
								name="message"
								value={form.message}
								onChange={handleChange}
								disableUnderline
								fullWidth
								autoFocus
							/>
						</div>)}
					{noteDialog.type === 'new' && (<>
						<div className="flex items-center px-4">
							<Tooltip title="Add attachments" placement="bottom">
								<div>
									<label htmlFor="button-file">
										<input accept="image/*" multiple className="hidden" id="button-file" type="file" onChange={handleUploadChange} />
										<IconButton className="w-32 h-32 mx-4 p-0" component="span">
											<Icon fontSize="small">attachment</Icon>
										</IconButton>
									</label>
								</div>
							</Tooltip>
						</div>
						<div className="flex flex-col w-full">
							<CustomScrollbars className="flex flex-auto w-full max-h-640">
								<div className="w-full">
									{form.preview && form.preview !== '' && (
										<div className="relative">
											<img src={form.preview} className="w-full block" alt="note" />
											<Fab
												className="absolute right-0 bottom-0 m-8"
												variant="extended"
												size="small"
												color="secondary"
												aria-label="Delete Image"
												onClick={handleRemoveImage}
											>
												<Icon fontSize="small">delete</Icon>
											</Fab>
										</div>
									)}
									{files.length > 0 && (
										<ul className="py-8 px-16 flex flex-wrap list-reset">
											{Array.from(files).map(item => (
												<li key={item.name} className="flex items-center w-full">
													<Icon color="action" className="text-16">
														{item.type ? 'attachment' : 'photo'}
													</Icon>
													<Typography className={clsx('truncate mx-8')}
													// color={item.checked ? 'textSecondary' : 'inherit'}
													>
														{item.name}
													</Typography>
													<IconButton
														className="w-32 h-32 mx-4 p-0"
														aria-label="Delete"
														onClick={() => handleAttachmentRemove(item.name)}
													>
														<Icon fontSize="small">delete</Icon>
													</IconButton>
												</li>
											))}
										</ul>
									)}

								</div>
							</CustomScrollbars>
						</div>
					</>)}

				</DialogContent>

				<DialogActions className="justify-between pl-16">

					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						type="submit"
						disabled={!canBeSubmitted()}
					>
						{noteDialog.type === 'new' ? 'Add' : 'Save'}
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

export default NoteDialog;
