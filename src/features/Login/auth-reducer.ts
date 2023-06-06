import {createSlice} from "@reduxjs/toolkit";
import {commonActions} from "common/commonActions/commonActions";
import {createAppAsyncThunk} from "common/createAppAsyncThunk/createAppAsyncThunk";
import {authAPI, LoginParamsType} from "./auth.api.ts/auth.api";
import {ResultCode} from "enums/enums";


const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/initializeApp', async (arg, {rejectWithValue, dispatch}) => {

    const res = await authAPI.me()

    if (res.data.resultCode === ResultCode.succeeded) {
        return {isLoggedIn: true}
    }
    return rejectWithValue({value: null, showError: false})
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>
('auth/login', async (arg, {rejectWithValue}) => {

    const res = await authAPI.login(arg)
    if (res.data.resultCode === ResultCode.succeeded) {
        return {isLoggedIn: true}
    } else {
        return rejectWithValue(res.data)
    }
})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/logout', async (arg, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI

    const res = await authAPI.logout()
    if (res.data.resultCode === ResultCode.succeeded) {
        dispatch(commonActions())
        return {isLoggedIn: false}
    } else {
        return rejectWithValue(null)
    }

})
const authInitialState = {
    isLoggedIn: false
}

export const slice = createSlice({
    name: 'auth',
    initialState: authInitialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})
export default slice.reducer
export const authThunk = {initializeApp, login, logout}





