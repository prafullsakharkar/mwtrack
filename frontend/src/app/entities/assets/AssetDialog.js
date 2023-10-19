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
// import AtomUploadXls from '@/components/core/xls_table/AtomUploadXls';
import diff from 'object-diff';
import { useDispatch, useSelector } from 'react-redux';
import SampleCreateCsv from './sample/sample_create_asset.csv';
import SampleUpdateCsv from './sample/sample_update_asset.csv';

import {
	updateAsset,
	addAsset,
	updateMultipleAsset,
	closeNewAssetDialog,
	closeEditAssetDialog,
	closeMultipleAssetDialog,
	closeCsvCreateDialog,
	closeCsvUpdateDialog,
} from './store/assetSlice';

const defaultFormState = {
	prefix: '',
	asset_type: '',
	description: '',
	project: '',
	client_name: ''
};


function AssetDialog(props) {
	const dispatch = useDispatch();
	const routeParams = useParams();

	const assetDialog = props.assetDialog;
	const assetIds = props.assetIds;

	const project = routeParams.uid.split(':')[0].toLowerCase()
	const asset_types = ['Fx', 'Set', 'Prop', 'Vehicle', 'Character']
	const { form, handleChange, setForm, setInForm, resetForm } = useForm(defaultFormState);
	const [multipleAssetList, setMultipleAssetList] = useState([])

	function validateCsvCreate(csvData) {

		const valiData = csvData.map(item => {
			item.reason = "Valid Asset"
			item.valid = true
			item.project = project
			if (!asset_types.includes(item.asset_type)) {
				item.reason = "Invalid Asset Type"
				item.valid = false
			}
			if (assetIds && assetIds.includes(project + ':' + item.name)) {
				item.reason = "Asset Already Exists"
				item.valid = false
			}
			return item
		})

		const assetData = valiData.filter(item => item.valid).map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setMultipleAssetList(assetData)
		return valiData

	}

	function validateCsvUpdate(csvData) {

		const valiData = csvData.map(item => {
			item.reason = "Valid Asset"
			item.valid = true
			if (item.asset_type && !asset_types.includes(item.asset_type)) {
				item.reason = "Invalid Asset Type"
				item.valid = false
			}
			if (assetIds && !assetIds.includes(item.uid)) {
				item.reason = "Asset Not Exists"
				item.valid = false
			}
			return item
		})

		const assetData = valiData.filter(item => item.valid).map(item => {
			const changedValues = diff(defaultFormState, item) // remove blank entries
			return changedValues
		})

		setMultipleAssetList(assetData)
		return valiData

	}

	const initDialog = useCallback(() => {
		resetForm()
		if (assetDialog.type === 'edit' && assetDialog.data) {
			setForm({ ...assetDialog.data });
		}

		if (assetDialog.type === 'new') {
			setForm({
				...defaultFormState,
				...assetDialog.data,
			});

			setInForm('project', project)
		}

	}, [assetDialog.data, assetDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (assetDialog.props.open) {
			initDialog();
		}
	}, [assetDialog.props.open, initDialog]);

	function closeComposeDialog() {
		assetDialog.type === 'edit'
			? dispatch(closeEditAssetDialog())
			: assetDialog.type === 'new'
				? dispatch(closeNewAssetDialog())
				: assetDialog.type === 'multiple'
					? dispatch(closeMultipleAssetDialog())
					: assetDialog.type === 'csvCreate'
						? dispatch(closeCsvCreateDialog())
						: dispatch(closeCsvUpdateDialog())

		setMultipleAssetList([])
	}

	function canBeSubmitted() {
		return (
			assetDialog.type.startsWith('csv')
				? multipleAssetList.length > 0
				: assetDialog.type === 'new'
					? form.name && form.asset_type
					: (form.asset_type || form.description || form.prefix || form.client_name)
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (assetDialog.type === 'csvCreate' && multipleAssetList.length > 0) {
			dispatch(addAsset(multipleAssetList));
		} else if (assetDialog.type === 'csvUpdate' && multipleAssetList.length > 0) {
			dispatch(updateMultipleAsset({ multipleAssetList, project }));
		} else if (assetDialog.type === 'multiple' && assetDialog.data && assetDialog.data.length > 0) {
			const formData = assetDialog.data.map(item => {
				const changedValues = diff(defaultFormState, form) // remove blank entries
				changedValues.uid = item
				return changedValues
			})
			dispatch(updateMultipleAsset({ multipleAssetList: formData, project }));

		} else if (assetDialog.type === 'new') {
			dispatch(addAsset(form));
		} else {
			const changedValues = diff(assetDialog.data, form)
			changedValues.id = form.uid
			dispatch(updateAsset(changedValues));
		}
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...assetDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth={assetDialog.type.startsWith('csv') ? "md" : "xs"}
		>
			<AppBar position="static" className="shadow-md">
				<Toolbar className="flex w-full justify-between">
					<Typography variant="subtitle1" color="inherit">
						{
							assetDialog.type === 'new'
								? 'New Asset'
								: assetDialog.type === 'multiple'
									? 'Multiple Asset'
									: assetDialog.type === 'edit'
										? 'Edit Asset'
										: assetDialog.type === 'csvCreate'
											? 'Create Asset from CSV'
											: 'Update Asset from CSV'
						}
					</Typography>
					<Typography variant="subtitle1" color="inherit" >
						{project && project.toUpperCase()}
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<>
						{assetDialog.type === 'csvCreate' && (
							<>
								<a variant="contained" color="secondary" href={SampleCreateCsv} download="SampleCreateAsset.csv">
									Download Sample CSV
								</a>
								{/* <AtomUploadXls validate={validateCsvCreate} /> */}
							</>
						)}
						{assetDialog.type === 'csvUpdate' && (
							<>
								<a variant="contained" color="secondary" href={SampleUpdateCsv} download="SampleUpdateAsset.csv">
									Download Sample CSV
								</a>
								{/* <AtomUploadXls validate={validateCsvUpdate} /> */}
							</>
						)}

						{['new', 'edit', 'multiple'].includes(assetDialog.type) && (
							<>
								{assetDialog.type === 'edit' && (
									<div className="flex mb-16 justify-center">
										<Typography variant="subtitle1" color="secondary" >
											{form.uid}
										</Typography>
									</div>
								)}
								{assetDialog.type === 'new' && (
									<div className="flex">
										<TextField
											className="mb-12"
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
								)}

								<div className="flex">
									<TextField
										className="mb-12"
										label="Prefix"
										id="prefix"
										name="prefix"
										value={form.prefix}
										onChange={handleChange}
										variant="outlined"
										fullWidth
									/>
								</div>
								<div className="flex">
									<TextField
										className="mb-12"
										label="Client Name"
										id="client_name"
										name="client_name"
										value={form.client_name}
										onChange={handleChange}
										variant="outlined"
										fullWidth
									/>
								</div>

								<div className="mb-12">

									<Autocomplete
										value={form.asset_type}
										onChange={(event, newValue) => {
											setInForm('asset_type', newValue)
										}}
										disableClearable
										id="asset_type"
										options={asset_types}
										renderInput={(params) => <TextField {...params} label="Asset Type" required variant="outlined" />}
									/>

								</div>

								<div className="flex">
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
							</>
						)}
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
						{['edit', 'multiple', 'csvUpdate'].includes(assetDialog.type) ? 'Update' : 'Create'}
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

export default AssetDialog;
