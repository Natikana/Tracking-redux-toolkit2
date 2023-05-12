import {
    RequestStatusType,
    setAppErrorAC,
    setAppStatusAC,
} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import {ActionType} from "../features/Login/auth-reducer";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<ActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error:data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error:'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status:RequestStatusType.failed}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<ActionType>) => {
    dispatch(setAppErrorAC({error:error.message ? error.message : 'Some error occurred'}))
    dispatch(setAppStatusAC({status:RequestStatusType.failed}))
}
