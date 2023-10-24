import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Icon from '@mui/material/Icon';
import SvgIcon from '@/components/core/SvgIcon';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import NoteForm from './NoteForm';
import { addNote, replyNote } from 'src/app/entities/notes/store/noteSlice';
import axios from 'axios';

const useStyles = styled({
	button: {
		cursor: 'text'
	}
});

function NewNote(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const classes = useStyles(props);
	const [formOpen, setFormOpen] = useState(false);

	const noteType = props.type
	const noteId = props.noteId ? props.noteId : ''
	const project = routeParams.uid.split(':')[0].toLowerCase()

	function handleFormOpen(ev) {
		ev.stopPropagation();
		setFormOpen(true);
		document.addEventListener('keydown', escFunction, false);
	}

	function handleFormClose() {
		if (!formOpen) {
			return;
		}
		setFormOpen(false);
		document.removeEventListener('keydown', escFunction, false);
	}

	async function setNoteEntities(note) {
		try {
			const response = await axios.get('/api/v1/entity/' + routeParams.entity + 's/' + routeParams.uid + '/');
			const data = await response.data;

			if (data.asset) { note.asset = data.asset }
			if (data.episode) { note.episode = data.episode }
			if (data.sequence) { note.sequence = data.sequence }
			if (data.shot) { note.shot = data.shot }
			if (data.step) { note.step = data.step }
			dispatch(addNote(note));
		} catch {
			console.error("Note Entity Not found ...")
		}
	}

	function handleCreate(note) {
		note.project = project
		note[routeParams.entity] = routeParams.uid

		if (!['project', 'episode', 'asset'].includes(routeParams.entity)) {
			setNoteEntities(note)
		} else {
			dispatch(addNote(note));
		}
		handleFormClose();
	}

	function handleReply(note) {
		note.project = project
		dispatch(replyNote(note));
		handleFormClose();
	}

	function escFunction(event) {
		if (event.keyCode === 27) {
			handleFormClose();
		}
	}

	function handleClickAway(ev) {
		const preventCloseElements = document.querySelector('.prevent-add-close');
		const preventClose = preventCloseElements ? preventCloseElements.contains(ev.target) : false;
		if (preventClose) {
			return;
		}
		handleFormClose();
	}

	return (
		<>
			{formOpen ? (
				<Paper
					className={clsx(classes.button, 'flex items-center w-full mb-8 rounded-16 shadow')}
				>
					<ClickAwayListener onClickAway={handleClickAway}>
						<div className="w-full">
							<NoteForm onCreate={(noteType === 'Reply') ? handleReply : handleCreate} variant="new" noteId={noteId} type={noteType} />
						</div>
					</ClickAwayListener>
				</Paper>
			) : noteType === 'Reply' ? (
				<Button onClick={handleFormOpen}
					endIcon={<SvgIcon size={14}>heroicons-outline:reply</SvgIcon>}
				>
					Reply
				</Button>
			) : (
				<Paper
					className={clsx(classes.button, 'flex items-center w-full mb-8 rounded-16 shadow')}
				>
					<Typography
						className="px-16 py-12 font-500 text-16 w-full"
						color="textSecondary"
						onClick={handleFormOpen}
					>
						Click to take a note..
					</Typography>
				</Paper>
			)}
		</>
	);
}

export default NewNote;
