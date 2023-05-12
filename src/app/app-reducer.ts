import {authAPI} from 'api/todolists-api'
import {setIsLoggedInAC} from 'features/Login/auth-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "app/store";

export enum RequestStatusType {
    idle = 'idle',
    loading = 'loading',
    succeeded = 'succeeded',
    failed = 'failed'
}

const appInitialState = {
    status: RequestStatusType.idle ,
    error: null as null | string ,
    isInitialized: false
}

export const slice = createSlice({
    name: 'app',
    initialState:appInitialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        },
        setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})
export default slice.reducer
export const {setAppErrorAC,setAppInitializedAC,setAppStatusAC} = slice.actions

export const initializeAppTC = ():AppThunk => (dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}));
        } else {
        }
        dispatch(setAppInitializedAC({isInitialized: true}));
    })
}
