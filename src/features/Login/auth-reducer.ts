import {authAPI, LoginParamsType, RequestStatus, ResultCode} from 'api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createSlice} from "@reduxjs/toolkit";
import {commonActions} from "common/commonActions/commonActions";
import {setAppStatusAC, setInitializedAC} from "app/app-reducer";
import {createAppAsyncThunk} from "common/createAppAsyncThunk/createAppAsyncThunk";


const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/initializeApp', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI

    try {
        const res = await authAPI.me()
        if (res.data.resultCode === ResultCode.succeeded) {
            return {isLoggedIn: true}
        } else {
            return rejectWithValue(null)
        }

    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    } finally {
        dispatch(setInitializedAC({isInitialized: true}))
    }

})
const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>
('auth/login', async (arg, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI

    try {
        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        const res = await authAPI.login(arg)
        if (res.data.resultCode === ResultCode.succeeded) {
            dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
            return {isLoggedIn: true}
        } else {
            return rejectWithValue(res.data)
        }

    } catch (e) {
        return rejectWithValue(e)
    }
})


const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
('auth/logout', async (arg, thunkAPI) => {

    const {dispatch, rejectWithValue} = thunkAPI

    try {
        dispatch(setAppStatusAC({status: RequestStatus.loading}))
        const res = await authAPI.logout()
        if (res.data.resultCode === ResultCode.succeeded) {
            dispatch(commonActions())
            dispatch(setAppStatusAC({status: RequestStatus.succeeded}))
            return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }

    } catch (e) {
        handleServerNetworkError(e, dispatch)
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





