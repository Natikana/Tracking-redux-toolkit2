import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert'
import {useDispatch, useSelector} from 'react-redux'
import {setAppErrorAC, slice} from 'app/app-reducer'
import {selectError} from "app/app.selectors";
import {useActions} from "../../hooks/useAction";

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

export function ErrorSnackbar() {
    const error = useSelector(selectError);
    const {setAppErrorAC} = useActions(slice.actions)

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setAppErrorAC({error: null})
    }

    const isOpen = error !== null;

    return (
        <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                {error}
            </Alert>
        </Snackbar>
    )
}
