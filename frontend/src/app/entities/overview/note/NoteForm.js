import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { useForm, useUpdateEffect } from '@fuse/hooks';
import _ from '@lodash';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import withRouter from '@fuse/core/withRouter';
import { values } from 'lodash';
const item = {
	hidden: { opacity: 0, y: 40 },
	show: { opacity: 1, y: 0 },
};
const defaultFormState = {
	message: '',
};
function NoteForm(props) {
	const [showList, setShowList] = useState(false);
	const dispatch = useDispatch();
	const routeParams = useParams();
	const [files, setFiles] = useState([])
	const { form: noteForm, handleChange, setForm, setInForm } = useForm(defaultFormState);
	// const { onChange } = props;

	// useUpdateEffect(() => {
	// 	if (noteForm && onChange) {
	// 		onChange(noteForm);
	// 	}
	// }, [noteForm, onChange]);

	function handleOnCreate(event) {
		if (!props.onCreate) {
			return;
		}
		if (files.length > 0) {
			noteForm.files = files
		}

		if (props.noteId) {
			noteForm.id = props.noteId
		}
		props.onCreate(noteForm);
	}

	function handleOnChange(event) {
		if (!props.onChange) {
			return;
		}
		props.onChange(noteForm);
	}

	function handleRemoveImage() {
		setForm(_.setIn(noteForm, `image`, ''));
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

		// reader.onload = () => {
		// 	setForm(_.setIn(noteForm, `preview`, `data:${file.type};base64,${btoa(reader.result)}`));
		// };

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

	function newFormButtonDisabled() {
		return (
			noteForm.message === ''
		);
	}

	if (!noteForm) {
		return null;
	}

	return (
			<Card
				component={motion.div}
				variants={item}
				className="w-full overflow-hidden rounded-16 shadow"
			>
				{/* {noteForm.preview && noteForm.preview !== '' && (
					<div className="relative">
						<img src={noteForm.preview} className="w-full block" alt="note" />
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
				)} */}
				<div className="p-16 pb-12">
					<Input
						placeholder={props.type === 'Reply' ? 'Reply to a note..' : 'Take a note..'}
						multiline
						rows="4"
						name="message"
						value={noteForm.message}
						onChange={handleChange}
						disableUnderline
						fullWidth
						autoFocus
					/>
				</div>
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
				<AppBar
					className="card-footer flex flex-row border-t-1"
					position="static"
					color="default"
					elevation={0}
				>
					<div className="flex-1 items-center">
						<Tooltip title="Add attachments" placement="bottom">
							<div>
								<label htmlFor="button-file">
									<input accept="image/*" multiple className="hidden" id="button-file" type="file" onChange={handleUploadChange} />
									<IconButton component="span">
										<Icon>attachment</Icon>
									</IconButton>
								</label>
							</div>
						</Tooltip>
					</div>

					<div className="p-8">
						{props.variant === 'new' ? (
							<Button
								className="m-4"
								onClick={handleOnCreate}
								variant="outlined"
								size="small"
								disabled={newFormButtonDisabled()}
							>
								{props.type === 'Reply' ? 'Reply' : 'Comment'}
							</Button>
						) : (
							<>
								<Button className="m-4" onClick={handleOnChange} variant="outlined" size="small">
									Edit
								</Button>
								<Button className="m-4" onClick={props.onClose} variant="outlined" size="small">
									Close
								</Button>
							</>
						)}
					</div>
				</AppBar>
			</Card>
	);
}

NoteForm.propTypes = {};
NoteForm.defaultProps = {
	variant: 'edit',
	note: null,
	type: 'Comment'
};

export default withRouter(NoteForm);
