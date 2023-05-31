import {
    setAppErrorAC,
} from 'app/app-reducer'
import {Dispatch} from 'redux'
import axios, {AxiosError} from "axios";
import {ResponseDataType} from "types/types";

/**
 Handles server application errors by dispatching an action to update the application error state.
 @template D - The type of the response data.
 @param {ResponseDataType<D>} data - The response data object.
 @param {Dispatch} dispatch - The dispatch function of Redux which are sending actions to the Redux Store.
 @returns {void}
 */
export const handleServerAppError = <D>(data: ResponseDataType<D>, dispatch: Dispatch) => {
    if (data.messages) {
        dispatch(setAppErrorAC({error: data.messages.length ?  data.messages[0] : 'Some error occurred'}))
    }
}
/**
 Handles network errors that occur during server communication.
 @param {unknown} e - The error is happened when the request has been sent to the Server.
 @param {Dispatch} dispatch - The dispatch function of Redux which are sending actions to the Redux Store.
 @returns {void}
 */
export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError<{ error: string }>
    if (axios.isAxiosError(err)) {
        const error = err.message ? err.message : 'Some error occurred'
        dispatch(setAppErrorAC({error}))
    }
        dispatch(setAppErrorAC({error: `Native error ${err.message}`}))
}