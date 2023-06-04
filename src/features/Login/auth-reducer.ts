import {createSlice} from "@reduxjs/toolkit";
import {commonActions} from "common/commonActions/commonActions";
import {setAppStatusAC, setInitializedAC} from "app/app-reducer";
import {createAppAsyncThunk} from "common/createAppAsyncThunk/createAppAsyncThunk";
import {authAPI, LoginParamsType} from "./auth.api.ts/auth.api";
import {RequestStatus, ResultCode} from "enums/enums";


const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/initializeApp', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI

        const res = await authAPI.me()
        if (res.data.resultCode === ResultCode.succeeded) {
            dispatch(setInitializedAC({isInitialized: true}))
            return {isLoggedIn: true}
        }
            dispatch(setInitializedAC({isInitialized: true}))
            return rejectWithValue(null)

})
const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>
('auth/login', async (arg, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI

        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        const res = await authAPI.login(arg)
        if (res.data.resultCode === ResultCode.succeeded) {
            dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
            return {isLoggedIn: true}
        } else {
            return rejectWithValue(res.data)
        }
})


const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/logout', async (arg, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI

        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        const res = await authAPI.logout()
        if (res.data.resultCode === ResultCode.succeeded) {
            dispatch(commonActions())
            dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
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





