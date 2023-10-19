import SvgIcon from '@/components/core/SvgIcon';
import { motion } from 'framer-motion';
import NavLinkAdapter from '@/components/core/NavLinkAdapter';
import MaterialReactTable from 'material-react-table';
import { Box, IconButton, Button } from '@mui/material';


function MuiTable(props) {
  const { isLoading } = props

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
        enableColumnDragging={false}
        enableRowSelection
        enableRowActions
        enableStickyHeader
        muiTableContainerProps={{ sx: { maxHeight: (document.documentElement.offsetHeight - 250) } }}
        state={{ isLoading: isLoading, showSkeletons: isLoading }}
        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'Actions', //change header text
            size: 70, //make actions column wider
          },
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
            <IconButton
              variant="contained"
              color="secondary"
              component={NavLinkAdapter}
              to={row.original.id + "/edit"}
            >
              <SvgIcon size={20}>heroicons-outline:pencil-alt</SvgIcon>
            </IconButton>
            {/* <IconButton
							variant="contained"
							color="secondary"
							component={NavLinkAdapter}
							to={row.original.id + "/password/change"}
						>
							<SvgIcon size={20}>heroicons-outline:key</SvgIcon>
						</IconButton> */}
          </Box>
        )}
        positionToolbarAlertBanner="bottom" //show selected rows count on bottom toolbar
        {...props}
      />
    </motion.div>
  );
}

export default MuiTable;
