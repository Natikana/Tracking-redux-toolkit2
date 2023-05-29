import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, AppRootStateType} from "../../app/store";
import {ResponseDataType} from "../../api/todolists-api";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppDispatch
    rejectValue: ResponseDataType | null
}>()