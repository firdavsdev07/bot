import { Snackbar, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { clearError } from '../../store/slices/errorSlice';

const ErrorSnackbar = () => {
  const dispatch = useAppDispatch();
  const { message, type, duration } = useSelector((state: RootState) => state.error);

  const handleClose = () => {
    dispatch(clearError());
  };

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={type || 'info'} 
        sx={{ 
          width: '100%',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
