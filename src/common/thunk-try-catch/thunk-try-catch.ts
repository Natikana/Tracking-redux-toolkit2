import {AppDispatch, AppRootStateType} from 'app/store';
import {handleServerNetworkError} from "utils/error-utils";
import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {setAppStatusAC} from "app/app-reducer";
import {ResponseDataType} from "types/types";
import {RequestStatus} from "enums/enums";



export const thunkTryCatch = async (thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatch, ResponseDataType | null | unknown >, logic: Function) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(setAppStatusAC({status: RequestStatus.loading}))
    try {
        return await logic()
    } catch (e) {
        debugger
        console.log(e)
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatusAC({status: RequestStatus.idle}))
    }
}
