import SvgIcon from '@/components/core/SvgIcon';
import { motion } from 'framer-motion';
import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import MaterialReactTable, {
    MRT_ShowHideColumnsButton,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleGlobalFilterButton

} from "material-react-table";
import { Box, IconButton, Button, Tooltip, Popover, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';


function EntityTable(props) {
    const dispatch = useDispatch();
    const {
        openEditDialog,
        openNewDialog,
        removeEntities,
        openMultipleDialog,
        openCsvCreateDialog,
        openCsvUpdateDialog
    } = props

    const [uploadMenu, setUploadMenu] = useState(null);

    const uploadMenuClick = event => {
        setUploadMenu(event.currentTarget);
    };

    const uploadMenuClose = () => {
        setUploadMenu(null);
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex flex-col flex-auto w-full max-h-full"
        >
            <MaterialReactTable
                enableFullScreenToggle={false}
                enableColumnResizing
                enableColumnOrdering
                enablePinning
                enableRowSelection
                enableRowActions
                enableStickyHeader
                enableColumnFilters={false}
                manualFiltering
                manualPagination
                manualSorting
                muiTableContainerProps={{ sx: { maxHeight: (document.documentElement.offsetHeight - 250) } }}
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        header: 'Actions', //change header text
                        size: 50, //make actions column wider
                    },
                }}
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                        <IconButton
                            color="secondary"
                            onClick={(ev) => {
                                ev.stopPropagation();
                                dispatch(openEditDialog(row.original));
                            }}
                        >
                            <SvgIcon size={20}>heroicons-outline:pencil-alt</SvgIcon>
                        </IconButton>
                    </Box>
                )}

                positionToolbarAlertBanner="bottom" //show selected rows count on bottom assetbar				
                //add custom action buttons to top-left of top assetbar
                renderTopToolbarCustomActions={({ table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                        <Button
                            color="secondary"
                            onClick={(ev) => {
                                ev.stopPropagation();
                                dispatch(openNewDialog());
                            }}
                            variant="contained"
                        >
                            <SvgIcon size={20} className="mr-8">heroicons-outline:plus</SvgIcon>
                            Create
                        </Button>
                        <Button
                            color="primary"
                            disabled={!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())}
                            onClick={() => {
                                const ids = table.getSelectedRowModel().rows.map(row => row.original.uid)
                                dispatch(openMultipleDialog(ids));
                            }}
                            variant="contained"
                        >
                            <SvgIcon size={20} className="mr-8">heroicons-outline:pencil-alt</SvgIcon>
                            Update
                        </Button>
                        <Button
                            color="error"
                            disabled={!(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected())}
                            onClick={() => {
                                const ids = table.getSelectedRowModel().rows.map(row => row.original.uid)
                                dispatch(removeEntities(ids));
                            }}
                            variant="contained"
                        >
                            <SvgIcon size={20} className="mr-8">heroicons-outline:trash</SvgIcon>
                            Delete
                        </Button>
                    </Box>
                )}
                //customize built-in buttons in the top-right of top toolbar
                renderToolbarInternalActions={({ table }) => (
                    <Box>

                        {/* along-side built-in buttons in whatever order you want them */}
                        <MRT_ToggleGlobalFilterButton table={table} />
                        {/* <MRT_ToggleFiltersButton table={table} /> */}
                        <MRT_ShowHideColumnsButton table={table} />
                        <MRT_ToggleDensePaddingButton table={table} />

                        {/* add custom button to print table  */}
                        <Tooltip title="Upload From CSV">
                            <IconButton
                                onClick={uploadMenuClick}
                                aria-label="open right sidebar"
                            >
                                <SvgIcon size={20}>heroicons-outline:upload</SvgIcon>
                            </IconButton>
                        </Tooltip>
                        <Popover
                            open={Boolean(uploadMenu)}
                            anchorEl={uploadMenu}
                            onClose={uploadMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center'
                            }}
                            classes={{
                                paper: 'py-8'
                            }}
                        >
                            <>
                                <MenuItem
                                    onClick={() => {
                                        dispatch(openCsvCreateDialog());
                                        uploadMenuClose();
                                    }}
                                >
                                    <ListItemIcon className="min-w-40">
                                        <SvgIcon size={20} className="mr-8">heroicons-outline:plus-circle</SvgIcon>
                                    </ListItemIcon>
                                    <ListItemText primary="Bulk Create" />
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        dispatch(openCsvUpdateDialog());
                                        uploadMenuClose();
                                    }}
                                >
                                    <ListItemIcon className="min-w-40">
                                        <SvgIcon size={20} className="mr-8">heroicons-outline:pencil-alt</SvgIcon>
                                    </ListItemIcon>
                                    <ListItemText primary="Bulk Update" />
                                </MenuItem>
                            </>
                        </Popover>
                        {/* <Tooltip title="Download Asset">
							<CSVLink data={data} filename={downloadFileName}>
								<IconButton>
									<Icon>get_app</Icon>
								</IconButton>
							</CSVLink>
						</Tooltip> */}

                        {/* <Tooltip title="Download Asset">
							<IconButton
								disabled={table.getPrePaginationRowModel().rows.length === 0}
								//export all rows, including from the next page, (still respects filtering and sorting)
								onClick={() =>
									handleExportRows(table.getPrePaginationRowModel().rows)
								}
							>
								<FileDownloadIcon />
							</IconButton>
						</Tooltip> */}
                    </Box>
                )}
                {...props}
            />
        </motion.div>
    );
}

export default EntityTable;
