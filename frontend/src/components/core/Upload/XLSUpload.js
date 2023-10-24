import Typography from '@mui/material/Typography';
import MaterialReactTable from "material-react-table";
import Icon from '@mui/material/Icon';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

class DragDropFile extends React.Component {
	constructor(props) {
		super(props);
		this.onDrop = this.onDrop.bind(this);
	}
	suppress(evt) {
		evt.stopPropagation();
		evt.preventDefault();
	}
	onDrop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		const files = evt.dataTransfer.files;
		if (files && files[0]) this.props.handleFile();
	}
	render() {
		return (
			<div
				onDrop={this.onDrop}
				onDragEnter={this.suppress}
				onDragOver={this.suppress}
			>
				{this.props.children}
			</div>
		);
	}
}


function AtomUploadXls(props) {

	const [data, setData] = useState([])
	const [columns, setColumns] = useState([])

	function handleUploadChange(e) {
		setData([])
		setColumns([])

		const file = e.target.files[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = e => {
			/* Parse data */
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			// console.log(rABS, wb);
			/* Convert array of arrays */
			const dataValues = XLSX.utils.sheet_to_json(ws, { defval: "" });
			/* Update state */
			const validateData = props.validate(dataValues)
			// console.log(validateData);
			setData(validateData)
			// setCsvHeader(make_cols(ws["!ref"]))
		};
		if (rABS) reader.readAsBinaryString(file);
		else reader.readAsArrayBuffer(file);

		reader.onerror = () => {
			console.error('error on uploading csv file');
		};
	}

	useEffect(() => {
		const headers = data.length > 0 && Object.keys(data[0]).map(item => (
			item == 'valid' ? {
				header: item.replace('_', ' ').toUpperCase(),
				accessorKey: item,
				Cell: ({ row }) => (
					row.original.valid ? (
						<Icon className="text-green text-20">check_circle</Icon>
					) : (
						<Icon className="text-red text-20">remove_circle</Icon>
					)
				)
			} : {
				header: item.replace('_', ' ').toUpperCase(),
				accessorKey: item,
			}
		))

		headers && setColumns(headers)

	}, [data])



	return (
		<div className='flex flex-col h-full'>
			<DragDropFile handleFile={handleUploadChange}>
				<label
					htmlFor="button-file"
					className=
					'flex items-center justify-center relative w-full h-128 rounded-16 mx-12 mb-12 overflow-hidden cursor-pointer shadow hover:shadow-lg'

				>
					<input
						accept=".csv"
						className="hidden"
						id="button-file"
						type="file"
						onChange={handleUploadChange}
					/>
					<Icon fontSize="large" color="action">
						cloud_upload
					</Icon>
				</label>
			</DragDropFile>
			{data.length === 0 ? (
				<div className="flex flex-1 items-center justify-center h-full mt-8">
					<Typography color="textSecondary" variant="h5">
						There are no data to display!
					</Typography>
				</div>
			) : (
				<div className='flex flex-col h-full'>
					<MaterialReactTable
						columns={columns}
						data={data}
						enableFullScreenToggle={false}
						enableColumnResizing
						enableColumnOrdering
						enablePinning
						enableColumnFilters={false}
						enableDensityToggle={false}
						enableStickyHeader
						initialState={{ showGlobalFilter: true, density: 'compact' }}
						muiTableContainerProps={{ sx: { maxHeight: '400px' } }}
					/>
				</div>
			)}

		</div>
	);
}

export default AtomUploadXls;
