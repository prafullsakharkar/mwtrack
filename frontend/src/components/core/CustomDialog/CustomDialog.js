import Dialog from '@mui/material/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeDialog,
  selectDialogOptions,
  selectDialogState,
} from '@/stores/core/dialogSlice';

function CustomDialog(props) {
  const dispatch = useDispatch();
  const state = useSelector(selectDialogState);
  const options = useSelector(selectDialogOptions);

  return (
    <Dialog
      open={state}
      onClose={(ev) => dispatch(closeDialog())}
      aria-labelledby="core-dialog-title"
      classes={{
        paper: 'rounded-8',
      }}
      {...options}
    />
  );
}

export default CustomDialog;
