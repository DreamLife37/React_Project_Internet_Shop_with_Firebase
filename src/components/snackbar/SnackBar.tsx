import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import {setAppError} from "../../store/slices/appSlice";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function SnackBar() {
    const error = useAppSelector(state => state.app.error)
    const dispatch = useAppDispatch()

    const isOpen = error.messageError !== null;

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppError({error: {messageError: null, typeError: 'warning'}}))
    };

    return (
        <Stack spacing={2} sx={{width: '100%'}}>
            <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={error.typeError} sx={{width: '100%'}}>
                    {error.messageError}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
