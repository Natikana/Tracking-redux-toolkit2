import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, AppRootStateType} from "app/store";
import {ResponseDataType} from "types/types";


export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppDispatch
    rejectValue: null | unknown | RejectErrors

}>()

type RejectErrors = {
    showError:boolean
    value:ResponseDataType

}