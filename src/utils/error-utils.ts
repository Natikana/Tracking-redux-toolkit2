import {
    setAppErrorAC,
    setAppStatusAC,
} from 'app/app-reducer'
import {RequestStatus, ResponseDataType} from 'api/todolists-api'
import {Dispatch} from 'redux'
import axios, {AxiosError} from "axios";


export const handleServerAppError = <D>(data: ResponseDataType<D>, dispatch: Dispatch) => {
    debugger
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: RequestStatus.failed}))
}

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError<{error:string}>
    if(axios.isAxiosError(err)) {
        const error = err.message ? err.message : 'Some error occurred'
        dispatch(setAppErrorAC({error}))

    } else {
        dispatch(setAppErrorAC({error:`Native error ${err.message}`}))
    }
    dispatch(setAppStatusAC({status:RequestStatus.failed}))
}